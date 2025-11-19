// Comprehensive Diagnosis System
class ComprehensiveDiagnosis {
    constructor() {
        this.chickenImage = null;
        this.fecesImage = null;
        this.currentLanguage = 'ar';
        this.analysisResults = null;
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        // File inputs
        this.chickenFileInput = document.getElementById('chickenFileInput');
        this.fecesFileInput = document.getElementById('fecesFileInput');

        // Upload areas
        this.chickenUploadArea = document.getElementById('chickenUploadArea');
        this.fecesUploadArea = document.getElementById('fecesUploadArea');

        // Preview areas
        this.chickenPreviewArea = document.getElementById('chickenPreviewArea');
        this.fecesPreviewArea = document.getElementById('fecesPreviewArea');
        this.chickenPreviewImage = document.getElementById('chickenPreviewImage');
        this.fecesPreviewImage = document.getElementById('fecesPreviewImage');

        // Buttons
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.newAnalysisBtn = document.getElementById('newAnalysisBtn');
        this.toggleLanguageBtn = document.getElementById('toggleLanguageBtn');
        this.printReportBtn = document.getElementById('printReportBtn');
        this.exportPdfBtn = document.getElementById('exportPdfBtn');
        this.explainReasoningBtn = document.getElementById('explainReasoningBtn');

        // Sections
        this.uploadSection = document.getElementById('uploadSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.infoSection = document.getElementById('infoSection');
        this.comprehensiveResults = document.getElementById('comprehensiveResults');

        // Confidence indicators
        this.overallConfidence = document.getElementById('overallConfidence');
        this.overallConfidenceBar = document.getElementById('overallConfidenceBar');

        // Modal
        this.reasoningModal = document.getElementById('reasoningModal');
        this.modalClose = document.getElementById('modalClose');
        this.reasoningContent = document.getElementById('reasoningContent');

        // Text elements
        this.analyzeText = document.getElementById('analyzeText');
        this.loadingSpinner = document.getElementById('loadingSpinner');

        // Toast
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');
    }

    setupEventListeners() {
        // File selection buttons
        document.querySelectorAll('.chicken-select-btn').forEach(btn => {
            btn.addEventListener('click', () => this.chickenFileInput?.click());
        });

        document.querySelectorAll('.feces-select-btn').forEach(btn => {
            btn.addEventListener('click', () => this.fecesFileInput?.click());
        });

        // File input changes
        this.chickenFileInput?.addEventListener('change', (e) => this.handleFileSelect(e, 'chicken'));
        this.fecesFileInput?.addEventListener('change', (e) => this.handleFileSelect(e, 'feces'));

        // Card clicks for file selection
        document.getElementById('chickenUploadCard')?.addEventListener('click', (e) => {
            if (!e.target.closest('button') && !e.target.closest('.preview-area')) {
                this.chickenFileInput?.click();
            }
        });

        document.getElementById('fecesUploadCard')?.addEventListener('click', (e) => {
            if (!e.target.closest('button') && !e.target.closest('.preview-area')) {
                this.fecesFileInput?.click();
            }
        });

        // Action buttons
        this.analyzeBtn?.addEventListener('click', () => this.handleAnalysis());
        this.cancelBtn?.addEventListener('click', () => this.resetUpload());
        this.newAnalysisBtn?.addEventListener('click', () => this.resetForNewAnalysis());
        this.toggleLanguageBtn?.addEventListener('click', () => this.toggleLanguage());
        this.printReportBtn?.addEventListener('click', () => this.printReport());
        this.exportPdfBtn?.addEventListener('click', () => this.exportPdf());
        this.explainReasoningBtn?.addEventListener('click', () => this.showReasoning());

        // Modal
        this.modalClose?.addEventListener('click', () => this.hideReasoning());
        this.reasoningModal?.addEventListener('click', (e) => {
            if (e.target === this.reasoningModal) {
                this.hideReasoning();
            }
        });

        // Drag and drop
        this.setupDragAndDrop('chicken');
        this.setupDragAndDrop('feces');
    }

    setupDragAndDrop(type) {
        const uploadCard = document.getElementById(`${type}UploadCard`);
        const uploadArea = document.getElementById(`${type}UploadArea`);

        if (uploadCard && uploadArea) {
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
                    this.handleImageFile(file, type);
                } else {
                    this.showToast('يرجى رفع ملف صورة صالح', 'error');
                }
            });
        }
    }

    handleFileSelect(e, type) {
        const file = e.target.files[0];
        if (file) {
            this.handleImageFile(file, type);
        }
    }

    handleImageFile(file, type) {
        // Validate file
        if (!file.type.startsWith('image/')) {
            this.showToast('يرجى رفع ملف صورة صالح', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showToast('حجم الصورة كبير جداً. الحد الأقصى 5MB', 'error');
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            if (type === 'chicken') {
                this.chickenImage = e.target.result;
                this.chickenPreviewImage.src = this.chickenImage;
                this.chickenUploadArea.style.display = 'none';
                this.chickenPreviewArea.style.display = 'block';
            } else {
                this.fecesImage = e.target.result;
                this.fecesPreviewImage.src = this.fecesImage;
                this.fecesUploadArea.style.display = 'none';
                this.fecesPreviewArea.style.display = 'block';
            }

            this.checkAnalysisReady();
            this.showToast(`تم رفع صورة ${type === 'chicken' ? 'الدجاجة' : 'البراز'} بنجاح`, 'success');
        };

        reader.onerror = () => {
            this.showToast('حدث خطأ في قراءة الملف', 'error');
        };

        reader.readAsDataURL(file);
    }

    checkAnalysisReady() {
        if (this.chickenImage && this.fecesImage) {
            this.actionButtons.style.display = 'flex';
        }
    }

    async handleAnalysis() {
        if (!this.chickenImage || !this.fecesImage) {
            this.showToast('يرجى رفع كلتا الصورتين', 'error');
            return;
        }

        // Show loading state
        this.analyzeBtn.disabled = true;
        this.analyzeText.style.display = 'none';
        this.loadingSpinner.style.display = 'inline-flex';

        try {
            // Simulate API call and analysis
            this.analysisResults = await this.performComprehensiveAnalysis();
            this.displayResults(this.analysisResults);

            // Show results section
            this.uploadSection.style.display = 'none';
            this.infoSection.style.display = 'none';
            this.resultsSection.style.display = 'block';

            // Scroll to results
            this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            console.error('Analysis error:', error);
            this.showToast('حدث خطأ أثناء التحليل الشامل', 'error');
        } finally {
            // Hide loading state
            this.analyzeBtn.disabled = false;
            this.analyzeText.style.display = 'inline';
            this.loadingSpinner.style.display = 'none';
        }
    }

    async performComprehensiveAnalysis() {
        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Use the disease algorithm to get comprehensive results
        return window.diseaseAlgorithm.analyzeComprehensive(
            this.chickenImage,
            this.fecesImage
        );
    }

    displayResults(results) {
        // Update overall confidence
        this.updateConfidenceIndicator(results.overallConfidence);

        // Generate results cards
        this.generateResultsCards(results);

        // Show success message
        this.showToast('✅ تم التحليل الشامل بنجاح', 'success');
    }

    updateConfidenceIndicator(confidence) {
        this.overallConfidence.textContent = `${confidence}%`;
        this.overallConfidenceBar.style.width = `${confidence}%`;

        // Animate the confidence bar
        setTimeout(() => {
            this.overallConfidenceBar.style.transition = 'width 1.5s ease-in-out';
        }, 100);
    }

    generateResultsCards(results) {
        const cardsData = [
            {
                id: 'breed',
                icon: 'fas fa-dna',
                title: { ar: 'نوع الدجاجة', en: 'Chicken Breed' },
                content: this.renderBreedContent(results.breed)
            },
            {
                id: 'weight',
                icon: 'fas fa-weight-hanging',
                title: { ar: 'الوزن التقديري', en: 'Estimated Weight' },
                content: this.renderWeightContent(results.weight)
            },
            {
                id: 'symptoms',
                icon: 'fas fa-stethoscope',
                title: { ar: 'الأعراض الظاهرية', en: 'Clinical Signs' },
                content: this.renderSymptomsContent(results.symptoms)
            },
            {
                id: 'disease',
                icon: 'fas fa-virus',
                title: { ar: 'المرض المشتبه به', en: 'Differential Diagnosis' },
                content: this.renderDiseaseContent(results.disease)
            },
            {
                id: 'possibleDiseases',
                icon: 'fas fa-list-alt',
                title: { ar: 'الأمراض المحتملة', en: 'Possible Diseases' },
                content: this.renderPossibleDiseasesContent(results.possibleDiseases)
            },
            {
                id: 'reason',
                icon: 'fas fa-brain',
                title: { ar: 'السبب', en: 'etiology' },
                content: this.renderReasonContent(results.reason)
            },
            {
                id: 'confirmation',
                icon: 'fas fa-search',
                title: { ar: 'طرق التأكد', en: 'Confirmation Strategies' },
                content: this.renderConfirmationContent(results.confirmation)
            },
            {
                id: 'treatment',
                icon: 'fas fa-heartbeat',
                title: { ar: 'طريقة العلاج', en: 'Treatment' },
                content: this.renderTreatmentContent(results.treatment)
            },
            {
                id: 'prevention & control',
                icon: 'fas fa-shield-alt',
                title: { ar: 'طرق الوقاية', en: 'Prevention & Control' },
                content: this.renderPreventionContent(results.prevention)
            }
        ];

        this.comprehensiveResults.innerHTML = cardsData.map(card => `
            <div class="result-card" id="card-${card.id}">
                <div class="result-card-header" onclick="comprehensiveDiagnosis.toggleCard('${card.id}')">
                    <div class="card-title">
                        <i class="${card.icon}"></i>
                        <span class="card-title-text">${card.title[this.currentLanguage]}</span>
                    </div>
                    <button class="card-toggle">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <div class="result-card-content">
                    ${card.content}
                </div>
            </div>
        `).join('');

        // Open first card by default
        setTimeout(() => this.toggleCard('breed'), 500);
    }

    renderBreedContent(breedData) {
        return `
            <div class="breed-info">
                <span class="breed-badge">
                    <i class="fas fa-dove"></i>
                    ${breedData.name[this.currentLanguage]}
                </span>
                <span class="confidence-badge">
                    <i class="fas fa-chart-line"></i>
                    ${breedData.confidence}% دقة
                </span>
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(76,201,240,0.1); border-radius: 8px;">
                <i class="fas fa-database" style="color: var(--success);"></i>
                <strong>${breedData.source[this.currentLanguage]}</strong>
            </div>
            ${breedData.alternatives ? `
                <div style="margin-top: 1rem;">
                    <strong>${this.currentLanguage === 'ar' ? 'البدائل المقترحة:' : 'Alternative breeds:'}</strong>
                    <p>${breedData.alternatives[this.currentLanguage]}</p>
                </div>
            ` : ''}
        `;
    }

    renderWeightContent(weightData) {
        return `
            <div class="weight-estimation">
                <div class="weight-value">${weightData.estimated}</div>
                <p class="weight-method">${weightData.method[this.currentLanguage]}</p>
                <span class="error-margin">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${weightData.errorMargin}
                </span>
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(76,201,240,0.1); border-radius: 8px;">
                <i class="fas fa-database" style="color: var(--success);"></i>
                <strong>${weightData.source[this.currentLanguage]}</strong>
            </div>
        `;
    }

    renderSymptomsContent(symptomsData) {
        const symptomsList = symptomsData.list.map(symptom => `
            <div class="symptom-item">
                <i class="fas fa-arrow-left"></i>
                <span>${symptom[this.currentLanguage]}</span>
            </div>
        `).join('');

        return `
            <div class="symptoms-list">
                ${symptomsList}
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,193,7,0.1); border-radius: 8px;">
                <i class="fas fa-info-circle" style="color: var(--warning);"></i>
                <strong>${symptomsData.source[this.currentLanguage]}</strong>
            </div>
        `;
    }

    renderDiseaseContent(diseaseData) {
        return `
            <div class="disease-probability">
                <div class="disease-name">${diseaseData.name[this.currentLanguage]}</div>
                <div class="probability-display">
                    <div class="probability-bar">
                        <div class="probability-fill" style="width: ${diseaseData.probability}%"></div>
                    </div>
                    <span class="probability-value">${diseaseData.probability}%</span>
                </div>
            </div>
            ${diseaseData.alternatives ? `
                <div style="margin-top: 1rem;">
                    <strong>${this.currentLanguage === 'ar' ? 'أمراض أخرى محتملة:' : 'Other possible diseases:'}</strong>
                    <p>${diseaseData.alternatives[this.currentLanguage]}</p>
                </div>
            ` : ''}
        `;
    }

    renderPossibleDiseasesContent(possibleDiseasesData) {
        const diseasesList = possibleDiseasesData.diseases.map(disease => `
            <div class="disease-item" style="margin-bottom: 1rem; padding: 1rem; background: rgba(67,97,238,0.05); border-radius: 8px; border-left: 4px solid var(--primary);">
                <div class="disease-info">
                    <div class="disease-name" style="font-weight: 600; color: var(--dark); margin-bottom: 0.5rem;">${disease.name[this.currentLanguage]}</div>
                </div>
                <div class="probability-display">
                    <div class="probability-bar" style="width: 100px;">
                        <div class="probability-fill" style="width: ${disease.probability}%"></div>
                    </div>
                    <span class="probability-value" style="font-weight: 700; color: var(--primary); min-width: 50px;">${disease.probability}%</span>
                </div>
            </div>
        `).join('');

        return `
            <div class="possible-diseases">
                ${diseasesList}
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,193,7,0.1); border-radius: 8px;">
                    <i class="fas fa-info-circle" style="color: var(--warning);"></i>
                    <strong>${possibleDiseasesData.source[this.currentLanguage]}</strong>
                </div>
            </div>
        `;
    }

    renderReasonContent(reasonData) {
        return `
            <div style="line-height: 1.8;">
                <p>${reasonData.explanation[this.currentLanguage]}</p>
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(67,97,238,0.05); border-radius: 8px;">
                    <strong>${this.currentLanguage === 'ar' ? 'الأدلة المستخدمة:' : 'Evidence used:'}</strong>
                    <ul style="margin: 0.5rem 0; padding-right: 1.5rem;">
                        ${reasonData.evidence.map(evidence => `
                            <li>${evidence[this.currentLanguage]}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    renderConfirmationContent(confirmationData) {
        const strategiesList = confirmationData.strategies.map(strategy => `
            <div class="symptom-item">
                <i class="fas fa-check-circle"></i>
                <span>${strategy[this.currentLanguage]}</span>
            </div>
        `).join('');

        return `
            <div class="symptoms-list">
                ${strategiesList}
            </div>
        `;
    }

    renderTreatmentContent(treatmentData) {
        return `
            <div class="treatment-grid">
                <div class="treatment-item">
                    <h5><i class="fas fa-pills"></i> ${this.currentLanguage === 'ar' ? 'الدواء' : 'Medication'}</h5>
                    <p>${treatmentData.medication[this.currentLanguage]}</p>
                </div>
                <div class="treatment-item">
                    <h5><i class="fas fa-syringe"></i> ${this.currentLanguage === 'ar' ? 'الجرعة' : 'Dosage'}</h5>
                    <p>${treatmentData.dosage[this.currentLanguage]}</p>
                </div>
                <div class="treatment-item">
                    <h5><i class="fas fa-clock"></i> ${this.currentLanguage === 'ar' ? 'المدة' : 'Duration'}</h5>
                    <p>${treatmentData.duration[this.currentLanguage]}</p>
                </div>
                <div class="treatment-item">
                    <h5><i class="fas fa-exclamation-triangle"></i> ${this.currentLanguage === 'ar' ? 'تحذيرات' : 'Warnings'}</h5>
                    <p>${treatmentData.warnings[this.currentLanguage]}</p>
                </div>
            </div>
        `;
    }

    renderPreventionContent(preventionData) {
        const preventionList = preventionData.measures.map(measure => `
            <div class="prevention-item">
                <i class="fas fa-shield-alt"></i>
                <span>${measure[this.currentLanguage]}</span>
            </div>
        `).join('');

        return `
            <div class="prevention-list">
                ${preventionList}
            </div>
        `;
    }

    toggleCard(cardId) {
        const card = document.getElementById(`card-${cardId}`);
        const content = card.querySelector('.result-card-content');
        const toggle = card.querySelector('.card-toggle');
        const header = card.querySelector('.result-card-header');

        const isActive = content.classList.contains('active');

        // Close all cards first
        document.querySelectorAll('.result-card-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.card-toggle').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.result-card-header').forEach(h => h.classList.remove('active'));

        if (!isActive) {
            content.classList.add('active');
            toggle.classList.add('active');
            header.classList.add('active');
        }
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'ar' ? 'en' : 'ar';

        // Update toggle button text
        this.toggleLanguageBtn.innerHTML = `
            <i class="fas fa-language"></i>
            ${this.currentLanguage === 'ar' ? 'English' : 'العربية'}
        `;

        // Update all card titles and content
        this.updateLanguage();
    }

    updateLanguage() {
        // Update results with new language
        if (this.analysisResults) {
            this.generateResultsCards(this.analysisResults);
        }
    }

    showReasoning() {
        if (!this.analysisResults) return;

        const reasoning = this.analysisResults.reasoning[this.currentLanguage];
        this.reasoningContent.innerHTML = reasoning;
        this.reasoningModal.classList.add('show');
    }

    hideReasoning() {
        this.reasoningModal.classList.remove('show');
    }

    printReport() {
        window.print();
    }

    async exportPdf() {
        if (!this.analysisResults) {
            this.showToast('لا توجد نتائج لتصديرها', 'error');
            return;
        }

        this.showToast('جاري تصدير التقرير بصيغة PDF...', 'info');

        try {
            const pdfData = await window.pdfGenerator.generateReport(
                this.analysisResults,
                this.currentLanguage
            );

            window.pdfGenerator.downloadPDF(pdfData);
            this.showToast('تم تصدير التقرير بنجاح', 'success');

        } catch (error) {
            console.error('PDF export error:', error);
            this.showToast('حدث خطأ أثناء تصدير التقرير', 'error');
        }
    }

    // وتعديل دالة printReport لاستخدام النظام الجديد
    printReport() {
        if (!this.analysisResults) {
            this.showToast('لا توجد نتائج لطباعتها', 'error');
            return;
        }

        window.pdfGenerator.printHTMLReport(this.analysisResults, this.currentLanguage);
    }

    resetUpload() {
        this.chickenImage = null;
        this.fecesImage = null;

        this.chickenFileInput.value = '';
        this.fecesFileInput.value = '';

        this.chickenUploadArea.style.display = 'block';
        this.fecesUploadArea.style.display = 'block';

        this.chickenPreviewArea.style.display = 'none';
        this.fecesPreviewArea.style.display = 'none';

        this.actionButtons.style.display = 'none';
    }

    resetForNewAnalysis() {
        this.resetUpload();
        this.uploadSection.style.display = 'block';
        this.infoSection.style.display = 'block';
        this.resultsSection.style.display = 'none';
        this.uploadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// Initialize the comprehensive diagnosis system
let comprehensiveDiagnosis;

document.addEventListener('DOMContentLoaded', function () {
    comprehensiveDiagnosis = new ComprehensiveDiagnosis();
});