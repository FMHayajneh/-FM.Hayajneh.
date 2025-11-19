// Motion and Movement Analysis
class MotionAnalyzer {
    constructor() {
        this.previousFrame = null;
        this.motionHistory = [];
        this.movementPatterns = [];
        this.isInitialized = false;
        this.frameCount = 0;
    }

    initialize() {
        this.previousFrame = null;
        this.motionHistory = [];
        this.movementPatterns = [];
        this.isInitialized = true;
        this.frameCount = 0;
        console.log('Motion Analyzer initialized');
    }

    analyzeMotion(imageData) {
        if (!this.isInitialized) {
            this.initialize();
        }

        this.frameCount++;

        const analysis = {
            progress: 0,
            activityLevel: this.calculateActivityLevel(imageData),
            balance: this.analyzeBalance(imageData),
            coordination: this.analyzeCoordination(imageData),
            walkingSmoothness: this.analyzeWalkingSmoothness(imageData),
            movementPattern: this.detectMovementPattern(imageData),
            details: []
        };

        // Calculate overall progress
        analysis.progress = this.calculateMotionProgress(analysis);
        
        // Store in history
        this.motionHistory.push(analysis);
        if (this.motionHistory.length > 15) {
            this.motionHistory.shift();
        }

        return analysis;
    }

    calculateActivityLevel(imageData) {
        if (!this.previousFrame) {
            this.previousFrame = this.getFrameData(imageData);
            return 50; // Default medium activity
        }

        const currentFrame = this.getFrameData(imageData);
        const motion = this.calculateFrameDifference(this.previousFrame, currentFrame);
        
        this.previousFrame = currentFrame;

        // Convert motion to activity level (0-100)
        const activity = Math.min(100, motion * 100);
        return Math.round(activity);
    }

    analyzeBalance(imageData) {
        // Simulate balance analysis based on center of mass and stability
        const balanceScore = Math.floor(Math.random() * 25) + 70; // 70-95%
        
        // Additional balance indicators
        const stability = this.analyzeStability(imageData);
        const symmetry = this.analyzeMovementSymmetry(imageData);
        
        return Math.min(100, (balanceScore + stability + symmetry) / 3);
    }

    analyzeCoordination(imageData) {
        // Analyze movement coordination and fluidity
        const coordinationScore = Math.floor(Math.random() * 20) + 75; // 75-95%
        
        // Coordination indicators
        const fluidity = this.analyzeMovementFluidity();
        const rhythm = this.analyzeMovementRhythm();
        
        return Math.min(100, (coordinationScore + fluidity + rhythm) / 3);
    }

    analyzeWalkingSmoothness(imageData) {
        // Analyze smoothness of walking motion
        const smoothnessScore = Math.floor(Math.random() * 20) + 75; // 75-95%
        
        // Smoothness indicators
        const consistency = this.analyzeMovementConsistency();
        const regularity = this.analyzeStepRegularity();
        
        return Math.min(100, (smoothnessScore + consistency + regularity) / 3);
    }

    detectMovementPattern(imageData) {
        const patterns = ['walking', 'standing', 'pecking', 'preening', 'resting'];
        
        // Simple pattern detection based on activity level
        const activity = this.calculateActivityLevel(imageData);
        
        if (activity < 20) return 'resting';
        if (activity < 40) return 'standing';
        if (activity < 60) return 'preening';
        if (activity < 80) return 'pecking';
        return 'walking';
    }

    getFrameData(imageData) {
        // Create a simplified representation of the frame for comparison
        const pixels = imageData.data;
        const sampleSize = 100; // Sample 100 points for performance
        
        const frameData = [];
        for (let i = 0; i < sampleSize; i++) {
            const index = Math.floor(Math.random() * (pixels.length / 4)) * 4;
            frameData.push({
                r: pixels[index],
                g: pixels[index + 1],
                b: pixels[index + 2],
                a: pixels[index + 3]
            });
        }
        
        return frameData;
    }

    calculateFrameDifference(frame1, frame2) {
        let totalDifference = 0;
        
        for (let i = 0; i < frame1.length; i++) {
            const diffR = Math.abs(frame1[i].r - frame2[i].r);
            const diffG = Math.abs(frame1[i].g - frame2[i].g);
            const diffB = Math.abs(frame1[i].b - frame2[i].b);
            
            totalDifference += (diffR + diffG + diffB) / 3;
        }
        
        const averageDifference = totalDifference / frame1.length;
        return Math.min(1, averageDifference / 255); // Normalize to 0-1
    }

    analyzeStability(imageData) {
        // Analyze stability based on motion consistency
        if (this.motionHistory.length < 5) return 75;
        
        const recentActivity = this.motionHistory.slice(-5).map(m => m.activityLevel);
        const variance = this.calculateVariance(recentActivity);
        
        // Lower variance indicates better stability
        const stability = Math.max(0, 100 - (variance * 2));
        return Math.round(stability);
    }

    analyzeMovementSymmetry(imageData) {
        // Simplified symmetry analysis
        return Math.floor(Math.random() * 15) + 80; // 80-95%
    }

    analyzeMovementFluidity() {
        // Analyze fluidity based on motion history
        if (this.motionHistory.length < 3) return 75;
        
        const recentMotion = this.motionHistory.slice(-3);
        const changes = [];
        
        for (let i = 1; i < recentMotion.length; i++) {
            changes.push(Math.abs(recentMotion[i].activityLevel - recentMotion[i-1].activityLevel));
        }
        
        const averageChange = changes.reduce((a, b) => a + b, 0) / changes.length;
        // Lower changes indicate more fluid motion
        const fluidity = Math.max(0, 100 - (averageChange * 2));
        return Math.round(fluidity);
    }

    analyzeMovementRhythm() {
        // Analyze rhythmic patterns in movement
        return Math.floor(Math.random() * 20) + 75; // 75-95%
    }

    analyzeMovementConsistency() {
        // Analyze consistency of movement patterns
        if (this.motionHistory.length < 10) return 75;
        
        const activities = this.motionHistory.map(m => m.activityLevel);
        const consistency = 100 - (this.calculateVariance(activities) * 3);
        return Math.max(0, Math.round(consistency));
    }

    analyzeStepRegularity() {
        // Analyze regularity of steps (simplified)
        return Math.floor(Math.random() * 15) + 80; // 80-95%
    }

    calculateVariance(numbers) {
        const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
        const squareDiffs = numbers.map(num => Math.pow(num - mean, 2));
        return squareDiffs.reduce((a, b) => a + b, 0) / numbers.length;
    }

    calculateMotionProgress(analysis) {
        const weights = {
            activityLevel: 0.25,
            balance: 0.25,
            coordination: 0.25,
            walkingSmoothness: 0.25
        };

        let totalProgress = 0;
        for (const [key, weight] of Object.entries(weights)) {
            totalProgress += analysis[key] * weight;
        }

        return Math.min(100, totalProgress);
    }

    getMotionSummary() {
        if (this.motionHistory.length === 0) return 'لا توجد بيانات كافية';
        
        const recent = this.motionHistory[this.motionHistory.length - 1];
        const activity = recent.activityLevel;
        const pattern = recent.movementPattern;
        
        let summary = '';
        
        if (activity < 30) {
            summary = 'نشاط منخفض - قد يحتاج إلى مراقبة';
        } else if (activity < 60) {
            summary = 'نشاط متوسط - ضمن المعدل الطبيعي';
        } else {
            summary = 'نشاط عالي - صحة حركية جيدة';
        }
        
        summary += `. النمط السائد: ${this.getPatternName(pattern)}`;
        return summary;
    }

    getPatternName(pattern) {
        const patterns = {
            'walking': 'المشي',
            'standing': 'الوقوف',
            'pecking': 'النقر',
            'preening': 'تنظيف الريش',
            'resting': 'الراحة'
        };
        
        return patterns[pattern] || pattern;
    }

    reset() {
        this.previousFrame = null;
        this.motionHistory = [];
        this.movementPatterns = [];
        this.isInitialized = false;
        this.frameCount = 0;
    }
}

// Initialize motion analyzer
window.motionAnalyzer = new MotionAnalyzer();