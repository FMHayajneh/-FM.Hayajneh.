// Breed Identification Data
const breedDatabase = {
    'Ross 308': {
        nameAr: 'روس 308',
        info: [
            'سلالة أمريكية شهيرة لإنتاج اللحم',
            'نمو سريع مع كفاءة تحويل عالية للعلف',
            'وزن ذبح مثالي في 35-42 يوم',
            'لون الريش أبيض مع جسم ممتلئ'
        ],
        care: 'تحتاج إلى تهوية جيدة وحرارة مستقرة. يُنصح بإطعامها علفًا عالي البروتين (19-22%) مع مراقبة الوزن أسبوعيًا. تجنب الإفراط في التغذية لمنع مشاكل القلب والساقين.'
    },
    'Ross 708': {
        nameAr: 'روس 708',
        info: [
            'تطوير حديث من سلالة روس',
            'نمو سريع جدًا وإنتاجية عالية',
            'مناسبة للأسواق التي تطلب وزنًا أكبر',
            'مقاومة جيدة للأمراض'
        ],
        care: 'مثل Ross 308 لكن تحتاج مساحة أكبر قليلاً. يُنصح بتوفير فيتامينات إضافية (خاصة D3 وE) لدعم العظام والجهاز المناعي.'
    },
    'Cobb 500': {
        nameAr: 'كوب 500',
        info: [
            'سلالة عالمية منتشرة بكثرة',
            'توازن ممتاز بين النمو وكفاءة العلف',
            'مناسبة لظروف مناخية متعددة',
            'معدل بقاء مرتفع'
        ],
        care: 'سلالة متكيفة جدًا. تحتاج إلى إضاءة منتظمة (16 ساعة ضوء، 8 ساعات ظلام) وتهوية مناسبة. يُفضل علف متوازن مع إضافة البروبيوتيك لدعم الهضم.'
    },
    'Cobb 700': {
        nameAr: 'كوب 700',
        info: [
            'نسخة محسّنة من Cobb 500',
            'نمو أسرع مع معدل تحويل علف أفضل',
            'إنتاج لحم صدر عالي',
            'مناسبة للتسويق المبكر'
        ],
        care: 'تحتاج إلى مراقبة دقيقة للوزن وجودة العلف. يُنصح بتقليل كثافة الطيور (8-10 طائر/متر²) وتوفير ماء نظيف بشكل دائم.'
    },
    'Hubbard': {
        nameAr: 'هابرد',
        info: [
            'سلالة فرنسية ذات جودة عالية',
            'لحم طري ومذاق جيد',
            'مقاومة ممتازة للأمراض',
            'تنوع وراثي جيد'
        ],
        care: 'سلالة قوية لا تحتاج لعناية خاصة. يُنصح بتوفير فضاء كافٍ (10 طيور/متر²) وتجنب الحرارة الزائدة. علف قياسي (18-20% بروتين) كافٍ.'
    },
    'ISA Brown': {
        nameAr: 'إيزا براون',
        info: [
            'سلالة هجينة لإنتاج البيض',
            'إنتاج يومي عالي (300+ بيضة/سنة)',
            'لون بيض بني متوسط إلى غامق',
            'طبيعة هادئة وسهلة التربية'
        ],
        care: 'تحتاج إلى علف طبقات (16-18% بروتين) غني بالكالسيوم. وفّر أعشاش نظيفة ومظلمة. يُنصح بإضافة فيتامين D وأوميغا 3 لتحسين جودة البيض.'
    }
};

// DOM Elements
let fileInput, uploadCard, uploadArea, selectBtn, previewArea, previewImage;
let actionButtons, analyzeBtn, analyzeText, loadingSpinner, cancelBtn;
let uploadSection, resultsSection, newAnalysisBtn, infoSection;
let toast, toastMessage, fileInfo;

let selectedImage = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    setupFileInputStyling();
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
    fileInfo = document.getElementById('fileInfo'); // This might be null if not in HTML
}

function setupEventListeners() {
    // File selection
    if (selectBtn) {
        selectBtn.addEventListener('click', () => fileInput?.click());
    }
    
    if (uploadCard) {
        uploadCard.addEventListener('click', (e) => {
            // Only trigger if not clicking on buttons or file info
            if (!e.target.closest('button') && !e.target.closest('.file-info')) {
                fileInput?.click();
            }
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    // Analysis buttons
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', handleAnalysis);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetUpload);
    }

    if (newAnalysisBtn) {
        newAnalysisBtn.addEventListener('click', resetForNewAnalysis);
    }

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

function setupFileInputStyling() {
    // Only setup if fileInfo element exists
    if (fileInfo && fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const fileSize = (file.size / (1024 * 1024)).toFixed(2);
                fileInfo.innerHTML = `
                    <i class="fas fa-file-image"></i>
                    <strong>${file.name}</strong> - ${fileSize} MB
                    <br>
                    <small>نوع الملف: ${file.type}</small>
                `;
                fileInfo.classList.add('show');
            }
        });

        // Drag and drop for file info
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    // Create a new FileList (simulated)
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    fileInput.files = dt.files;
                    
                    // Trigger change event
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                    
                    // Handle the file
                    handleImageFile(file);
                } else {
                    showToast('يرجى رفع ملف صورة صالح', 'error');
                }
            });
        }
    }
}

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
    if (fileInfo) fileInfo.classList.remove('show');
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
            const result = analyzeChickenImage(selectedImage);
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

// Placeholder AI Function
function analyzeChickenImage(image) {
    const breeds = Object.keys(breedDatabase);
    const selectedBreed = breeds[Math.floor(Math.random() * breeds.length)];
    const accuracy = Math.floor(Math.random() * 25) + 75; // 75-99%
    
    return {
        breed: selectedBreed,
        accuracy: accuracy,
        info: breedDatabase[selectedBreed]
    };
}

function displayResults(result) {
    // Display breed name with animation
    const breedNameElement = document.getElementById('breedName');
    if (breedNameElement) {
        breedNameElement.textContent = '';
        breedNameElement.style.opacity = '0';
        
        setTimeout(() => {
            breedNameElement.textContent = result.info.nameAr;
            breedNameElement.style.opacity = '1';
            breedNameElement.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                breedNameElement.style.transform = 'scale(1)';
            }, 300);
        }, 200);
    }
    
    // Display accuracy bar with smooth animation
    const accuracyBar = document.getElementById('accuracyBar');
    const accuracyText = document.getElementById('accuracyText');
    if (accuracyBar && accuracyText) {
        // Reset and animate
        accuracyBar.style.width = '0%';
        accuracyBar.style.background = getAccuracyColor(result.accuracy);
        
        setTimeout(() => {
            accuracyBar.style.width = result.accuracy + '%';
            accuracyBar.classList.add('animate');
            
            // Animate percentage counter
            animatePercentage(accuracyText, result.accuracy);
        }, 500);
    }
    
    // Display breed info with staggered animation
    const breedInfo = document.getElementById('breedInfo');
    if (breedInfo) {
        breedInfo.innerHTML = '';
        breedInfo.style.opacity = '0';
        
        setTimeout(() => {
            breedInfo.style.opacity = '1';
            
            result.info.info.forEach((info, index) => {
                setTimeout(() => {
                    const li = document.createElement('li');
                    li.style.opacity = '0';
                    li.style.transform = 'translateX(-20px)';
                    li.innerHTML = `
                        <span class="bullet">•</span>
                        <span>${info}</span>
                    `;
                    breedInfo.appendChild(li);
                    
                    // Animate list item
                    setTimeout(() => {
                        li.style.opacity = '1';
                        li.style.transform = 'translateX(0)';
                        li.style.transition = 'all 0.4s ease';
                    }, 50);
                }, index * 200);
            });
        }, 800);
    }
    
    // Display care recommendations with fade-in
    const careContent = document.getElementById('careContent');
    if (careContent) {
        careContent.textContent = '';
        careContent.style.opacity = '0';
        
        setTimeout(() => {
            careContent.textContent = result.info.care;
            careContent.style.opacity = '1';
            careContent.style.transform = 'translateY(0)';
            careContent.style.transition = 'all 0.6s ease';
        }, 1000);
    }
    
    // Show success message with breed name
    setTimeout(() => {
        showToast(`✅ تم تحديد السلالة: ${result.info.nameAr} بدقة ${result.accuracy}%`, 'success');
    }, 1500);
}

// Helper function for percentage animation
function animatePercentage(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = `${target}% دقة`;
            clearInterval(timer);
        } else {
            element.textContent = `${Math.floor(current)}% دقة`;
        }
    }, 30);
}

// Helper function to get color based on accuracy
function getAccuracyColor(accuracy) {
    if (accuracy >= 90) {
        return 'var(--gradient-success)';
    } else if (accuracy >= 80) {
        return 'var(--gradient-primary)';
    } else if (accuracy >= 70) {
        return 'var(--gradient-secondary)';
    } else {
        return 'var(--warning)';
    }
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