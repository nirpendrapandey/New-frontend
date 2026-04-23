/**
 * SarkariNext - Production Grade Bilingual Exam Engine (V4)
 * Features: Dynamic Loading, Bilingual Toggle (EN/HI), Mode Detection (Practice/CBT)
 */

class ExamEngine {
    constructor() {
        this.questions = [];
        this.currentQuestions = [];
        this.currentIndex = 0;
        this.userAnswers = {};
        this.visited = new Set([0]);
        this.timer = null;
        this.timeLeft = 0;
        this.exam = '';
        this.mode = 'full'; // 'practice' or 'full'
        this.language = 'en'; // 'en' or 'hi'
        
        this.config = {
            ssc_gd: { practice: 20, full: 50, time: 60, marks: 2, negative: 0.5 },
            ssc_cgl: { practice: 20, full: 50, time: 60, marks: 2, negative: 0.5 },
            ssc_chsl: { practice: 20, full: 50, time: 60, marks: 2, negative: 0.5 },
            rrb_ntpc: { practice: 20, full: 50, time: 90, marks: 1, negative: 0.33 },
            up_police: { practice: 20, full: 50, time: 120, marks: 2, negative: 0.5 },
            upsssc_pet: { practice: 20, full: 50, time: 120, marks: 2, negative: 0.5 },
            delhi_police: { practice: 20, full: 50, time: 90, marks: 1, negative: 0.25 },
            army_gd: { practice: 20, full: 50, time: 60, marks: 2, negative: 0.5 }
        };

        this.init();
    }

    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        this.exam = urlParams.get('exam') || 'ssc_gd';
        this.mode = urlParams.get('mode') || 'full';
        
        await this.loadQuestions(this.exam);
        
        this.setupEventListeners();
        this.renderInitialUI();
        this.startTimer();
        this.renderQuestion();
    }

    async loadQuestions(exam) {
        try {
            const response = await fetch(`./data/${exam}.json`);
            if (!response.ok) throw new Error('Failed to load questions');
            let data = await response.json();

            // Local storage merge
            const localQuestions = JSON.parse(localStorage.getItem(`custom_questions_${exam}`) || '[]');
            data = [...data, ...localQuestions];

            this.questions = data;
            
            // Mode-based selection
            const targetCount = this.mode === 'practice' ? 20 : 50;
            this.currentQuestions = this.shuffle(this.questions).slice(0, targetCount);
            
            // Timer based on count (roughly)
            this.timeLeft = (this.mode === 'practice' ? 20 : (this.config[exam]?.time || 60)) * 60;
        } catch (error) {
            console.error('Error loading questions:', error);
            this.currentQuestions = this.getFallbackQuestions();
            this.timeLeft = 60 * 60;
        }
    }

    shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    setupEventListeners() {
        document.getElementById('saveNextBtn')?.addEventListener('click', () => this.saveAndNext());
        document.getElementById('prevBtn')?.addEventListener('click', () => this.prevQuestion());
        document.getElementById('markBtn')?.addEventListener('click', () => this.markForReview());
        document.getElementById('clearBtn')?.addEventListener('click', () => this.clearResponse());
        document.getElementById('submitBtn')?.addEventListener('click', () => this.confirmSubmit());
        document.getElementById('submitBtnTop')?.addEventListener('click', () => this.confirmSubmit());
        
        document.getElementById('paletteToggle')?.addEventListener('click', () => {
            document.getElementById('leftPanel')?.classList.add('open');
        });
        document.getElementById('closePalette')?.addEventListener('click', () => {
            document.getElementById('leftPanel')?.classList.remove('open');
        });
    }

    setLanguage(lang) {
        this.language = lang;
        document.getElementById('btn-en')?.classList.toggle('active', lang === 'en');
        document.getElementById('btn-hi')?.classList.toggle('active', lang === 'hi');
        this.renderQuestion();
    }

    startTimer() {
        const timerDisplay = document.getElementById('timer');
        this.timer = setInterval(() => {
            if (this.timeLeft <= 0) {
                this.submitTest();
                return;
            }
            this.timeLeft--;
            const hrs = Math.floor(this.timeLeft / 3600);
            const mins = Math.floor((this.timeLeft % 3600) / 60);
            const secs = this.timeLeft % 60;
            if (timerDisplay) {
                timerDisplay.textContent = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    renderQuestion() {
        const q = this.currentQuestions[this.currentIndex];
        if (!q) return;

        // Bilingual content selection
        const questionText = this.language === 'hi' && q.question_hi ? q.question_hi : q.question;
        const optionsList = this.language === 'hi' && q.options_hi ? q.options_hi : q.options;

        document.getElementById('qNo').textContent = `Question ${this.currentIndex + 1}`;
        document.getElementById('qTopic').textContent = `Topic: ${q.subject || 'General'}`;
        document.getElementById('qText').innerHTML = questionText;

        const optionsBox = document.getElementById('optionsBox');
        if (optionsBox) {
            optionsBox.innerHTML = optionsList.map((opt, i) => `
                <label class="opt" onclick="engine.selectOption(${i})">
                    <input type="radio" name="qOption" ${this.userAnswers[this.currentIndex]?.answer === i ? 'checked' : ''}>
                    <span>${opt}</span>
                </label>
            `).join('');
        }

        const statusText = document.getElementById('questionStatusText');
        const status = this.userAnswers[this.currentIndex]?.status || (this.visited.has(this.currentIndex) ? 'not_answered' : 'not_visited');
        if (statusText) {
            statusText.textContent = status === 'answered' ? (this.language === 'hi' ? "आपने इस प्रश्न का उत्तर दे दिया है।" : "You have answered this question.") : 
                                    status === 'review' ? (this.language === 'hi' ? "पुनरीक्षण के लिए चिह्नित किया गया।" : "Marked for review.") : 
                                    (this.language === 'hi' ? "अभी तक उत्तर नहीं दिया गया।" : "Not answered yet.");
        }

        this.updatePalette();
        this.updateStats();
    }

    selectOption(index) {
        if (!this.userAnswers[this.currentIndex]) {
            this.userAnswers[this.currentIndex] = {};
        }
        this.userAnswers[this.currentIndex].answer = index;
    }

    saveAndNext() {
        if (this.userAnswers[this.currentIndex]?.answer !== undefined) {
            this.userAnswers[this.currentIndex].status = 'answered';
        }
        this.nextQuestion();
    }

    markForReview() {
        if (!this.userAnswers[this.currentIndex]) {
            this.userAnswers[this.currentIndex] = {};
        }
        this.userAnswers[this.currentIndex].status = 'review';
        this.nextQuestion();
    }

    clearResponse() {
        delete this.userAnswers[this.currentIndex];
        this.renderQuestion();
    }

    nextQuestion() {
        if (this.currentIndex < this.currentQuestions.length - 1) {
            this.currentIndex++;
            this.visited.add(this.currentIndex);
            this.renderQuestion();
        }
    }

    prevQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.visited.add(this.currentIndex);
            this.renderQuestion();
        }
    }

    jumpToQuestion(index) {
        this.currentIndex = index;
        this.visited.add(this.currentIndex);
        this.renderQuestion();
        document.getElementById('leftPanel')?.classList.remove('open');
    }

    updatePalette() {
        const palette = document.getElementById('palette');
        if (!palette) return;

        palette.innerHTML = this.currentQuestions.map((_, i) => {
            const status = this.userAnswers[i]?.status;
            const isCurrent = this.currentIndex === i;
            const isVisited = this.visited.has(i);
            
            let stateClass = 'notVisited';
            if (status === 'answered') stateClass = 'answered';
            else if (status === 'review') stateClass = 'review';
            else if (isVisited) stateClass = 'skipped';
            if (isCurrent) stateClass += ' active';

            return `
                <button class="qBtn ${stateClass}" onclick="engine.jumpToQuestion(${i})">
                    ${i + 1}
                </button>
            `;
        }).join('');
    }

    updateStats() {
        let answered = 0;
        let review = 0;
        let skipped = 0;
        let notVisited = 0;

        for (let i = 0; i < this.currentQuestions.length; i++) {
            const status = this.userAnswers[i]?.status;
            if (status === 'answered') answered++;
            else if (status === 'review') review++;
            else if (this.visited.has(i)) skipped++;
            else notVisited++;
        }

        document.getElementById('stTotal').textContent = this.currentQuestions.length;
        document.getElementById('stAnswered').textContent = answered;
        document.getElementById('stReview').textContent = review;
        document.getElementById('stNotAnswered').textContent = skipped;
        document.getElementById('stNotVisited').textContent = notVisited;
        
        const rate = ((answered + review) / this.currentQuestions.length * 100).toFixed(0);
        document.getElementById('stAttemptRate').textContent = `${rate}%`;
    }

    renderInitialUI() {
        const examName = this.exam.replace('_', ' ').toUpperCase();
        document.getElementById('examTitle').textContent = `${examName} ${this.mode.toUpperCase()}`;
        
        const studentDetails = JSON.parse(localStorage.getItem('studentDetails') || '{}');
        document.getElementById('candidateName').textContent = studentDetails.name || 'Candidate';
        
        document.getElementById('examMeta').textContent = `${this.currentQuestions.length} Questions | ${this.mode === 'practice' ? 20 : 60} Min`;
    }

    confirmSubmit() {
        const msg = this.language === 'hi' ? "¿क्या आप वाकई टेस्ट सबमिट करना चाहते हैं?" : "Are you sure you want to submit the test?";
        if (confirm(msg)) {
            this.submitTest();
        }
    }

    submitTest() {
        clearInterval(this.timer);
        const results = this.calculateResults();
        localStorage.setItem('lastTestResult', JSON.stringify(results));
        window.location.href = `predicy-result.html`;
    }

    calculateResults() {
        let correct = 0;
        let incorrect = 0;
        let attempted = 0;

        this.currentQuestions.forEach((q, i) => {
            const ans = this.userAnswers[i];
            if (ans?.answer !== undefined) {
                attempted++;
                if (ans.answer === q.answer) {
                    correct++;
                } else {
                    incorrect++;
                }
            }
        });

        const config = this.config[this.exam] || { marks: 1, negative: 0.25 };
        const score = (correct * config.marks) - (incorrect * config.negative);
        const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

        return {
            exam: this.exam,
            mode: this.mode,
            totalQuestions: this.currentQuestions.length,
            attempted,
            correct,
            wrong: incorrect,
            score: score.toFixed(2),
            accuracy: accuracy.toFixed(2),
            timeTakenSec: (this.mode === 'practice' ? 20 : 60) * 60 - this.timeLeft,
            timestamp: new Date().toISOString()
        };
    }

    getFallbackQuestions() {
        return [
            {
                id: 0,
                question: "Welcome to SarkariNext. Please check your data connection.",
                question_hi: "SarkariNext में आपका स्वागत है। कृपया अपना डेटा कनेक्शन जांचें।",
                options: ["Retry", "Contact Support", "Go Home", "Wait"],
                options_hi: ["पुनः प्रयास करें", "सहायता से संपर्क करें", "होम पर जाएं", "प्रतीक्षा करें"],
                answer: 0,
                subject: "System",
                difficulty: "easy"
            }
        ];
    }
}

const engine = new ExamEngine();
window.addQuestion = ExamEngine.addQuestion;
