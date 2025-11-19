// PDF Generator for Comprehensive Diagnosis Reports - UPDATED
class PDFGenerator {
    constructor() {
        this.isGenerating = false;
    }

    async generateReport(analysisResults, language = 'ar') {
        if (this.isGenerating) {
            throw new Error('PDF generation already in progress');
        }

        this.isGenerating = true;

        try {
            // استخدام مكتبة jsPDF لتوليد PDF حقيقي
            return await this.generateRealPDF(analysisResults, language);
        } finally {
            this.isGenerating = false;
        }
    }

    async generateRealPDF(analysisResults, language) {
        // محاكاة تأخير التوليد
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            // إنشاء مستند PDF جديد
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // إعدادات المستند
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20;
            let yPosition = margin;
            
            // العنوان الرئيسي
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text(language === 'ar' ? 'تقرير التشخيص الشامل' : 'Comprehensive Diagnosis Report', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 15;
            
            // التاريخ
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const dateStr = new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
            doc.text(`${language === 'ar' ? 'التاريخ:' : 'Date:'} ${dateStr}`, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 20;
            
            // مؤشر الثقة
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(language === 'ar' ? 'مؤشر الثقة العام' : 'Overall Confidence Indicator', margin, yPosition);
            yPosition += 10;
            
            doc.setFontSize(24);
            doc.setTextColor(67, 97, 238);
            doc.text(`${analysisResults.overallConfidence || 0}%`, margin, yPosition);
            yPosition += 20;

        
            
            // إضافة جميع الأقسام
            doc.setTextColor(0, 0, 0);
            
            // الأقسام الأساسية
            yPosition = this.addBreedSection(doc, analysisResults.breed, language, yPosition, pageWidth, margin);
            yPosition = this.addWeightSection(doc, analysisResults.weight, language, yPosition, pageWidth, margin);
            yPosition = this.addDiseaseSection(doc, analysisResults.disease, language, yPosition, pageWidth, margin);
            yPosition = this.addPossibleDiseasesSection(doc, analysisResults.possibleDiseases, language, yPosition, pageWidth, margin);
            yPosition = this.addSymptomsSection(doc, analysisResults.symptoms, language, yPosition, pageWidth, margin);
            yPosition = this.addReasonSection(doc, analysisResults.reason, language, yPosition, pageWidth, margin);
            yPosition = this.addConfirmationSection(doc, analysisResults.confirmation, language, yPosition, pageWidth, margin);
            yPosition = this.addTreatmentSection(doc, analysisResults.treatment, language, yPosition, pageWidth, margin);
            yPosition = this.addPreventionSection(doc, analysisResults.prevention, language, yPosition, pageWidth, margin);
            
            // توليد Blob للـ PDF
            const pdfBlob = doc.output('blob');
            
            return {
                blob: pdfBlob,
                url: URL.createObjectURL(pdfBlob),
                filename: this.generateFilename(analysisResults, language)
            };
            
        } catch (error) {
            console.error('PDF generation error:', error);
            // Fallback إلى HTML إذا فشل توليد PDF
            return await this.generateHTMLFallback(analysisResults, language);
        }
    }

    addBreedSection(doc, data, language, yPosition, pageWidth, margin) {
        if (yPosition > 250) {
            doc.addPage();
            yPosition = margin;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(language === 'ar' ? 'نوع الدجاجة' : 'Chicken Breed', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const content = `${data?.name?.[language] || '-'} (${data?.confidence || 0}% ${language === 'ar' ? 'ثقة' : 'confidence'})`;
        const contentLines = doc.splitTextToSize(content, pageWidth - 2 * margin);
        doc.text(contentLines, margin, yPosition);
        yPosition += (contentLines.length * 6) + 12;
        
        return yPosition;
    }

    addWeightSection(doc, data, language, yPosition, pageWidth, margin) {
        if (yPosition > 250) {
            doc.addPage();
            yPosition = margin;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(language === 'ar' ? 'الوزن التقديري' : 'Estimated Weight', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const content = `${data?.estimated || '-'}\n${data?.method?.[language] || ''}\n${language === 'ar' ? 'هامش الخطأ:' : 'Error Margin:'} ${data?.errorMargin || '-'}`;
        const contentLines = doc.splitTextToSize(content, pageWidth - 2 * margin);
        doc.text(contentLines, margin, yPosition);
        yPosition += (contentLines.length * 6) + 12;
        
        return yPosition;
    }

    addDiseaseSection(doc, data, language, yPosition, pageWidth, margin) {
        if (yPosition > 250) {
            doc.addPage();
            yPosition = margin;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(language === 'ar' ? 'المرض المشتبه به' : 'Differential Diagnosis', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const content = `${data?.name?.[language] || '-'} (${data?.probability || 0}% ${language === 'ar' ? 'احتمال' : 'probability'})`;
        const contentLines = doc.splitTextToSize(content, pageWidth - 2 * margin);
        doc.text(contentLines, margin, yPosition);
        yPosition += (contentLines.length * 6) + 12;
        
        return yPosition;
    }

    addPossibleDiseasesSection(doc, data, language, yPosition, pageWidth, margin) {
        if (!data?.diseases?.length) return yPosition;
        
        if (yPosition > 220) {
            doc.addPage();
            yPosition = margin;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(language === 'ar' ? 'الأمراض المحتملة' : 'Possible Diseases', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        data.diseases.forEach((disease, index) => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = margin;
            }
            
            const content = `${disease.name[language]} (${disease.probability}%)`;
            doc.text(content, margin, yPosition);
            yPosition += 8;
        });
        
        yPosition += 8;
        return yPosition;
    }

    addSymptomsSection(doc, data, language, yPosition, pageWidth, margin) {
        if (!data?.list?.length) return yPosition;
        
        if (yPosition > 220) {
            doc.addPage();
            yPosition = margin;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(language === 'ar' ? 'الأعراض الظاهرية' : 'Clinical Signs', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        data.list.forEach((symptom, index) => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = margin;
            }
            
            const symptomText = typeof symptom === 'object' ? symptom[language] : symptom;
            const content = `• ${symptomText}`;
            const contentLines = doc.splitTextToSize(content, pageWidth - 2 * margin);
            doc.text(contentLines, margin, yPosition);
            yPosition += (contentLines.length * 6) + 4;
        });
        
        yPosition += 8;
        return yPosition;
    }

    addReasonSection(doc, data, language, yPosition, pageWidth, margin) {
        if (!data?.explanation) return yPosition;
        
        if (yPosition > 200) {
            doc.addPage();
            yPosition = margin;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(language === 'ar' ? 'السبب' : 'Etiology', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const explanation = typeof data.explanation === 'object' ? data.explanation[language] : data.explanation;
        const explanationLines = doc.splitTextToSize(explanation, pageWidth - 2 * margin);
        doc.text(explanationLines, margin, yPosition);
        yPosition += (explanationLines.length * 6) + 12;
        
        return yPosition;
    }

    addConfirmationSection(doc, data, language, yPosition, pageWidth, margin) {
        if (!data?.strategies?.length) return yPosition;
        
        if (yPosition > 220) {
            doc.addPage();
            yPosition = margin;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(language === 'ar' ? 'طرق التأكد' : 'Confirmation Strategies', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        data.strategies.forEach((strategy, index) => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = margin;
            }
            
            const strategyText = typeof strategy === 'object' ? strategy[language] : strategy;
            const content = `• ${strategyText}`;
            const contentLines = doc.splitTextToSize(content, pageWidth - 2 * margin);
            doc.text(contentLines, margin, yPosition);
            yPosition += (contentLines.length * 6) + 4;
        });
        
        yPosition += 8;
        return yPosition;
    }

    addTreatmentSection(doc, data, language, yPosition, pageWidth, margin) {
        if (yPosition > 200) {
            doc.addPage();
            yPosition = margin;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(language === 'ar' ? 'طريقة العلاج' : 'Treatment', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const treatmentContent = [
            `${language === 'ar' ? 'الدواء:' : 'Medication:'} ${data?.medication?.[language] || '-'}`,
            `${language === 'ar' ? 'الجرعة:' : 'Dosage:'} ${data?.dosage?.[language] || '-'}`,
            `${language === 'ar' ? 'المدة:' : 'Duration:'} ${data?.duration?.[language] || '-'}`,
            `${language === 'ar' ? 'تحذيرات:' : 'Warnings:'} ${data?.warnings?.[language] || '-'}`
        ];
        
        treatmentContent.forEach(line => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = margin;
            }
            
            const contentLines = doc.splitTextToSize(line, pageWidth - 2 * margin);
            doc.text(contentLines, margin, yPosition);
            yPosition += (contentLines.length * 6) + 4;
        });
        
        yPosition += 8;
        return yPosition;
    }

    addPreventionSection(doc, data, language, yPosition, pageWidth, margin) {
        if (!data?.measures?.length) return yPosition;
        
        if (yPosition > 220) {
            doc.addPage();
            yPosition = margin;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(language === 'ar' ? 'طرق الوقاية' : 'Prevention & control', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        data.measures.forEach((measure, index) => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = margin;
            }
            
            const measureText = typeof measure === 'object' ? measure[language] : measure;
            const content = `• ${measureText}`;
            const contentLines = doc.splitTextToSize(content, pageWidth - 2 * margin);
            doc.text(contentLines, margin, yPosition);
            yPosition += (contentLines.length * 6) + 4;
        });
        
        return yPosition;
    }

    generateHTMLFallback(analysisResults, language) {
        // Fallback إلى HTML إذا لم تكن مكتبة jsPDF متوفرة
        const htmlContent = this.generatePrintableHTML(analysisResults, language);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        
        return {
            blob,
            url: URL.createObjectURL(blob),
            filename: this.generateFilename(analysisResults, language)
        };
    }

    generateFilename(analysisResults, language) {
        const timestamp = new Date().toISOString().split('T')[0];
        const diseaseName = analysisResults.disease?.name?.[language] || 'unknown';
        return language === 'ar'
            ? `تقرير-التشخيص-${diseaseName}-${timestamp}.pdf`
            : `diagnosis-report-${diseaseName}-${timestamp}.pdf`;
    }

    downloadPDF(pdfData) {
        const link = document.createElement('a');
        link.href = pdfData.url;
        link.download = pdfData.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // تنظيف URL بعد فترة
        setTimeout(() => URL.revokeObjectURL(pdfData.url), 1000);
    }

    generatePrintableHTML(analysisResults, language) {
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        const textAlign = language === 'ar' ? 'right' : 'left';
        const dateStr = new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');

        return `
            <!DOCTYPE html>
            <html dir="${dir}" lang="${language}">
            <head>
                <meta charset="UTF-8">
                <title>${language === 'ar' ? 'تقرير التشخيص الشامل' : 'Comprehensive Diagnosis Report'}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; text-align: ${textAlign}; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .section { border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
                    .section-title { font-weight: bold; color: #4361ee; margin-bottom: 10px; font-size: 1.2em; }
                    .confidence { text-align: center; background: #000000ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                    .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                    .symptoms-list { margin: 10px 0; }
                    .symptom-item { margin: 5px 0; padding: 5px; background: #f8f9fa; border-radius: 4px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${language === 'ar' ? 'تقرير التشخيص الشامل' : 'Comprehensive Diagnosis Report'}</h1>
                    <p>${language === 'ar' ? 'نظام تشخيص صحة الدجاج بالذكاء الاصطناعي' : 'AI-Powered Chicken Health Diagnosis System'}</p>
                    <p>${dateStr}</p>   
                </div>

                <div class="confidence">
                    <h3>${language === 'ar' ? 'مؤشر الثقة العام' : 'Overall Confidence Indicator'}</h3>
                    <h2>${analysisResults.overallConfidence || 0}%</h2>
                </div>

                <div class="warning">
                    <strong>${language === 'ar' ? 'ملاحظة هامة:' : 'Important Note:'}</strong>
                    ${language === 'ar'
                        ? 'هذه النتائج استرشادية وتحتاج لتأكيد من طبيب بيطري متخصص. لا تستبدل التشخيص الطبي المهني.'
                        : 'These results are indicative and require confirmation from a specialized veterinarian. They do not replace professional medical diagnosis.'}
                </div>

                ${this.generateAllHTMLSections(analysisResults, language)}
            </body>
            </html>
        `;
    }

    generateAllHTMLSections(analysisResults, language) {
        const sections = [
            {
                title: language === 'ar' ? 'نوع الدجاجة' : 'Chicken Breed',
                content: `<p><strong>${analysisResults.breed?.name?.[language] || '-'}</strong></p>
                          <p>${language === 'ar' ? 'نسبة الثقة:' : 'Confidence:'} ${analysisResults.breed?.confidence || 0}%</p>`
            },
            {
                title: language === 'ar' ? 'الوزن التقديري' : 'Estimated Weight',
                content: `<p><strong>${analysisResults.weight?.estimated || '-'}</strong></p>
                          <p>${analysisResults.weight?.method?.[language] || ''}</p>
                          <p>${language === 'ar' ? 'هامش الخطأ:' : 'Error Margin:'} ${analysisResults.weight?.errorMargin || '-'}</p>`
            },
            {
                title: language === 'ar' ? 'الأعراض الظاهرية' : 'Clinical Signs',
                content: analysisResults.symptoms?.list?.length ? 
                    `<div class="symptoms-list">${analysisResults.symptoms.list.map(symptom => 
                        `<div class="symptom-item">${typeof symptom === 'object' ? symptom[language] : symptom}</div>`
                    ).join('')}</div>` : 
                    `<p>${language === 'ar' ? 'لا توجد أعراض ظاهرية' : 'No clinical signs'}</p>`
            },
            {
                title: language === 'ar' ? 'المرض المشتبه به' : 'Differential Diagnosis',
                content: `<p><strong>${analysisResults.disease?.name?.[language] || '-'}</strong></p>
                          <p>${language === 'ar' ? 'نسبة الاحتمال:' : 'Probability:'} ${analysisResults.disease?.probability || 0}%</p>`
            },
            {
                title: language === 'ar' ? 'الأمراض المحتملة' : 'Possible Diseases',
                content: analysisResults.possibleDiseases?.diseases?.length ? 
                    analysisResults.possibleDiseases.diseases.map(disease => 
                        `<p><strong>${disease.name[language]}</strong> (${disease.probability}%)</p>`
                    ).join('') : 
                    `<p>${language === 'ar' ? 'لا توجد أمراض أخرى محتملة' : 'No other possible diseases'}</p>`
            },
            {
                title: language === 'ar' ? 'السبب' : 'Etiology',
                content: analysisResults.reason?.explanation ? 
                    `<p>${typeof analysisResults.reason.explanation === 'object' ? 
                        analysisResults.reason.explanation[language] : analysisResults.reason.explanation}</p>` :
                    `<p>${language === 'ar' ? 'لا تتوفر معلومات' : 'Information not available'}</p>`
            },
            {
                title: language === 'ar' ? 'طرق التأكد' : 'Confirmation Strategies',
                content: analysisResults.confirmation?.strategies?.length ? 
                    `<div class="symptoms-list">${analysisResults.confirmation.strategies.map(strategy => 
                        `<div class="symptom-item">${typeof strategy === 'object' ? strategy[language] : strategy}</div>`
                    ).join('')}</div>` : 
                    `<p>${language === 'ar' ? 'لا تتوفر طرق تأكيد' : 'No confirmation strategies'}</p>`
            },
            {
                title: language === 'ar' ? 'طريقة العلاج' : 'Treatment',
                content: `<p><strong>${language === 'ar' ? 'الدواء:' : 'Medication:'}</strong> ${analysisResults.treatment?.medication?.[language] || '-'}</p>
                          <p><strong>${language === 'ar' ? 'الجرعة:' : 'Dosage:'}</strong> ${analysisResults.treatment?.dosage?.[language] || '-'}</p>
                          <p><strong>${language === 'ar' ? 'المدة:' : 'Duration:'}</strong> ${analysisResults.treatment?.duration?.[language] || '-'}</p>
                          <p><strong>${language === 'ar' ? 'تحذيرات:' : 'Warnings:'}</strong> ${analysisResults.treatment?.warnings?.[language] || '-'}</p>`
            },
            {
                title: language === 'ar' ? 'طرق الوقاية' : 'Prevention',
                content: analysisResults.prevention?.measures?.length ? 
                    `<div class="symptoms-list">${analysisResults.prevention.measures.map(measure => 
                        `<div class="symptom-item">${typeof measure === 'object' ? measure[language] : measure}</div>`
                    ).join('')}</div>` : 
                    `<p>${language === 'ar' ? 'لا تتوفر طرق وقاية' : 'No prevention measures'}</p>`
            }
        ];

        return sections.map(sec => `<div class="section">
                                        <div class="section-title">${sec.title}</div>
                                        ${sec.content}
                                    </div>`).join('');
    }

    printHTMLReport(analysisResults, language) {
        const printableWindow = window.open('', '_blank');
        printableWindow.document.write(this.generatePrintableHTML(analysisResults, language));
        printableWindow.document.close();
        printableWindow.onload = () => printableWindow.print();
    }
}

// Initialize PDF generator globally
window.pdfGenerator = new PDFGenerator();