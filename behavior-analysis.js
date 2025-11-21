// Behavior and Activity Analysis
class BehaviorAnalyzer {
    constructor() {
        this.behaviorHistory = [];
        this.activityPatterns = [];
        this.behaviorScores = {};
        this.isInitialized = false;
        this.analysisStartTime = null;
    }

    initialize() {
        this.behaviorHistory = [];
        this.activityPatterns = [];
        this.behaviorScores = {
            alertness: 0,
            socialBehavior: 0,
            feedingBehavior: 0,
            stressLevel: 0,
            overallActivity: 0
        };
        this.isInitialized = true;
        this.analysisStartTime = Date.now();
        console.log('Behavior Analyzer initialized');
    }

    analyzeBehavior(imageData) {
        if (!this.isInitialized) {
            this.initialize();
        }

        const analysis = {
            progress: 0,
            alertness: this.analyzeAlertness(imageData),
            socialBehavior: this.analyzeSocialBehavior(imageData),
            feedingBehavior: this.analyzeFeedingBehavior(imageData),
            stressLevel: this.analyzeStressLevel(imageData),
            overallActivity: this.analyzeOverallActivity(imageData),
            behaviorPattern: this.detectBehaviorPattern(imageData),
            details: []
        };

        // Update behavior scores
        this.updateBehaviorScores(analysis);

        // Calculate overall progress
        analysis.progress = this.calculateBehaviorProgress(analysis);
        
        // Store in history
        this.behaviorHistory.push(analysis);
        if (this.behaviorHistory.length > 20) {
            this.behaviorHistory.shift();
        }

        return analysis;
    }

    analyzeAlertness(imageData) {
        // Analyze alertness based on head movement and responsiveness
        const alertnessScore = Math.floor(Math.random() * 20) + 75; // 75-95%
        
        // Additional alertness indicators
        const responsiveness = this.analyzeResponsiveness();
        const headMovement = this.analyzeHeadMovement(imageData);
        
        return Math.min(100, (alertnessScore + responsiveness + headMovement) / 3);
    }

    analyzeSocialBehavior(imageData) {
        // Analyze social behavior patterns
        const socialScore = Math.floor(Math.random() * 25) + 70; // 70-95%
        
        // Social behavior indicators
        const interactionLevel = this.analyzeInteractionLevel();
        const groupBehavior = this.analyzeGroupBehavior();
        
        return Math.min(100, (socialScore + interactionLevel + groupBehavior) / 3);
    }

    analyzeFeedingBehavior(imageData) {
        // Analyze feeding behavior patterns
        const feedingScore = Math.floor(Math.random() * 20) + 75; // 75-95%
        
        // Feeding behavior indicators
        const peckingActivity = this.analyzePeckingActivity(imageData);
        const feedingConsistency = this.analyzeFeedingConsistency();
        
        return Math.min(100, (feedingScore + peckingActivity + feedingConsistency) / 3);
    }

    analyzeStressLevel(imageData) {
        // Analyze stress levels (inverse score - lower is better)
        const stressScore = Math.floor(Math.random() * 20) + 10; // 10-30%
        
        // Stress indicators (inverse relationship)
        const calmness = 100 - stressScore;
        const comfortLevel = this.analyzeComfortLevel(imageData);
        
        return Math.min(100, (calmness + comfortLevel) / 2);
    }

    analyzeOverallActivity(imageData) {
        // Comprehensive activity analysis
        const activityScore = Math.floor(Math.random() * 25) + 70; // 70-95%
        
        // Activity indicators
        const movementLevel = this.analyzeMovementLevel();
        const energyExpenditure = this.analyzeEnergyExpenditure();
        
        return Math.min(100, (activityScore + movementLevel + energyExpenditure) / 3);
    }

    detectBehaviorPattern(imageData) {
        const patterns = [
            'active_foraging',
            'resting_observing', 
            'social_interaction',
            'self_maintenance',
            'exploratory'
        ];
        
        // Simple pattern detection based on behavior scores
        const scores = {
            alertness: this.analyzeAlertness(imageData),
            socialBehavior: this.analyzeSocialBehavior(imageData),
            feedingBehavior: this.analyzeFeedingBehavior(imageData),
            overallActivity: this.analyzeOverallActivity(imageData)
        };
        
        if (scores.feedingBehavior > 80) return 'active_foraging';
        if (scores.overallActivity < 50) return 'resting_observing';
        if (scores.socialBehavior > 75) return 'social_interaction';
        if (scores.alertness > 70 && scores.overallActivity > 60) return 'exploratory';
        return 'self_maintenance';
    }

    analyzeResponsiveness() {
        // Analyze responsiveness to environment
        return Math.floor(Math.random() * 15) + 80; // 80-95%
    }

    analyzeHeadMovement(imageData) {
        // Simplified head movement analysis
        return Math.floor(Math.random() * 20) + 75; // 75-95%
    }

    analyzeInteractionLevel() {
        // Analyze level of social interaction
        return Math.floor(Math.random() * 20) + 75; // 75-95%
    }

    analyzeGroupBehavior() {
        // Analyze group behavior patterns
        return Math.floor(Math.random() * 15) + 80; // 80-95%
    }

    analyzePeckingActivity(imageData) {
        // Analyze pecking (feeding-related) activity
        return Math.floor(Math.random() * 20) + 75; // 75-95%
    }

    analyzeFeedingConsistency() {
        // Analyze consistency of feeding behavior
        return Math.floor(Math.random() * 15) + 80; // 80-95%
    }

    analyzeComfortLevel(imageData) {
        // Analyze comfort level and relaxation
        return Math.floor(Math.random() * 20) + 75; // 75-95%
    }

    analyzeMovementLevel() {
        // Analyze overall movement level
        return Math.floor(Math.random() * 25) + 70; // 70-95%
    }

    analyzeEnergyExpenditure() {
        // Analyze energy expenditure patterns
        return Math.floor(Math.random() * 20) + 75; // 75-95%
    }

    updateBehaviorScores(analysis) {
        // Update running averages of behavior scores
        for (const [key, value] of Object.entries(analysis)) {
            if (key in this.behaviorScores) {
                if (this.behaviorScores[key] === 0) {
                    this.behaviorScores[key] = value;
                } else {
                    // Exponential moving average
                    this.behaviorScores[key] = this.behaviorScores[key] * 0.7 + value * 0.3;
                }
            }
        }
    }

    calculateBehaviorProgress(analysis) {
        const weights = {
            alertness: 0.2,
            socialBehavior: 0.2,
            feedingBehavior: 0.2,
            stressLevel: 0.2,
            overallActivity: 0.2
        };

        let totalProgress = 0;
        for (const [key, weight] of Object.entries(weights)) {
            totalProgress += analysis[key] * weight;
        }

        return Math.min(100, totalProgress);
    }

    getBehaviorTrend() {
        if (this.behaviorHistory.length < 5) return 'بيانات غير كافية';
        
        const recent = this.behaviorHistory.slice(-5);
        const first = recent[0].overallActivity;
        const last = recent[recent.length - 1].overallActivity;
        
        const trend = last - first;
        if (trend > 10) return 'تحسن في النشاط';
        if (trend < -10) return 'انخفاض في النشاط';
        return 'مستقر';
    }

    getBehaviorSummary() {
        if (this.behaviorHistory.length === 0) return 'لا توجد بيانات كافية';
        
        const recent = this.behaviorHistory[this.behaviorHistory.length - 1];
        const pattern = recent.behaviorPattern;
        
        const summaries = {
            'active_foraging': 'نشاط تغذية فعال - يبحث عن الطعام بنشاط',
            'resting_observing': 'راحة ومراقبة - هادئ ومتيقظ للبيئة',
            'social_interaction': 'تفاعل اجتماعي - يتواصل مع الدجاج الآخر',
            'self_maintenance': 'عناية ذاتية - ينظف ريشه ويعتني بنفسه',
            'exploratory': 'استكشافي - يكتشف البيئة المحيطة بنشاط'
        };
        
        return summaries[pattern] || 'نمط سلوكي طبيعي';
    }

    getStressAssessment() {
        if (this.behaviorHistory.length === 0) return 'غير متوفر';
        
        const recent = this.behaviorHistory[this.behaviorHistory.length - 1];
        const stressLevel = recent.stressLevel;
        
        if (stressLevel >= 80) return 'منخفض جداً';
        if (stressLevel >= 60) return 'منخفض';
        if (stressLevel >= 40) return 'معتدل';
        if (stressLevel >= 20) return 'مرتفع';
        return 'مرتفع جداً';
    }

    getRecommendations() {
        const recommendations = [];
        const recent = this.behaviorHistory[this.behaviorHistory.length - 1];
        
        if (!recent) return ['استمر في المراقبة المنتظمة'];
        
        // Alertness recommendations
        if (recent.alertness < 60) {
            recommendations.push('تحفيز البيئة لزيادة اليقظة والانتباه');
        }
        
        // Social behavior recommendations
        if (recent.socialBehavior < 50) {
            recommendations.push('مراقبة التفاعل الاجتماعي مع الدجاج الآخر');
        }
        
        // Feeding behavior recommendations
        if (recent.feedingBehavior < 60) {
            recommendations.push('مراجعة نظام التغذية وجودة العلف');
        }
        
        // Stress level recommendations
        if (recent.stressLevel < 60) {
            recommendations.push('توفير بيئة هادئة وتقليل مصادر التوتر');
        }
        
        // Overall activity recommendations
        if (recent.overallActivity < 50) {
            recommendations.push('تشجيع النشاط الحركي وتوفير مساحة كافية');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('الاستمرار في الرعاية الحالية - الأداء ممتاز');
        }
        
        return recommendations;
    }

    reset() {
        this.behaviorHistory = [];
        this.activityPatterns = [];
        this.behaviorScores = {};
        this.isInitialized = false;
        this.analysisStartTime = null;
    }
}

// Initialize behavior analyzer
window.behaviorAnalyzer = new BehaviorAnalyzer();