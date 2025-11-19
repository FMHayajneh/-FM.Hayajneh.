// Disease mapping with risk levels and treatments
const diseaseMapping = {
    "light_green": {
        colorAr: "أخضر فاتح",
        diseases: [
            { name: "نيوكاسل (Newcastle)", risk: 85 },
            { name: "إنفلونزا الطيور", risk: 78 },
            { name: "كوليرا الدجاج", risk: 72 }
        ],
        conditions: [
            { name: "الجوع", risk: 45 },
            { name: "فشل الكبد", risk: 68 },
            { name: "التسمم", risk: 55 }
        ],
        intervention: "تدخل بيطري عاجل مطلوب - احتمالية عالية لأمراض معدية خطيرة",
        treatment: "عزل فوري للطيور المصابة. إعطاء مضادات حيوية واسعة الطيف تحت إشراف بيطري. تطهير المكان بالكامل. تحسين التهوية وجودة العلف."
    },
    "yellow_mustard": {
        colorAr: "أصفر/خردلي",
        diseases: [
            { name: "داء الرأس الأسود (Blackhead)", risk: 75 },
            { name: "كوكسيديا الأعور", risk: 70 }
        ],
        conditions: [
            { name: "مشاكل الكبد", risk: 65 }
        ],
        intervention: "تدخل سريع موصى به - مراقبة دقيقة ضرورية",
        treatment: "إعطاء أدوية مضادة للكوكسيديا (أمبروليوم). تحسين النظافة والتهوية. إضافة فيتامينات A وK للدعم الكبدي. فحص بيطري خلال 24-48 ساعة."
    },
    "red_bloody": {
        colorAr: "أحمر/بني دموي",
        diseases: [
            { name: "كوكسيديا (Coccidiosis)", risk: 90 }
        ],
        conditions: [
            { name: "التهاب أمعاء تنخري", risk: 72 },
            { name: "إصابة داخلية", risk: 50 }
        ],
        intervention: "حالة طارئة - تدخل بيطري فوري مطلوب",
        treatment: "إعطاء أمبروليوم أو سلفاميثازين فوراً. توفير ماء نظيف مع إلكتروليتات. عزل الطيور المصابة. مراجعة بيطرية عاجلة لمنع الوفيات."
    },
    "orange": {
        colorAr: "برتقالي",
        diseases: [
            { name: "ما بعد كوكسيديا", risk: 60 }
        ],
        conditions: [
            { name: "تلف كبد حاد", risk: 75 }
        ],
        intervention: "مراقبة مكثفة - استشارة بيطرية موصى بها",
        treatment: "إعطاء فيتامينات B المركبة وفيتامين K. تحسين جودة العلف. توفير بروتين عالي الجودة. متابعة بيطرية خلال 48 ساعة."
    },
    "white_chalky": {
        colorAr: "أبيض/طباشيري",
        diseases: [
            { name: "التهاب الشعب الكلوي", risk: 80 },
            { name: "النقرس (Gout)", risk: 70 }
        ],
        conditions: [
            { name: "فشل كلوي", risk: 65 },
            { name: "جفاف", risk: 55 }
        ],
        intervention: "تدخل بيطري عاجل - مشاكل كلوية محتملة",
        treatment: "زيادة كمية الماء المتاح. تقليل البروتين في العلف مؤقتاً (14-16%). إعطاء فيتامين A. فحص بيطري لتحديد السبب الدقيق."
    },
    "undigested_feed": {
        colorAr: "يحتوي علف غير مهضوم",
        diseases: [
            { name: "سوء امتصاص (Malabsorption)", risk: 65 }
        ],
        conditions: [
            { name: "جودة علف سيئة", risk: 70 },
            { name: "عبور سريع للأمعاء", risk: 60 }
        ],
        intervention: "مراقبة وتحسين - فحص جودة العلف والماء",
        treatment: "فحص جودة وتخزين العلف. إضافة إنزيمات هضمية وبروبيوتيك. توفير حصى للدجاج. تقليل التوتر والازدحام. استشارة خبير تغذية."
    }
};

const textures = ["سائل", "عادي", "صلب", "رغوي", "مخاطي"];

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

// الدوال الأساسية لمعالجة الصور
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
            const result = analyzeFecesImage(selectedImage);
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

function analyzeFecesImage(image) {
    // Placeholder - replace with actual AI analysis
    const categories = Object.keys(diseaseMapping);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const data = diseaseMapping[randomCategory];
    const randomTexture = textures[Math.floor(Math.random() * textures.length)];
    
    return {
        color: data.colorAr,
        texture: randomTexture,
        diseases: data.diseases,
        conditions: data.conditions,
        intervention: data.intervention,
        treatment: data.treatment
    };
}

function displayResults(result) {
    // Display basic info with animations
    const colorBadge = document.getElementById('colorBadge');
    const textureBadge = document.getElementById('textureBadge');
    
    if (colorBadge) {
        colorBadge.textContent = result.color;
        colorBadge.style.opacity = '0';
        setTimeout(() => {
            colorBadge.style.opacity = '1';
            colorBadge.style.transform = 'scale(1.1)';
            setTimeout(() => {
                colorBadge.style.transform = 'scale(1)';
            }, 300);
        }, 200);
    }
    
    if (textureBadge) {
        textureBadge.textContent = result.texture;
        textureBadge.style.opacity = '0';
        setTimeout(() => {
            textureBadge.style.opacity = '1';
            textureBadge.style.transform = 'scale(1.1)';
            setTimeout(() => {
                textureBadge.style.transform = 'scale(1)';
            }, 300);
        }, 400);
    }
    
    // Display diseases with animations
    const diseaseGrid = document.getElementById('diseaseGrid');
    if (diseaseGrid) {
        diseaseGrid.innerHTML = '';
        
        result.diseases.forEach((disease, index) => {
            setTimeout(() => {
                const diseaseCard = document.createElement('div');
                diseaseCard.className = `disease-card ${getRiskClass(disease.risk)}`;
                diseaseCard.style.opacity = '0';
                diseaseCard.style.transform = 'translateX(-20px)';
                
                diseaseCard.innerHTML = `
                    <div class="disease-header">
                        <span class="disease-name">${disease.name}</span>
                        <span class="risk-badge ${getRiskBadgeClass(disease.risk)}">
                            ${disease.risk}%
                        </span>
                    </div>
                `;
                
                diseaseGrid.appendChild(diseaseCard);
                
                // Animate card
                setTimeout(() => {
                    diseaseCard.style.opacity = '1';
                    diseaseCard.style.transform = 'translateX(0)';
                    diseaseCard.style.transition = 'all 0.5s ease';
                }, 50);
            }, index * 300);
        });
    }
    
    // Display conditions with animations
    const conditionsGrid = document.getElementById('conditionsGrid');
    if (conditionsGrid) {
        conditionsGrid.innerHTML = '';
        
        result.conditions.forEach((condition, index) => {
            setTimeout(() => {
                const conditionCard = document.createElement('div');
                conditionCard.className = 'condition-card';
                conditionCard.style.opacity = '0';
                conditionCard.style.transform = 'translateX(-20px)';
                
                conditionCard.innerHTML = `
                    <div class="condition-header">
                        <span class="condition-name">${condition.name}</span>
                        <span class="risk-badge risk-medium">
                            ${condition.risk}%
                        </span>
                    </div>
                `;
                
                conditionsGrid.appendChild(conditionCard);
                
                // Animate card
                setTimeout(() => {
                    conditionCard.style.opacity = '1';
                    conditionCard.style.transform = 'translateX(0)';
                    conditionCard.style.transition = 'all 0.5s ease';
                }, 50);
            }, index * 300 + 500);
        });
    }
    
    // Display intervention and treatment
    const interventionContent = document.getElementById('interventionContent');
    const treatmentContent = document.getElementById('treatmentContent');
    
    if (interventionContent) {
        interventionContent.textContent = result.intervention;
        interventionContent.style.opacity = '0';
        setTimeout(() => {
            interventionContent.style.opacity = '1';
            interventionContent.style.transition = 'all 0.6s ease';
        }, 1000);
    }
    
    if (treatmentContent) {
        treatmentContent.textContent = result.treatment;
        treatmentContent.style.opacity = '0';
        setTimeout(() => {
            treatmentContent.style.opacity = '1';
            treatmentContent.style.transition = 'all 0.6s ease';
        }, 1200);
    }
    
    // Show success message
    setTimeout(() => {
        showToast(`✅ تم تحليل صورة البراز - اللون: ${result.color}`, 'success');
    }, 1500);
}

// Helper functions
function getRiskClass(risk) {
    if (risk >= 80) return 'high-risk';
    if (risk >= 70) return 'medium-risk';
    return 'low-risk';
}

function getRiskBadgeClass(risk) {
    if (risk >= 80) return 'risk-high';
    if (risk >= 70) return 'risk-medium';
    return 'risk-low';
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