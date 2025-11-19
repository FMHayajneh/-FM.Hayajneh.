// Disease Analysis Algorithm with Fixed Probability Table
class DiseaseAlgorithm {
    constructor() {
        // Fixed disease probability table (as provided)
        this.diseaseTable = {
            "Coccidiosis": {
                minAccuracy: 75,
                maxAccuracy: 90,
                comments: {
                    ar: "أكثر أسباب الإسهال الدموي أو المخاطي شيوعاً، آفات معوية، ووفيات (خاصة في عمر 3-6 أسابيع). يتم التأكد عن طريق الأكياس أو الآفات المعوية النموذجية.",
                    en: "Most common cause of bloody or mucoid diarrhea, intestinal lesions, and mortality (esp. 3-6 wk age). Confirmed by oocysts or typical intestinal lesions."
                },
                clues: {
                    ar: ["إسهال دموي", "مخاط في البراز", "عمر 3-6 أسابيع", "آفات معوية"],
                    en: ["Bloody diarrhea", "Mucoid feces", "Age 3-6 weeks", "Intestinal lesions"]
                }
            },
            "Necrotic enteritis": {
                minAccuracy: 30,
                maxAccuracy: 50,
                comments: {
                    ar: "عدوى ثانوية شائعة بعد الكوكسيديا؛ غشاء مخاطي متسمك وناخر مع حطام بني. غالباً ما يحدث مع الأنظمة الغذائية عالية البروتين.",
                    en: "Common secondary infection following coccidiosis; thickened, necrotic mucosa with brown debris. Often occurs with high-protein diets."
                },
                clues: {
                    ar: ["بعد الكوكسيديا", "غشاء مخاطي ناخر", "أنظمة عالية البروتين"],
                    en: ["Following coccidiosis", "Necrotic mucosa", "High-protein diets"]
                }
            },
            "Histomoniasis": {
                minAccuracy: 10,
                maxAccuracy: 20,
                comments: {
                    ar: "نوى عمياء وآفات كبدية شبيهة بالهدف، خاصة في الديوك الرومية؛ نادراً في الدجاج.",
                    en: "Cecal cores and target-like liver lesions, especially in turkeys; rarely in chickens."
                },
                clues: {
                    ar: ["نوى عمياء", "آفات كبدية", "نادر في الدجاج"],
                    en: ["Cecal cores", "Liver lesions", "Rare in chickens"]
                }
            },
            "Ulcerative enteritis": {
                minAccuracy: 5,
                maxAccuracy: 15,
                comments: {
                    ar: "قرحات صغيرة على طول الأمعاء؛ لا توجد براز دموي. عادة في السمان أو الطبقات المجهدة.",
                    en: "Small ulcers along intestine; no bloody droppings. Usually in quails or stressed layers."
                },
                clues: {
                    ar: ["قرحات معوية", "لا يوجد براز دموي", "طيور مجهدة"],
                    en: ["Intestinal ulcers", "No bloody droppings", "Stressed birds"]
                }
            },
            "Salmonellosis": {
                minAccuracy: 10,
                maxAccuracy: 25,
                comments: {
                    ar: "إسهال مائي، علامات جهازية؛ ليس دموياً. يتم التأكد عن طريق الزراعة.",
                    en: "Watery diarrhea, systemic signs; not bloody. Confirmed by culture."
                },
                clues: {
                    ar: ["إسهال مائي", "علامات جهازية", "ليس دموياً"],
                    en: ["Watery diarrhea", "Systemic signs", "Not bloody"]
                }
            },
            "E. coli infection": {
                minAccuracy: 10,
                maxAccuracy: 20,
                comments: {
                    ar: "غالباً ما يكون تنفسياً أو تسممياً؛ الشكل المعوي نادر.",
                    en: "More often respiratory or septicemic; enteric form rare."
                },
                clues: {
                    ar: ["تنفسي أو تسممي", "شكل معوي نادر"],
                    en: ["Respiratory or septicemic", "Enteric form rare"]
                }
            },
            "Helminthiasis": {
                minAccuracy: 10,
                maxAccuracy: 20,
                comments: {
                    ar: "نمو ضعيف مزمن؛ ديدان مرئية عند التشريح؛ لا يوجد دم.",
                    en: "Chronic poor growth; worms visible on necropsy; no blood."
                },
                clues: {
                    ar: ["نمو ضعيف مزمن", "ديدان مرئية", "لا يوجد دم"],
                    en: ["Chronic poor growth", "Visible worms", "No blood"]
                }
            },
            "Cryptosporidiosis": {
                minAccuracy: 5,
                maxAccuracy: 10,
                comments: {
                    ar: "التهاب معوي خفيف في الكتاكيت الصغيرة؛ لا توجد آفات دموية ظاهرة.",
                    en: "Mild enteritis in young chicks; no gross bloody lesions."
                },
                clues: {
                    ar: ["كتاكيت صغيرة", "التهاب معوي خفيف", "لا آفات دموية"],
                    en: ["Young chicks", "Mild enteritis", "No bloody lesions"]
                }
            },
            "Mycotoxicosis": {
                minAccuracy: 10,
                maxAccuracy: 15,
                comments: {
                    ar: "أداء ضعيف، كبد شاحب؛ مسار مزمن؛ يؤكد تحليل العلف.",
                    en: "Poor performance, pale liver; chronic course; feed analysis confirms."
                },
                clues: {
                    ar: ["أداء ضعيف", "كبد شاحب", "مسار مزمن"],
                    en: ["Poor performance", "Pale liver", "Chronic course"]
                }
            },
            "Dietary enteritis": {
                minAccuracy: 5,
                maxAccuracy: 15,
                comments: {
                    ar: "براز طري بسبب خطأ في العلف؛ لا توجد آفات.",
                    en: "Soft droppings due to feed error; no lesions."
                },
                clues: {
                    ar: ["براز طري", "خطأ في العلف", "لا آفات"],
                    en: ["Soft droppings", "Feed error", "No lesions"]
                }
            },
            "Bacterial enteritis": {
                minAccuracy: 10,
                maxAccuracy: 20,
                comments: {
                    ar: "التهاب معوي катаральный خفيف؛ فلورا مختلطة في الزراعة.",
                    en: "Mild catarrhal enteritis; mixed flora on culture."
                },
                clues: {
                    ar: ["التهاب معوي خفيف", "فلورا مختلطة"],
                    en: ["Mild enteritis", "Mixed flora"]
                }
            },
            "Viral enteritis": {
                minAccuracy: 5,
                maxAccuracy: 10,
                comments: {
                    ar: "في الغالب في الكتاكيت <10 أيام؛ براز مائي، لا دم.",
                    en: "Mostly in chicks <10 days; watery droppings, no blood."
                },
                clues: {
                    ar: ["كتاكيت <10 أيام", "براز مائي", "لا دم"],
                    en: ["Chicks <10 days", "Watery droppings", "No blood"]
                }
            }
        };

        // Breed database for chicken analysis
        this.breedDatabase = {
            'Ross 308': {
                name: { ar: 'روس 308', en: 'Ross 308' },
                weightRange: { min: 2.5, max: 3.2 },
                characteristics: { ar: ['أبيض الريش', 'جسم ممتلئ', 'نمو سريع'], en: ['White feathers', 'Full body', 'Fast growth'] }
            },
            'Cobb 500': {
                name: { ar: 'كوب 500', en: 'Cobb 500' },
                weightRange: { min: 2.8, max: 3.5 },
                characteristics: { ar: ['أبيض الريش', 'صدر عريض', 'كفاءة علف عالية'], en: ['White feathers', 'Broad breast', 'High feed efficiency'] }
            },
            'ISA Brown': {
                name: { ar: 'إيزا براون', en: 'ISA Brown' },
                weightRange: { min: 2.0, max: 2.5 },
                characteristics: { ar: ['بني الريش', 'حجم متوسط', 'إنتاج بيض عالي'], en: ['Brown feathers', 'Medium size', 'High egg production'] }
            }
        };

        // Symptoms database
        this.symptomsDatabase = {
            chicken: {
                walking: {
                    ar: 'اختلال في المشي',
                    en: 'Walking disorder'
                },
                weight: {
                    ar: 'انخفاض في الوزن',
                    en: 'Weight loss'
                },
                feathers: {
                    ar: 'نفشان الريش',
                    en: 'Feather ruffling'
                },
                posture: {
                    ar: 'وضعية غير طبيعية',
                    en: 'Abnormal posture'
                }
            },
            feces: {
                diarrhea: {
                    ar: 'إسهال',
                    en: 'Diarrhea'
                },
                mucus: {
                    ar: 'مخاط',
                    en: 'Mucus'
                },
                blood: {
                    ar: 'دم',
                    en: 'Blood'
                },
                color: {
                    ar: 'لون غير طبيعي',
                    en: 'Abnormal color'
                }
            }
        };
    }

    // Main comprehensive analysis function
    analyzeComprehensive(chickenImage, fecesImage) {
        // Simulate image analysis and extract features
        const chickenAnalysis = this.analyzeChickenImage(chickenImage);
        const fecesAnalysis = this.analyzeFecesImage(fecesImage);
        
        // Combine analyses for comprehensive diagnosis
        return this.combineAnalyses(chickenAnalysis, fecesAnalysis);
    }

    analyzeChickenImage(image) {
        // Simulate chicken image analysis
        return {
            breed: this.detectBreed(image),
            weight: this.estimateWeight(image),
            symptoms: this.detectChickenSymptoms(image),
            age: this.estimateAge(image)
        };
    }

    analyzeFecesImage(image) {
        // Simulate feces image analysis
        return {
            color: this.detectFecesColor(image),
            texture: this.detectFecesTexture(image),
            symptoms: this.detectFecesSymptoms(image),
            consistency: this.detectConsistency(image)
        };
    }

    combineAnalyses(chickenAnalysis, fecesAnalysis) {
        // Calculate disease probabilities based on combined evidence
        const diseaseProbabilities = this.calculateDiseaseProbabilities(chickenAnalysis, fecesAnalysis);
        
        // Get the most probable disease
        const topDisease = this.getTopDisease(diseaseProbabilities);
        
        // Get possible diseases
        const possibleDiseases = this.generatePossibleDiseases(diseaseProbabilities, topDisease);
        
        // Generate comprehensive results
        return {
            overallConfidence: this.calculateOverallConfidence(diseaseProbabilities),
            breed: this.formatBreedResult(chickenAnalysis.breed),
            weight: this.formatWeightResult(chickenAnalysis.weight),
            symptoms: this.formatSymptomsResult(chickenAnalysis.symptoms, fecesAnalysis.symptoms),
            disease: this.formatDiseaseResult(topDisease),
            possibleDiseases: this.formatPossibleDiseasesResult(possibleDiseases),
            reason: this.formatReasonResult(topDisease, chickenAnalysis, fecesAnalysis),
            confirmation: this.formatConfirmationResult(topDisease),
            treatment: this.formatTreatmentResult(topDisease),
            prevention: this.formatPreventionResult(topDisease),
            reasoning: this.generateReasoning(topDisease, chickenAnalysis, fecesAnalysis)
        };
    }

    // دالة جديدة لتوليد الأمراض المحتملة
    generatePossibleDiseases(diseaseProbabilities, topDisease) {
        // إنشاء قائمة بالأمراض المحتملة (باستثناء المرض الأعلى)
        const possibleDiseases = [];
        
        for (const [diseaseName, data] of Object.entries(diseaseProbabilities)) {
            if (diseaseName !== topDisease.name) {
                possibleDiseases.push({
                    name: diseaseName,
                    probability: Math.min(95, Math.round(data.adjusted)),
                    tableData: this.diseaseTable[diseaseName]
                });
            }
        }
        
        // ترتيب تنازلي حسب الاحتمالية وأخذ أول 3 أمراض
        return possibleDiseases
            .sort((a, b) => b.probability - a.probability)
            .slice(0, 3);
    }

    calculateDiseaseProbabilities(chickenAnalysis, fecesAnalysis) {
        const probabilities = {};
        
        // Start with base probabilities from the fixed table
        for (const [disease, data] of Object.entries(this.diseaseTable)) {
            const baseProbability = (data.minAccuracy + data.maxAccuracy) / 2;
            probabilities[disease] = {
                base: baseProbability,
                adjusted: baseProbability,
                factors: []
            };
        }

        // Adjust probabilities based on symptoms and evidence
        this.adjustForFecesEvidence(probabilities, fecesAnalysis);
        this.adjustForChickenEvidence(probabilities, chickenAnalysis);
        this.adjustForAge(probabilities, chickenAnalysis.age);

        return probabilities;
    }

    adjustForFecesEvidence(probabilities, fecesAnalysis) {
        // Adjust based on feces color and symptoms
        if (fecesAnalysis.symptoms.includes('blood')) {
            probabilities['Coccidiosis'].adjusted *= 1.3;
            probabilities['Coccidiosis'].factors.push('براز دموي');
            
            probabilities['Necrotic enteritis'].adjusted *= 1.2;
            probabilities['Necrotic enteritis'].factors.push('براز دموي');
        }

        if (fecesAnalysis.symptoms.includes('mucus')) {
            probabilities['Coccidiosis'].adjusted *= 1.2;
            probabilities['Coccidiosis'].factors.push('مخاط في البراز');
        }

        if (fecesAnalysis.consistency === 'watery') {
            probabilities['Salmonellosis'].adjusted *= 1.3;
            probabilities['Salmonellosis'].factors.push('براز مائي');
            
            probabilities['Viral enteritis'].adjusted *= 1.2;
            probabilities['Viral enteritis'].factors.push('براز مائي');
        }
    }

    adjustForChickenEvidence(probabilities, chickenAnalysis) {
        // Adjust based on chicken symptoms
        if (chickenAnalysis.symptoms.includes('weight')) {
            probabilities['Helminthiasis'].adjusted *= 1.3;
            probabilities['Helminthiasis'].factors.push('انخفاض الوزن');
            
            probabilities['Mycotoxicosis'].adjusted *= 1.2;
            probabilities['Mycotoxicosis'].factors.push('انخفاض الوزن');
        }

        if (chickenAnalysis.symptoms.includes('walking')) {
            probabilities['Necrotic enteritis'].adjusted *= 1.1;
            probabilities['Necrotic enteritis'].factors.push('اختلال في المشي');
        }
    }

    adjustForAge(probabilities, age) {
        // Adjust based on chicken age
        if (age >= 3 && age <= 6) {
            probabilities['Coccidiosis'].adjusted *= 1.4;
            probabilities['Coccidiosis'].factors.push('عمر 3-6 أسابيع');
        }

        if (age < 2) {
            probabilities['Viral enteritis'].adjusted *= 1.3;
            probabilities['Viral enteritis'].factors.push('عمر أقل من 10 أيام');
        }
    }

    getTopDisease(probabilities) {
        let topDisease = null;
        let highestProbability = 0;

        for (const [disease, data] of Object.entries(probabilities)) {
            if (data.adjusted > highestProbability) {
                highestProbability = data.adjusted;
                topDisease = {
                    name: disease,
                    probability: Math.min(95, Math.round(data.adjusted)), // Cap at 95%
                    baseProbability: data.base,
                    factors: data.factors,
                    tableData: this.diseaseTable[disease]
                };
            }
        }

        return topDisease;
    }

    calculateOverallConfidence(probabilities) {
        // Calculate overall confidence based on disease probabilities and evidence strength
        const values = Object.values(probabilities).map(p => p.adjusted);
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        return Math.min(95, Math.round(average));
    }

    // Placeholder analysis functions (simulated)
    detectBreed(image) {
        const breeds = Object.keys(this.breedDatabase);
        const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
        return {
            name: randomBreed,
            confidence: Math.floor(Math.random() * 20) + 75,
            alternatives: breeds.filter(b => b !== randomBreed).slice(0, 2)
        };
    }

    estimateWeight(image) {
        return {
            estimated: (Math.random() * 1 + 2.5).toFixed(1) + ' kg',
            method: {
                ar: 'طريقة التقدير: camera-based morphological comparison',
                en: 'Estimation method: camera-based morphological comparison'
            },
            errorMargin: '±15%'
        };
    }

    detectChickenSymptoms(image) {
        const symptoms = Object.keys(this.symptomsDatabase.chicken);
        const numSymptoms = Math.floor(Math.random() * 3) + 1;
        return symptoms.slice(0, numSymptoms);
    }

    detectFecesSymptoms(image) {
        const symptoms = Object.keys(this.symptomsDatabase.feces);
        const numSymptoms = Math.floor(Math.random() * 2) + 1;
        return symptoms.slice(0, numSymptoms);
    }

    estimateAge(image) {
        return Math.floor(Math.random() * 20) + 1; // 1-20 weeks
    }

    detectFecesColor(image) {
        const colors = ['brown', 'green', 'yellow', 'red', 'white'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    detectFecesTexture(image) {
        const textures = ['normal', 'watery', 'mucoid', 'bloody'];
        return textures[Math.floor(Math.random() * textures.length)];
    }

    detectConsistency(image) {
        const consistencies = ['normal', 'soft', 'watery', 'hard'];
        return consistencies[Math.floor(Math.random() * consistencies.length)];
    }

    // Formatting functions for results
    formatBreedResult(breedData) {
        const breedInfo = this.breedDatabase[breedData.name];
        return {
            name: breedInfo.name,
            confidence: breedData.confidence,
            source: {
                ar: 'المصدر: aviagen',
                en: 'Source: aviagen'
            },
            alternatives: {
                ar: `بدائل مقترحة: ${breedData.alternatives.map(a => this.breedDatabase[a].name.ar).join('، ')}`,
                en: `Alternative breeds: ${breedData.alternatives.map(a => this.breedDatabase[a].name.en).join(', ')}`
            }
        };
    }

    formatWeightResult(weightData) {
        return {
            estimated: weightData.estimated,
            method: weightData.method,
            errorMargin: weightData.errorMargin,
            source: {
                ar: 'المصدر: sciencedirect',
                en: 'Source: sciencedirect'
            }
        };
    }

    formatSymptomsResult(chickenSymptoms, fecesSymptoms) {
        return {
            list: [
                ...chickenSymptoms.map(s => this.symptomsDatabase.chicken[s]),
                ...fecesSymptoms.map(s => this.symptomsDatabase.feces[s])
            ],
            source: {
                ar: 'المصدر: ',
                en: 'Source: '
            }
        };
    }

    formatDiseaseResult(diseaseData) {
        return {
            name: {
                ar: diseaseData.name,
                en: diseaseData.name
            },
            probability: diseaseData.probability,
            alternatives: {
                ar: 'يجب استبعاد الأمراض الأخرى بناءً على الفحوصات المعملية',
                en: 'Other diseases should be ruled out based on laboratory tests'
            }
        };
    }

    // دالة جديدة لتنسيق الأمراض المحتملة
    formatPossibleDiseasesResult(possibleDiseases) {
        return {
            diseases: possibleDiseases.map(disease => ({
                name: {
                    ar: disease.name,
                    en: disease.name
                },
                probability: disease.probability,
                comments: disease.tableData.comments
            })),
            source: {
                ar: 'المصدر: ',
                en: 'Source: '
            }
        };
    }

    formatReasonResult(diseaseData, chickenAnalysis, fecesAnalysis) {
        return {
            explanation: diseaseData.tableData.comments,
            evidence: [
                ...diseaseData.factors,
                {
                    ar: `العمر التقديري: ${chickenAnalysis.age} أسبوع`,
                    en: `Estimated age: ${chickenAnalysis.age} weeks`
                },
                {
                    ar: `لون البراز: ${fecesAnalysis.color}`,
                    en: `Feces color: ${fecesAnalysis.color}`
                }
            ]
        };
    }

    formatConfirmationResult(diseaseData) {
        const strategies = [
            {
                ar: 'فحص مجهري للبراز',
                en: 'Microscopic examination of feces'
            },
            {
                ar: 'زراعة بكتيرية',
                en: 'Bacterial culture'
            },
            {
                ar: 'فحص PCR إذا لزم الأمر',
                en: 'PCR testing if necessary'
            },
            {
                ar: 'تشريح في حالة الوفاة',
                en: 'Necropsy in case of death'
            }
        ];

        return { strategies };
    }

    formatTreatmentResult(diseaseData) {
        // Basic treatment recommendations (in real implementation, this would be more specific)
        const treatments = {
            'Coccidiosis': {
                medication: { ar: 'أمبروليوم أو سلفا', en: 'Amprolium or Sulfa drugs' },
                dosage: { ar: 'حسب تعليمات الطبيب البيطري', en: 'As per veterinarian instructions' },
                duration: { ar: '5-7 أيام', en: '5-7 days' },
                warnings: { ar: 'مراقبة الاستجابة وضمان الترطيب الكافي', en: 'Monitor response and ensure adequate hydration' }
            },
            'Necrotic enteritis': {
                medication: { ar: 'باسيتراسين أو فيرجينياميسين', en: 'Bacitracin or Virginiamycin' },
                dosage: { ar: 'حسب وزن الدجاجة', en: 'Based on chicken weight' },
                duration: { ar: '7-10 أيام', en: '7-10 days' },
                warnings: { ar: 'تحسين جودة العلف وتقليل البروتين', en: 'Improve feed quality and reduce protein' }
            }
        };

        return treatments[diseaseData.name] || {
            medication: { ar: 'استشر الطبيب البيطري', en: 'Consult veterinarian' },
            dosage: { ar: 'حسب التشخيص الدقيق', en: 'Based on accurate diagnosis' },
            duration: { ar: 'حسب الحالة', en: 'Depending on condition' },
            warnings: { ar: 'التشخيص الدقيق ضروري قبل العلاج', en: 'Accurate diagnosis required before treatment' }
        };
    }

    formatPreventionResult(diseaseData) {
        const measures = [
            {
                ar: 'عزل الطيور المصابة',
                en: 'Isolate infected birds'
            },
            {
                ar: 'تحسين النظافة والتطهير',
                en: 'Improve hygiene and disinfection'
            },
            {
                ar: 'مراجعة جودة العلف',
                en: 'Review feed quality'
            },
            {
                ar: 'تنفيذ برنامج تحصين مناسب',
                en: 'Implement appropriate vaccination program'
            },
            {
                ar: 'مراقبة القطيع بانتظام',
                en: 'Regular flock monitoring'
            }
        ];

        return { measures };
    }

    generateReasoning(diseaseData, chickenAnalysis, fecesAnalysis) {
        return {
            ar: `
                <div class="reasoning-step">
                    <h4><i class="fas fa-search"></i> تحليل الصور</h4>
                    <p>تم تحليل صورتين: صورة الدجاجة وصورة البراز. من صورة الدجاجة، تم تحديد السلالة والعمر التقديري والعلامات الظاهرية. من صورة البراز، تم تحليل اللون والقوام والعلامات غير الطبيعية.</p>
                </div>
                
                <div class="reasoning-step">
                    <h4><i class="fas fa-calculator"></i> حساب الاحتمالات</h4>
                    <p>تم استخدام الجدول الثابت للأمراض كقاعدة للاحتمالات. ثم تم تعديل هذه الاحتمالات بناءً على:</p>
                    <ul>
                        ${diseaseData.factors.map(factor => `<li>${factor}</li>`).join('')}
                        <li>العمر التقديري: ${chickenAnalysis.age} أسبوع</li>
                        <li>لون البراز: ${fecesAnalysis.color}</li>
                        <li>قوام البراز: ${fecesAnalysis.texture}</li>
                    </ul>
                </div>
                
                <div class="reasoning-step">
                    <h4><i class="fas fa-chart-line"></i> النتيجة النهائية</h4>
                    <p>بناءً على تحليل جميع الأدلة، تم تحديد أن ${diseaseData.name} هو المرض الأكثر احتمالاً بنسبة ${diseaseData.probability}%. الاحتمال الأساسي من الجدول كان ${Math.round(diseaseData.baseProbability)}%.</p>
                </div>
                
                <div class="reasoning-step">
                    <h4><i class="fas fa-exclamation-triangle"></i> ملاحظة هامة</h4>
                    <p>هذه النتائج استرشادية وتستند إلى تحليل الصور فقط. التشخيص النهائي يجب أن يتم بواسطة طبيب بيطري متخصص بناءً على فحوصات معملية دقيقة.</p>
                </div>
            `,
            en: `
                <div class="reasoning-step">
                    <h4><i class="fas fa-search"></i> Image Analysis</h4>
                    <p>Two images were analyzed: chicken image and feces image. From the chicken image, breed, estimated age, and clinical signs were identified. From the feces image, color, texture, and abnormal signs were analyzed.</p>
                </div>
                
                <div class="reasoning-step">
                    <h4><i class="fas fa-calculator"></i> Probability Calculation</h4>
                    <p>The fixed disease table was used as a probability base. These probabilities were then adjusted based on:</p>
                    <ul>
                        ${diseaseData.factors.map(factor => `<li>${factor}</li>`).join('')}
                        <li>Estimated age: ${chickenAnalysis.age} weeks</li>
                        <li>Feces color: ${fecesAnalysis.color}</li>
                        <li>Feces texture: ${fecesAnalysis.texture}</li>
                    </ul>
                </div>
                
                <div class="reasoning-step">
                    <h4><i class="fas fa-chart-line"></i> Final Result</h4>
                    <p>Based on the analysis of all evidence, ${diseaseData.name} was identified as the most probable disease with ${diseaseData.probability}% probability. The base probability from the table was ${Math.round(diseaseData.baseProbability)}%.</p>
                </div>
                
                <div class="reasoning-step">
                    <h4><i class="fas fa-exclamation-triangle"></i> Important Note</h4>
                    <p>These results are indicative and based on image analysis only. Final diagnosis should be made by a specialized veterinarian based on accurate laboratory tests.</p>
                </div>
            `
        };
    }
}

// Initialize the disease algorithm
window.diseaseAlgorithm = new DiseaseAlgorithm();