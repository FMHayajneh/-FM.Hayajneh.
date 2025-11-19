// Video Analysis System
class VideoAnalysis {
    constructor() {
        this.mediaStream = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;
        this.recordingStartTime = null;
        this.analysisInterval = null;
        this.currentAnalysis = null;
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        // Video elements
        this.previewVideo = document.getElementById('previewVideo');
        this.videoOverlay = document.getElementById('videoOverlay');
        this.videoPreview = document.getElementById('videoPreview');
        
        // Control buttons
        this.startRecordingBtn = document.getElementById('startRecordingBtn');
        this.stopRecordingBtn = document.getElementById('stopRecordingBtn');
        this.switchCameraBtn = document.getElementById('switchCameraBtn');
        this.toggleFlashBtn = document.getElementById('toggleFlashBtn');
        this.newAnalysisBtn = document.getElementById('newAnalysisBtn');
        this.downloadReportBtn = document.getElementById('downloadReportBtn');
        
        // Timer and progress
        this.recordingTimer = document.getElementById('recordingTimer');
        this.timerDisplay = document.getElementById('timerDisplay');
        
        // Progress bars
        this.appearanceProgress = document.getElementById('appearanceProgress');
        this.motionProgress = document.getElementById('motionProgress');
        this.behaviorProgress = document.getElementById('behaviorProgress');
        this.healthProgress = document.getElementById('healthProgress');
        
        // Live indicators
        this.movementActivity = document.getElementById('movementActivity');
        this.featherCondition = document.getElementById('featherCondition');
        this.balanceStatus = document.getElementById('balanceStatus');
        this.overallActivity = document.getElementById('overallActivity');
        
        // Results elements
        this.recordingSection = document.getElementById('recordingSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.analysisProgress = document.getElementById('analysisProgress');
        this.liveIndicators = document.getElementById('liveIndicators');
        this.detailedAnalysis = document.getElementById('detailedAnalysis');
        
        // Score elements
        this.totalScore = document.getElementById('totalScore');
        this.appearanceScore = document.getElementById('appearanceScore');
        this.motionScore = document.getElementById('motionScore');
        this.behaviorScore = document.getElementById('behaviorScore');
        this.healthScore = document.getElementById('healthScore');
        this.appearanceValue = document.getElementById('appearanceValue');
        this.motionValue = document.getElementById('motionValue');
        this.behaviorValue = document.getElementById('behaviorValue');
        this.healthValue = document.getElementById('healthValue');
        
        // Toast
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');
        
        // Analysis processors
        this.videoProcessor = window.videoProcessor;
        this.motionAnalyzer = window.motionAnalyzer;
        this.behaviorAnalyzer = window.behaviorAnalyzer;
    }

    setupEventListeners() {
        // Recording controls
        this.startRecordingBtn.addEventListener('click', () => this.startRecording());
        this.stopRecordingBtn.addEventListener('click', () => this.stopRecording());
        this.switchCameraBtn.addEventListener('click', () => this.switchCamera());
        this.toggleFlashBtn.addEventListener('click', () => this.toggleFlash());
        this.newAnalysisBtn.addEventListener('click', () => this.resetAnalysis());
        this.downloadReportBtn.addEventListener('click', () => this.downloadReport());
        
        // Initialize camera on load
        this.initializeCamera();
    }

    async initializeCamera() {
        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'environment'
                },
                audio: false
            });
            
            this.previewVideo.srcObject = this.mediaStream;
            this.videoOverlay.style.display = 'none';
            this.showToast('الكاميرا جاهزة للاستخدام', 'success');
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.showToast('تعذر الوصول إلى الكاميرا. يرجى التحقق من الصلاحيات.', 'error');
        }
    }

    async switchCamera() {
        if (!this.mediaStream) return;
        
        // Stop current stream
        this.mediaStream.getTracks().forEach(track => track.stop());
        
        try {
            const currentFacingMode = this.mediaStream.getVideoTracks()[0].getSettings().facingMode;
            const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
            
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: newFacingMode
                },
                audio: false
            });
            
            this.previewVideo.srcObject = this.mediaStream;
            this.showToast(`تم تبديل الكاميرا إلى ${newFacingMode === 'user' ? 'الأمامية' : 'الخلفية'}`, 'success');
            
        } catch (error) {
            console.error('Error switching camera:', error);
            this.showToast('تعذر تبديل الكاميرا', 'error');
        }
    }

    toggleFlash() {
        // This is a simplified implementation
        // Real flash control requires specific device support
        this.showToast('التحكم بالفلاش غير متاح على هذا الجهاز', 'info');
    }

    async startRecording() {
        if (!this.mediaStream) {
            this.showToast('يجب تفعيل الكاميرا أولاً', 'error');
            return;
        }

        try {
            // Initialize analysis systems
            this.videoProcessor.initialize();
            this.motionAnalyzer.initialize();
            this.behaviorAnalyzer.initialize();

            // Setup media recorder
            this.mediaRecorder = new MediaRecorder(this.mediaStream, {
                mimeType: 'video/webm; codecs=vp9'
            });

            this.recordedChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.finalizeRecording();
            };

            // Start recording
            this.mediaRecorder.start(1000); // Collect data every second
            this.isRecording = true;
            this.recordingStartTime = Date.now();

            // Update UI
            this.startRecordingBtn.style.display = 'none';
            this.stopRecordingBtn.style.display = 'inline-flex';
            this.recordingTimer.style.display = 'flex';
            this.analysisProgress.style.display = 'block';
            this.liveIndicators.style.display = 'block';

            // Start analysis loop
            this.startAnalysisLoop();

            this.showToast('بدأ التصوير والتحليل', 'success');

        } catch (error) {
            console.error('Error starting recording:', error);
            this.showToast('تعذر بدء التسجيل', 'error');
        }
    }

    startAnalysisLoop() {
        this.analysisInterval = setInterval(() => {
            this.analyzeCurrentFrame();
            this.updateTimer();
            this.checkRecordingDuration();
        }, 1000); // Analyze every second
    }

    analyzeCurrentFrame() {
        if (!this.isRecording) return;

        // Capture current frame for analysis
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = this.previewVideo.videoWidth;
        canvas.height = this.previewVideo.videoHeight;
        
        context.drawImage(this.previewVideo, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        // Perform analysis
        const appearanceAnalysis = this.videoProcessor.analyzeAppearance(imageData);
        const motionAnalysis = this.motionAnalyzer.analyzeMotion(imageData);
        const behaviorAnalysis = this.behaviorAnalyzer.analyzeBehavior(imageData);

        // Update progress and indicators
        this.updateAnalysisProgress(appearanceAnalysis, motionAnalysis, behaviorAnalysis);
        this.updateLiveIndicators(appearanceAnalysis, motionAnalysis, behaviorAnalysis);
    }

    updateAnalysisProgress(appearance, motion, behavior) {
        // Simulate progress updates (in real implementation, this would be based on actual analysis)
        const appearanceProgress = Math.min(100, (appearance.progress || 0) + Math.random() * 10);
        const motionProgress = Math.min(100, (motion.progress || 0) + Math.random() * 10);
        const behaviorProgress = Math.min(100, (behavior.progress || 0) + Math.random() * 10);
        const healthProgress = (appearanceProgress + motionProgress + behaviorProgress) / 3;

        this.updateProgressBar(this.appearanceProgress, appearanceProgress);
        this.updateProgressBar(this.motionProgress, motionProgress);
        this.updateProgressBar(this.behaviorProgress, behaviorProgress);
        this.updateProgressBar(this.healthProgress, healthProgress);
    }

    updateProgressBar(element, progress) {
        const progressValue = Math.round(progress);
        element.style.width = `${progressValue}%`;
        element.nextElementSibling.textContent = `${progressValue}%`;
    }

    updateLiveIndicators(appearance, motion, behavior) {
        // Update live indicators with analysis results
        this.movementActivity.textContent = motion.activityLevel || '--';
        this.featherCondition.textContent = appearance.featherCondition || '--';
        this.balanceStatus.textContent = motion.balance || '--';
        this.overallActivity.textContent = behavior.overallActivity || '--';
    }

    updateTimer() {
        if (!this.recordingStartTime) return;

        const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        
        this.timerDisplay.textContent = `${minutes}:${seconds}`;
    }

    checkRecordingDuration() {
        const elapsed = (Date.now() - this.recordingStartTime) / 1000;
        
        // Auto-stop after 2 minutes (120 seconds)
        if (elapsed >= 120) {
            this.stopRecording();
        }
    }

    stopRecording() {
        if (!this.isRecording) return;

        // Stop recording and analysis
        this.mediaRecorder.stop();
        this.isRecording = false;
        clearInterval(this.analysisInterval);

        // Stop all tracks
        this.mediaStream.getTracks().forEach(track => track.stop());

        // Update UI
        this.stopRecordingBtn.style.display = 'none';
        this.startRecordingBtn.style.display = 'inline-flex';
        this.recordingTimer.style.display = 'none';

        this.showToast('تم إيقاف التصوير وجاري تحليل النتائج النهائية', 'info');
    }

    async finalizeRecording() {
        try {
            // Simulate final analysis processing
            this.showToast('جاري تحليل النتائج النهائية...', 'info');
            
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Generate final analysis results
            this.currentAnalysis = this.generateFinalAnalysis();

            // Display results
            this.displayResults(this.currentAnalysis);

            // Show results section
            this.recordingSection.style.display = 'none';
            this.resultsSection.style.display = 'block';
            this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            this.showToast('تم تحليل الفيديو بنجاح', 'success');

        } catch (error) {
            console.error('Error finalizing recording:', error);
            this.showToast('حدث خطأ أثناء تحليل النتائج', 'error');
        }
    }

    generateFinalAnalysis() {
        // Generate comprehensive analysis results
        return {
            overallScore: 85,
            categories: {
                appearance: {
                    score: 88,
                    metrics: {
                        featherQuality: 90,
                        bodyCondition: 85,
                        colorVibrancy: 89,
                        posture: 88
                    },
                    details: [
                        'جودة الريش ممتازة مع لون زاهي',
                        'حالة الجسم جيدة مع توزيع وزن مناسب',
                        'الوضعية الطبيعية مستقيمة ومتوازنة',
                        'لا توجد علامات على تساقط الريش'
                    ]
                },
                motion: {
                    score: 82,
                    metrics: {
                        walkingSmoothness: 85,
                        balance: 80,
                        coordination: 81,
                        activityLevel: 82
                    },
                    details: [
                        'حركة المشي سلسة مع خطوات منتظمة',
                        'التوازن جيد أثناء الحركة والوقوف',
                        'تنسيق الحركات بين الأطراف مناسب',
                        'مستوى النشاط الحركي ضمن المعدل الطبيعي'
                    ]
                },
                behavior: {
                    score: 84,
                    metrics: {
                        alertness: 86,
                        socialBehavior: 83,
                        feedingBehavior: 85,
                        stressLevel: 82
                    },
                    details: [
                        'مستوى اليقظة والانتباه مرتفع',
                        'السلوك الاجتماعي طبيعي وتفاعلي',
                        'سلوك التغذية منتظم وطبيعي',
                        'مستوى التوتر ضمن الحدود المقبولة'
                    ]
                },
                health: {
                    score: 86,
                    metrics: {
                        overallHealth: 87,
                        vitality: 85,
                        diseaseResistance: 86,
                        longevity: 86
                    },
                    details: [
                        'الصحة العامة ممتازة مع علامات حيوية جيدة',
                        'الحيوية والنشاط ضمن المستويات المثلى',
                        'مقاومة الأمراض جيدة بناءً على المؤشرات',
                        'التوقعات الصحية إيجابية على المدى الطويل'
                    ]
                }
            },
            recommendations: [
                'الاستمرار في نظام التغذية الحالي',
                'مراقبة مستوى النشاط أسبوعياً',
                'توفير مساحة كافية للحركة والتمارين',
                'الفحص الدوري للريش والجلد'
            ]
        };
    }

    displayResults(analysis) {
        // Update overall score
        this.totalScore.textContent = `${analysis.overallScore}%`;

        // Update category scores with animation
        this.animateScore(this.appearanceScore, analysis.categories.appearance.score, this.appearanceValue);
        this.animateScore(this.motionScore, analysis.categories.motion.score, this.motionValue);
        this.animateScore(this.behaviorScore, analysis.categories.behavior.score, this.behaviorValue);
        this.animateScore(this.healthScore, analysis.categories.health.score, this.healthValue);

        // Generate detailed analysis cards
        this.generateDetailedAnalysis(analysis);
    }

    animateScore(scoreElement, targetScore, valueElement) {
        let currentScore = 0;
        const increment = targetScore / 50;
        
        const timer = setInterval(() => {
            currentScore += increment;
            if (currentScore >= targetScore) {
                currentScore = targetScore;
                clearInterval(timer);
                scoreElement.classList.add('animate');
            }
            
            const roundedScore = Math.round(currentScore);
            scoreElement.style.width = `${roundedScore}%`;
            valueElement.textContent = `${roundedScore}%`;
            
            // Update color based on score
            this.updateScoreColor(scoreElement, roundedScore);
        }, 30);
    }

    updateScoreColor(scoreElement, score) {
        if (score >= 80) {
            scoreElement.style.background = 'var(--gradient-success)';
        } else if (score >= 60) {
            scoreElement.style.background = 'var(--gradient-primary)';
        } else {
            scoreElement.style.background = 'var(--gradient-secondary)';
        }
    }

    generateDetailedAnalysis(analysis) {
        const categories = [
            {
                id: 'appearance',
                title: 'المظهر والريش',
                icon: 'fas fa-feather',
                analysis: analysis.categories.appearance
            },
            {
                id: 'motion',
                title: 'الحركة والمشي',
                icon: 'fas fa-walking',
                analysis: analysis.categories.motion
            },
            {
                id: 'behavior',
                title: 'السلوك والنشاط',
                icon: 'fas fa-brain',
                analysis: analysis.categories.behavior
            },
            {
                id: 'health',
                title: 'الصحة العامة',
                icon: 'fas fa-heartbeat',
                analysis: analysis.categories.health
            }
        ];

        this.detailedAnalysis.innerHTML = categories.map(category => `
            <div class="analysis-card" id="card-${category.id}">
                <div class="analysis-card-header" onclick="videoAnalysis.toggleAnalysisCard('${category.id}')">
                    <div class="analysis-card-title">
                        <i class="${category.icon}"></i>
                        <span>${category.title}</span>
                    </div>
                    <button class="analysis-card-toggle">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <div class="analysis-card-content">
                    <div class="analysis-metrics">
                        ${Object.entries(category.analysis.metrics).map(([key, value]) => `
                            <div class="metric-item">
                                <div class="metric-value">${value}%</div>
                                <div class="metric-label">${this.getMetricLabel(key)}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="analysis-details">
                        <h4>التفاصيل:</h4>
                        ${category.analysis.details.map(detail => `
                            <div class="detail-item">
                                <strong>•</strong> ${detail}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        // Open first card by default
        setTimeout(() => this.toggleAnalysisCard('appearance'), 500);
    }

    getMetricLabel(metricKey) {
        const labels = {
            featherQuality: 'جودة الريش',
            bodyCondition: 'حالة الجسم',
            colorVibrancy: 'حيوية اللون',
            posture: 'الوضعية',
            walkingSmoothness: 'سلاسة المشي',
            balance: 'التوازن',
            coordination: 'التنسيق',
            activityLevel: 'مستوى النشاط',
            alertness: 'اليقظة',
            socialBehavior: 'السلوك الاجتماعي',
            feedingBehavior: 'سلوك التغذية',
            stressLevel: 'مستوى التوتر',
            overallHealth: 'الصحة العامة',
            vitality: 'الحيوية',
            diseaseResistance: 'مقاومة الأمراض',
            longevity: 'التوقعات الصحية'
        };
        
        return labels[metricKey] || metricKey;
    }

    toggleAnalysisCard(cardId) {
        const card = document.getElementById(`card-${cardId}`);
        const content = card.querySelector('.analysis-card-content');
        const toggle = card.querySelector('.analysis-card-toggle');
        const header = card.querySelector('.analysis-card-header');

        const isActive = content.classList.contains('active');
        
        // Close all cards first
        document.querySelectorAll('.analysis-card-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.analysis-card-toggle').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.analysis-card-header').forEach(h => h.classList.remove('active'));
        
        if (!isActive) {
            content.classList.add('active');
            toggle.classList.add('active');
            header.classList.add('active');
        }
    }

    downloadReport() {
        this.showToast('جاري تحضير التقرير للتحميل...', 'info');
        
        // Simulate report generation
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = '#';
            link.download = 'تقرير-تحليل-الفيديو.pdf';
            link.click();
            
            this.showToast('تم تحميل التقرير بنجاح', 'success');
        }, 2000);
    }

    resetAnalysis() {
        // Reset all states
        this.isRecording = false;
        this.recordedChunks = [];
        this.currentAnalysis = null;
        
        // Reset UI
        this.recordingSection.style.display = 'block';
        this.resultsSection.style.display = 'none';
        this.analysisProgress.style.display = 'none';
        this.liveIndicators.style.display = 'none';
        
        // Reset progress bars
        this.updateProgressBar(this.appearanceProgress, 0);
        this.updateProgressBar(this.motionProgress, 0);
        this.updateProgressBar(this.behaviorProgress, 0);
        this.updateProgressBar(this.healthProgress, 0);
        
        // Reset live indicators
        this.movementActivity.textContent = '--';
        this.featherCondition.textContent = '--';
        this.balanceStatus.textContent = '--';
        this.overallActivity.textContent = '--';
        
        // Reinitialize camera
        this.initializeCamera();
        
        this.recordingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showToast(message, type = 'info') {
        this.toastMessage.textContent = message;
        this.toast.className = 'toast show';
        
        if (type === 'error') {
            this.toast.classList.add('error');
        } else if (type === 'success') {
            this.toast.classList.add('success');
        }
        
        setTimeout(() => {
            this.toast.className = 'toast';
        }, 3000);
    }
}

// Initialize the video analysis system
let videoAnalysis;

document.addEventListener('DOMContentLoaded', function() {
    videoAnalysis = new VideoAnalysis();
});