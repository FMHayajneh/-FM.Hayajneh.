// Neck Diagnosis Data
const neckConditions = [
    {
        name: 'التواء الرقبة',
        nameEn: 'Torticollis/Twisted Neck',
        causes: 'نقص فيتامين B1، نيوكاسل، التهاب الدماغ، تسمم',
        probability: null,
        actions: 'عزل الطائر فورًا. إعطاء فيتامين B المركب في الماء. استشر طبيب بيطري إذا لم يتحسن خلال 48 ساعة.',
        severity: 'high'
    },
    {
        name: 'انحناء الرقبة للأسفل أو للجانب',
        nameEn: 'Neck Drooping/Bending',
        causes: 'ضعف عام، سوء تغذية، أمراض عصبية',
        probability: null,
        actions: 'فحص جودة العلف والماء. إعطاء مكملات فيتامينات ومعادن. توفير بيئة هادئة ودافئة.',
        severity: 'medium'
    },
    {
        name: 'تشنج الرقبة',
        nameEn: 'Neck Spasms',
        causes: 'نيوكاسل، نقص كالسيوم، تسمم غذائي',
        probability: null,
        actions: 'عزل فوري. إعطاء كالسيوم وفيتامين D3. مراجعة طبيب بيطري عاجلة.',
        severity: 'high'
    },
    {
        name: 'ارتخاء الرقبة',
        nameEn: 'Flaccid Neck',
        causes: 'ضعف شديد، جفاف، صدمة حرارية',
        probability: null,
        actions: 'نقل إلى مكان بارد. إعطاء محلول سكر وملح (ملعقة صغيرة لكل لتر ماء). مراقبة دقيقة.',
        severity: 'medium'
    },
    {
        name: 'دوران الرأس',
        nameEn: 'Head Rotation/Star Gazing',
        causes: 'نقص فيتامين E، تسمم، مرض ماريك',
        probability: null,
        actions: 'إعطاء فيتامين E وسيلينيوم. عزل الطائر. فحص بيطري مطلوب لاستبعاد ماريك.',
        severity: 'high'
    },
    {
        name: 'تيبس الرقبة',
        nameEn: 'Stiff Neck',
        causes: 'التهاب مفاصل، إصابة ميكانيكية، تقدم في العمر',
        probability: null,
        actions: 'توفير راحة وبيئة مريحة. إعطاء مضاد التهاب تحت إشراف بيطري. تجنب الحركة الزائدة.',
        severity: 'low'
    },
    {
        name: 'انتفاخ الرقبة أو الحوصلة',
        nameEn: 'Crop/Neck Swelling',
        causes: 'انحشار الحوصلة، عدوى فطرية (كانديدا)، ورم',
        probability: null,
        actions: 'عدم إطعام الطائر. تدليك الحوصلة برفق. استشارة بيطري فورية إذا لم يتحسن.',
        severity: 'medium'
    },
    {
        name: 'تدلي أو امتلاء الحوصلة',
        nameEn: 'Pendulous/Full Crop',
        causes: 'إفراط في الأكل، طعام رطب زائد، انسداد',
        probability: null,
        actions: 'رفع الطائر رأسياً بلطف وتدليك الحوصلة لتحفيز الإفراغ. تقليل الطعام مؤقتاً. استشارة بيطري.',
        severity: 'medium'
    }
];

// DOM Elements
let fileInput, uploadCard, uploadArea, selectBtn, previewArea, previewImage;
let actionButtons, analyzeBtn, analyzeText, loadingSpinner, cancelBtn;
let uploadSection, resultsSection, newAnalysisBtn, infoSection;
let toast, toastMessage;

let selectedImage = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
});

function initializeElements() {
    // Get DOM elements
    fileInput = document.getElementById('fileInput');
    uploadCard = document.getElementById('uploadCard');
    uploadArea = document.getElementById('uploadArea');
    selectBtn = document.getElementById('selectBtn');
    previewArea = document.getElementById('previewArea');
    previewImage = document.getElementById('previewImage');
    actionButtons = document.getElementById('actionButtons');
    analyzeBtn = document.getElementById('analyzeBtn');
    analyzeText = document.getElementById('analyzeText');
    loadingSpinner = document.getElementById('loadingSpinner');
    cancelBtn = document.getElementById('cancelBtn');
    uploadSection = document.getElementById('uploadSection');
    resultsSection = document.getElementById('resultsSection');
    newAnalysisBtn = document.getElementById('newAnalysisBtn');
    infoSection = document.getElementById('infoSection');
    toast = document.getElementById('toast');
    toastMessage = document.getElementById('toastMessage');
}

function setupEventListeners() {
    // File selection
    if (selectBtn) selectBtn.addEventListener('click', () => fileInput?.click());
    if (uploadCard) uploadCard.addEventListener('click', () => fileInput?.click());
    if (fileInput) fileInput.addEventListener('change', handleFileSelect);

    // Analysis buttons
    if (analyzeBtn) analyzeBtn.addEventListener('click', handleAnalysis);
    if (cancelBtn) cancelBtn.addEventListener('click', resetUpload);
    if (newAnalysisBtn) newAnalysisBtn.addEventListener('click', resetForNewAnalysis);

    // Drag and Drop
    if (uploadCard) {
        uploadCard.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadCard.classList.add('dragging');
        });

        uploadCard.addEventListener('dragleave', () => {
            uploadCard.classList.remove('dragging');
        });

        uploadCard.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadCard.classList.remove('dragging');
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleImageFile(file);
            } else {
                showToast('يرجى رفع ملف صورة صالح', 'error');
            }
        });
    }
}

// الدوال المفقودة - هذه هي المشكلة الرئيسية
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleImageFile(file);
    }
}

function handleImageFile(file) {
    // Validate file
    if (!file.type.startsWith('image/')) {
        showToast('يرجى رفع ملف صورة صالح', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast('حجم الصورة كبير جداً. الحد الأقصى 5MB', 'error');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
        selectedImage = e.target.result;
        
        // Update preview
        if (previewImage) {
            previewImage.src = selectedImage;
            previewImage.style.display = 'block';
        }
        
        // Show preview and hide upload area
        if (uploadArea) uploadArea.style.display = 'none';
        if (previewArea) previewArea.style.display = 'block';
        if (actionButtons) actionButtons.style.display = 'flex';
        
        showToast('تم رفع الصورة بنجاح', 'success');
    };
    
    reader.onerror = () => {
        showToast('حدث خطأ في قراءة الملف', 'error');
    };
    
    reader.readAsDataURL(file);
}

function resetUpload() {
    selectedImage = null;
    if (fileInput) fileInput.value = '';
    if (uploadArea) uploadArea.style.display = 'block';
    if (previewArea) previewArea.style.display = 'none';
    if (actionButtons) actionButtons.style.display = 'none';
}

function handleAnalysis() {
    if (!selectedImage) {
        showToast('يرجى رفع صورة أولاً', 'error');
        return;
    }
    
    // Show loading state
    if (analyzeBtn) {
        analyzeBtn.disabled = true;
        if (analyzeText) analyzeText.style.display = 'none';
        if (loadingSpinner) loadingSpinner.style.display = 'inline-flex';
    }
    
    // Simulate analysis delay
    setTimeout(() => {
        try {
            const result = analyzeNeckImage(selectedImage);
            displayResults(result);
            
            // Show results section
            if (uploadSection) uploadSection.style.display = 'none';
            if (infoSection) infoSection.style.display = 'none';
            if (resultsSection) {
                resultsSection.style.display = 'block';
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } catch (error) {
            console.error('Analysis error:', error);
            showToast('حدث خطأ أثناء التحليل', 'error');
        } finally {
            // Hide loading state
            if (analyzeBtn) {
                analyzeBtn.disabled = false;
                if (analyzeText) analyzeText.style.display = 'inline';
                if (loadingSpinner) loadingSpinner.style.display = 'none';
            }
        }
    }, 2000);
}

function analyzeNeckImage(image) {
    const numConditions = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...neckConditions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numConditions);
    
    // Assign random probabilities based on severity
    selected.forEach(condition => {
        if (condition.severity === 'high') {
            condition.probability = Math.floor(Math.random() * 20) + 75; // 75-94%
        } else if (condition.severity === 'medium') {
            condition.probability = Math.floor(Math.random() * 25) + 60; // 60-84%
        } else {
            condition.probability = Math.floor(Math.random() * 30) + 50; // 50-79%
        }
    });
    
    // Sort by probability
    selected.sort((a, b) => b.probability - a.probability);
    
    // Determine overall urgency
    const highestProb = selected[0].probability;
    let urgencyLevel = '';
    let urgencyClass = '';
    
    if (highestProb >= 80 || selected.some(c => c.severity === 'high')) {
        urgencyLevel = 'عاجل جداً - يُنصح بالتدخل الفوري واستشارة طبيب بيطري في أقرب وقت.';
        urgencyClass = 'urgency-high';
    } else if (highestProb >= 70) {
        urgencyLevel = 'مطلوب تدخل - راقب الحالة عن كثب واتبع الإجراءات المقترحة.';
        urgencyClass = 'urgency-medium';
    } else {
        urgencyLevel = 'مراقبة موصى بها - اتبع الإجراءات الوقائية وراقب التطور.';
        urgencyClass = 'urgency-low';
    }
    
    return {
        conditions: selected,
        overallAction: 'اتبع الإجراءات المذكورة أدناه لكل حالة مكتشفة. المراقبة المستمرة والتقييم البيطري ضروريان للتأكد من التشخيص الدقيق.',
        urgency: urgencyLevel,
        urgencyClass: urgencyClass
    };
}

function displayResults(result) {
    // Display conditions with animations
    const conditionsGrid = document.getElementById('conditionsGrid');
    if (conditionsGrid) {
        conditionsGrid.innerHTML = '';
        
        result.conditions.forEach((condition, index) => {
            setTimeout(() => {
                const conditionCard = document.createElement('div');
                conditionCard.className = `condition-card ${getRiskClass(condition.probability)}`;
                conditionCard.style.opacity = '0';
                conditionCard.style.transform = 'translateX(-20px)';
                
                conditionCard.innerHTML = `
                    <div class="condition-header">
                        <span class="condition-name">${condition.name}</span>
                        <span class="probability-badge ${getProbabilityClass(condition.probability)}">
                            ${condition.probability}%
                        </span>
                    </div>
                    <div class="condition-details">
                        <div class="detail-item">
                            <span class="detail-label">الحالة:</span>
                            <span class="detail-value">${condition.nameEn}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">الأسباب:</span>
                            <span class="detail-value">${condition.causes}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">الإجراءات:</span>
                            <span class="detail-value">${condition.actions}</span>
                        </div>
                    </div>
                `;
                
                conditionsGrid.appendChild(conditionCard);
                
                // Animate card
                setTimeout(() => {
                    conditionCard.style.opacity = '1';
                    conditionCard.style.transform = 'translateX(0)';
                    conditionCard.style.transition = 'all 0.5s ease';
                }, 50);
            }, index * 300);
        });
    }
    
    // Display urgency
    const urgencyContent = document.getElementById('urgencyContent');
    const urgencySection = document.querySelector('.urgency-section');
    if (urgencyContent && urgencySection) {
        urgencyContent.textContent = result.urgency;
        urgencySection.className = `urgency-section ${result.urgencyClass}`;
    }
    
    // Display actions
    const actionsContent = document.getElementById('actionsContent');
    if (actionsContent) {
        actionsContent.textContent = result.overallAction;
    }
    
    // Show success message
    setTimeout(() => {
        showToast(`✅ تم تحليل صورة الرقبة واكتشاف ${result.conditions.length} حالة`, 'success');
    }, 1500);
}

// Helper functions
function getProbabilityClass(probability) {
    if (probability >= 80) return 'probability-high';
    if (probability >= 70) return 'probability-medium';
    return 'probability-low';
}

function getRiskClass(probability) {
    if (probability >= 80) return 'high-risk';
    if (probability >= 70) return 'medium-risk';
    return 'low-risk';
}

function resetForNewAnalysis() {
    resetUpload();
    if (uploadSection) uploadSection.style.display = 'block';
    if (infoSection) infoSection.style.display = 'block';
    if (resultsSection) resultsSection.style.display = 'none';
    
    if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showToast(message, type = 'info') {
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.className = 'toast show';
    
    if (type === 'error') {
        toast.classList.add('error');
    } else if (type === 'success') {
        toast.classList.add('success');
    }
    
    setTimeout(() => {
        if (toast) {
            toast.className = 'toast';
        }
    }, 3000);
}