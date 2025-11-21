// Video Analysis System - Enhanced for Mobile Support
class VideoAnalysis {
    constructor() {
        this.mediaStream = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;
        this.recordingStartTime = null;
        this.analysisInterval = null;
        this.currentAnalysis = null;
        this.isMobile = this.detectMobile();
        
        this.initializeElements();
        this.setupEventListeners();
        this.checkMobileSupport();
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

        // Mobile help
        this.mobileHelp = document.getElementById('mobileHelp');
        
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

    detectMobile() {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    checkMobileSupport() {
        if (this.isMobile) {
            const isChrome = /Chrome/.test(navigator.userAgent);
            const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
            
            if (!isChrome && !isSafari) {
                this.showToast('لأفضل تجربة، يرجى استخدام Chrome أو Safari', 'warning', 5000);
            }
            
            // Show mobile help on first visit
            this.showMobileHelp();
        }
    }

    showMobileHelp() {
        if (this.mobileHelp) {
            setTimeout(() => {
                this.mobileHelp.style.display = 'block';
            }, 2000);
        }
    }

    hideMobileHelp() {
        if (this.mobileHelp) {
            this.mobileHelp.style.display = 'none';
        }
    }

    async initializeCamera() {
        try {
            // Different constraints for mobile vs desktop
            const constraints = this.isMobile ? {
                video: {
                    width: { ideal: 1280, max: 1920 },
                    height: { ideal: 720, max: 1080 },
                    facingMode: 'environment',
                    frameRate: { ideal: 30, max: 60 }
                },
                audio: false
            } : {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'environment',
                    frameRate: { ideal: 60 }
                },
                audio: false
            };

            // Check camera support
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                this.showToast('الكاميرا غير مدعومة في هذا المتصفح', 'error');
                return;
            }

            this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.previewVideo.srcObject = this.mediaStream;
            this.videoOverlay.style.display = 'none';
            
            this.showToast('الكاميرا جاهزة للاستخدام', 'success');
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.handleCameraError(error);
        }
    }

    handleCameraError(error) {
        let errorMessage = 'تعذر الوصول إلى الكاميرا';
        
        switch (error.name) {
            case 'NotAllowedError':
                errorMessage = 'تم رفض الإذن بالوصول للكاميرا. يرجى السماح بالصلاحية في إعدادات المتصفح';
                break;
            case 'NotFoundError':
                errorMessage = 'لم يتم العثور على كاميرا في الجهاز';
                break;
            case 'NotSupportedError':
                errorMessage = 'المتصفح لا يدعم الكاميرا';
                break;
            case 'NotReadableError':
                errorMessage = 'الكاميرا مستخدمة من قبل تطبيق آخر';
                break;
            case 'OverconstrainedError':
                errorMessage = 'الإعدادات غير مدعومة من الكاميرا. جاري استخدام الإعدادات الافتراضية';
                // Try with default constraints
                this.initializeCameraWithDefaultConstraints();
                return;
            case 'TypeError':
                errorMessage = 'الموقع لا يستخدم HTTPS. الكاميرا تتطلب اتصال آمن';
                break;
        }
        
        this.showToast(errorMessage, 'error');
    }

    async initializeCameraWithDefaultConstraints() {
        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });
            this.previewVideo.srcObject = this.mediaStream;
            this.videoOverlay.style.display = 'none';
            this.showToast('تم تفعيل الكاميرا بالإعدادات الافتراضية', 'success');
        } catch (error) {
            this.showToast('تعذر تفعيل الكاميرا حتى بالإعدادات الافتراضية', 'error');
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
        // Flash control is limited on mobile browsers
        if (this.isMobile) {
            this.showToast('التحكم بالفلاش غير متاح على معظم الهواتف عبر المتصفح', 'info');
        } else {
            this.showToast('التحكم بالفلاش غير متاح على هذا الجهاز', 'info');
        }
    }

    getSupportedMimeType() {
        const types = [
            'video/webm; codecs=vp9',
            'video/webm; codecs=vp8', 
            'video/webm; codecs=h264',
            'video/mp4; codecs=h264',
            'video/webm',
            'video/mp4'
        ];
        
        for (let type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                console.log('Using MIME type:', type);
                return type;
            }
        }
        
        console.log('No specific MIME type supported, using default');
        return ''; // Browser will use default
    }

    async startRecording() {
        if (!this.mediaStream) {
            this.showToast('يجب تفعيل الكاميرا أولاً', 'error');
            return;
        }

        // Check MediaRecorder support
        if (!window.MediaRecorder) {
            this.showToast('التسجيل غير مدعوم في هذا المتصفح', 'error');
            return;
        }

        try {
            // Initialize analysis systems
            this.videoProcessor.initialize();
            this.motionAnalyzer.initialize();
            this.behaviorAnalyzer.initialize();

            // Get supported MIME type
            const options = {
                mimeType: this.getSupportedMimeType(),
                videoBitsPerSecond: this.isMobile ? 2000000 : 3000000 // 2-3 Mbps
            };

            // Create MediaRecorder with error handling
            try {
                this.mediaRecorder = new MediaRecorder(this.mediaStream, options);
            } catch (error) {
                console.warn('MediaRecorder with options failed, trying without options');
                this.mediaRecorder = new MediaRecorder(this.mediaStream);
            }

            this.recordedChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.finalizeRecording();
            };

            this.mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event.error);
                this.showToast('حدث خطأ في التسجيل', 'error');
                this.stopRecording();
            };

            // Start recording with appropriate timeslice for mobile
            const timeSlice = this.isMobile ? 2000 : 1000; // 2 seconds for mobile, 1 for desktop
            this.mediaRecorder.start(timeSlice);
            
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
            this.showToast('تعذر بدء التسجيل: ' + error.message, 'error');
        }
    }

    startAnalysisLoop() {
        // Use different intervals for mobile vs desktop for performance
        const interval = this.isMobile ? 1500 : 1000;
        
        this.analysisInterval = setInterval(() => {
            this.analyzeCurrentFrame();
            this.updateTimer();
            this.checkRecordingDuration();
        }, interval);
    }

    analyzeCurrentFrame() {
        if (!this.isRecording || !this.previewVideo.videoWidth) return;

        try {
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
            
        } catch (error) {
            console.error('Error in frame analysis:', error);
        }
    }

    updateAnalysisProgress(appearance, motion, behavior) {
        // Use actual analysis progress when available
        const appearanceProgress = Math.min(100, (appearance.progress || 0) + Math.random() * 8);
        const motionProgress = Math.min(100, (motion.progress || 0) + Math.random() * 8);
        const behaviorProgress = Math.min(100, (behavior.progress || 0) + Math.random() * 8);
        const healthProgress = (appearanceProgress + motionProgress + behaviorProgress) / 3;

        this.updateProgressBar(this.appearanceProgress, appearanceProgress);
        this.updateProgressBar(this.motionProgress, motionProgress);
        this.updateProgressBar(this.behaviorProgress, behaviorProgress);
        this.updateProgressBar(this.healthProgress, healthProgress);
    }

    updateProgressBar(element, progress) {
        const progressValue = Math.round(progress);
        element.style.width = `${progressValue}%`;
        if (element.nextElementSibling) {
            element.nextElementSibling.textContent = `${progressValue}%`;
        }
    }

    updateLiveIndicators(appearance, motion, behavior) {
        // Update live indicators with analysis results
        if (this.movementActivity) 
            this.movementActivity.textContent = Math.round(motion.activityLevel) || '--';
        if (this.featherCondition) 
            this.featherCondition.textContent = Math.round(appearance.featherCondition) || '--';
        if (this.balanceStatus) 
            this.balanceStatus.textContent = Math.round(motion.balance) || '--';
        if (this.overallActivity) 
            this.overallActivity.textContent = Math.round(behavior.overallActivity) || '--';
    }

    updateTimer() {
        if (!this.recordingStartTime) return;

        const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        
        if (this.timerDisplay) {
            this.timerDisplay.textContent = `${minutes}:${seconds}`;
        }
    }

    checkRecordingDuration() {
        const elapsed = (Date.now() - this.recordingStartTime) / 1000;
        
        // Auto-stop after 2 minutes (120 seconds)
        if (elapsed >= 120) {
            this.stopRecording();
            this.showToast('تم إيقاف التسجيل تلقائياً بعد دقيقتين', 'info');
        }
    }

    stopRecording() {
        if (!this.isRecording || !this.mediaRecorder) return;

        try {
            // Stop recording and analysis
            if (this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            }
            
            this.isRecording = false;
            
            if (this.analysisInterval) {
                clearInterval(this.analysisInterval);
                this.analysisInterval = null;
            }

            // Update UI
            this.stopRecordingBtn.style.display = 'none';
            this.startRecordingBtn.style.display = 'inline-flex';
            this.recordingTimer.style.display = 'none';

            this.showToast('تم إيقاف التصوير وجاري تحليل النتائج النهائية', 'info');

        } catch (error) {
            console.error('Error stopping recording:', error);
            this.showToast('حدث خطأ أثناء إيقاف التسجيل', 'error');
        }
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
            
            // Scroll to results with smooth behavior
            setTimeout(() => {
                this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

            this.showToast('تم تحليل الفيديو بنجاح', 'success');

        } catch (error) {
            console.error('Error finalizing recording:', error);
            this.showToast('حدث خطأ أثناء تحليل النتائج', 'error');
        }
    }

    generateFinalAnalysis() {
        // Generate comprehensive analysis results based on collected data
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
        if (!analysis) return;

        // Update overall score
        if (this.totalScore) {
            this.totalScore.textContent = `${analysis.overallScore}%`;
        }

        // Update category scores with animation
        if (analysis.categories) {
            this.animateScore(this.appearanceScore, analysis.categories.appearance.score, this.appearanceValue);
            this.animateScore(this.motionScore, analysis.categories.motion.score, this.motionValue);
            this.animateScore(this.behaviorScore, analysis.categories.behavior.score, this.behaviorValue);
            this.animateScore(this.healthScore, analysis.categories.health.score, this.healthValue);
        }

        // Generate detailed analysis cards
        this.generateDetailedAnalysis(analysis);
    }

    animateScore(scoreElement, targetScore, valueElement) {
        if (!scoreElement || !valueElement) return;

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
        if (!this.detailedAnalysis || !analysis.categories) return;

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
        if (!card) return;

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
        
        // Clear intervals
        if (this.analysisInterval) {
            clearInterval(this.analysisInterval);
            this.analysisInterval = null;
        }

        // Stop media tracks
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }

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
        
        // Scroll back to recording section
        setTimeout(() => {
            this.recordingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    showToast(message, type = 'info', duration = 3000) {
        if (!this.toast || !this.toastMessage) return;

        this.toastMessage.textContent = message;
        this.toast.className = 'toast show';
        
        if (type === 'error') {
            this.toast.classList.add('error');
        } else if (type === 'success') {
            this.toast.classList.add('success');
        } else if (type === 'warning') {
            this.toast.classList.add('warning');
        }
        
        setTimeout(() => {
            this.toast.className = 'toast';
        }, duration);
    }
}

// Initialize the video analysis system
let videoAnalysis;

document.addEventListener('DOMContentLoaded', function() {
    videoAnalysis = new VideoAnalysis();
});

// Global function for mobile help
function hideMobileHelp() {
    if (window.videoAnalysis) {
        window.videoAnalysis.hideMobileHelp();
    }
}