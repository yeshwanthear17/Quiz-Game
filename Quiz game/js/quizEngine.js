/**
 * QuizEngine - Core State Machine & Game Logic
 * Manages active quiz sessions, timing loops, answer scoring, power-ups, and streaks.
 */

class QuizEngine {
  constructor() {
    this.quiz = null;
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.currentStreak = 0;
    this.maxStreak = 0;
    this.correctCount = 0;
    this.timer = null;
    this.timeRemaining = 0;
    this.questionDuration = 20;
    this.mode = 'standard'; // 'standard', 'rapid', 'survival', 'practice'
    
    // Powerups & state flags
    this.fiftyFiftyUsed = false;
    this.hintUsed = false;
    this.isAnswerLocked = false;

    // Detailed responses record
    this.responses = [];
    
    // Callbacks
    this.onTick = null;
    this.onQuestionChange = null;
    this.onQuizComplete = null;
    this.onLowTime = null;
  }

  startQuiz(quizData, options = {}) {
    this.quiz = quizData;
    // Deep clone questions
    this.questions = JSON.parse(JSON.stringify(quizData.questions || []));
    
    // Shuffle options order if requested (optional) or keep original
    this.currentIndex = 0;
    this.score = 0;
    this.currentStreak = 0;
    this.maxStreak = 0;
    this.correctCount = 0;
    this.fiftyFiftyUsed = false;
    this.hintUsed = false;
    this.responses = [];
    this.mode = options.mode || 'standard';

    if (this.mode === 'rapid') {
      this.questionDuration = 10;
    } else if (options.customTime) {
      this.questionDuration = options.customTime;
    } else {
      this.questionDuration = quizData.timePerQuestion || 20;
    }

    this.loadQuestion(0);
  }

  loadQuestion(index) {
    this.stopTimer();
    this.currentIndex = index;
    this.isAnswerLocked = false;
    this.hintUsed = false;
    
    const currentQ = this.questions[this.currentIndex];
    if (!currentQ) {
      this.finishQuiz();
      return;
    }

    // Reset remaining time
    this.timeRemaining = this.questionDuration;

    if (this.onQuestionChange) {
      this.onQuestionChange({
        question: currentQ,
        index: this.currentIndex,
        total: this.questions.length,
        score: this.score,
        streak: this.currentStreak,
        fiftyFiftyUsed: this.fiftyFiftyUsed,
        mode: this.mode
      });
    }

    if (this.mode !== 'practice') {
      this.startTimer();
    }
  }

  startTimer() {
    this.stopTimer();
    
    // Trigger initial tick
    if (this.onTick) this.onTick(this.timeRemaining, this.questionDuration);

    this.timer = setInterval(() => {
      this.timeRemaining--;

      if (window.quizAudio) {
        if (this.timeRemaining <= 5 && this.timeRemaining > 0) {
          window.quizAudio.playLowTimeWarning();
          if (this.onLowTime) this.onLowTime(this.timeRemaining);
        } else if (this.timeRemaining > 5) {
          window.quizAudio.playTick();
        }
      }

      if (this.onTick) {
        this.onTick(this.timeRemaining, this.questionDuration);
      }

      if (this.timeRemaining <= 0) {
        this.stopTimer();
        this.handleTimeout();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  submitAnswer(optionIndex) {
    if (this.isAnswerLocked) return null;
    this.isAnswerLocked = true;
    this.stopTimer();

    const currentQ = this.questions[this.currentIndex];
    const isCorrect = optionIndex === currentQ.correct;
    const timeSpent = this.questionDuration - this.timeRemaining;

    let pointsEarned = 0;
    let speedBonus = 0;
    let streakMultiplier = 1.0;

    if (isCorrect) {
      this.correctCount++;
      this.currentStreak++;
      if (this.currentStreak > this.maxStreak) {
        this.maxStreak = this.currentStreak;
      }

      // Base score
      const basePoints = 100;

      // Speed bonus (up to +50 points if answered fast)
      if (this.mode !== 'practice' && this.questionDuration > 0) {
        speedBonus = Math.round((this.timeRemaining / this.questionDuration) * 50);
      }

      // Streak multiplier
      if (this.currentStreak >= 5) streakMultiplier = 2.0;
      else if (this.currentStreak >= 3) streakMultiplier = 1.5;
      else if (this.currentStreak >= 2) streakMultiplier = 1.2;

      pointsEarned = Math.round((basePoints + speedBonus) * streakMultiplier);
      this.score += pointsEarned;

      if (window.quizAudio) window.quizAudio.playCorrect();
    } else {
      this.currentStreak = 0;
      if (window.quizAudio) window.quizAudio.playWrong();
    }

    // Record detailed response
    this.responses.push({
      questionId: currentQ.id,
      questionText: currentQ.question,
      options: currentQ.options,
      correctIndex: currentQ.correct,
      userSelectedIndex: optionIndex,
      isCorrect: isCorrect,
      timeSpent: timeSpent,
      pointsEarned: pointsEarned,
      explanation: currentQ.explanation || 'No explanation provided.'
    });

    return {
      isCorrect,
      correctIndex: currentQ.correct,
      userSelectedIndex: optionIndex,
      pointsEarned,
      speedBonus,
      streakMultiplier,
      newScore: this.score,
      streak: this.currentStreak,
      isSurvivalOver: !isCorrect && this.mode === 'survival'
    };
  }

  handleTimeout() {
    if (this.isAnswerLocked) return;
    this.isAnswerLocked = true;
    
    const currentQ = this.questions[this.currentIndex];
    this.currentStreak = 0;

    if (window.quizAudio) window.quizAudio.playWrong();

    this.responses.push({
      questionId: currentQ.id,
      questionText: currentQ.question,
      options: currentQ.options,
      correctIndex: currentQ.correct,
      userSelectedIndex: -1, // -1 means timed out / skipped
      isCorrect: false,
      timeSpent: this.questionDuration,
      pointsEarned: 0,
      explanation: currentQ.explanation || 'Time ran out!'
    });

    if (this.onQuestionTimeout) {
      this.onQuestionTimeout({
        correctIndex: currentQ.correct,
        newScore: this.score,
        streak: 0
      });
    }
  }

  useFiftyFifty() {
    if (this.fiftyFiftyUsed || this.isAnswerLocked) return null;
    const currentQ = this.questions[this.currentIndex];
    
    const wrongIndices = [];
    currentQ.options.forEach((_, idx) => {
      if (idx !== currentQ.correct) wrongIndices.push(idx);
    });

    // Randomly select 2 wrong indices to hide
    wrongIndices.sort(() => 0.5 - Math.random());
    const hiddenIndices = wrongIndices.slice(0, 2);

    this.fiftyFiftyUsed = true;
    if (window.quizAudio) window.quizAudio.playPowerup();

    return hiddenIndices;
  }

  nextQuestion() {
    if (this.currentIndex + 1 < this.questions.length) {
      this.loadQuestion(this.currentIndex + 1);
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz() {
    this.stopTimer();

    const totalQuestions = this.questions.length;
    const accuracyPercentage = totalQuestions > 0 ? Math.round((this.correctCount / totalQuestions) * 100) : 0;
    
    let totalTimeTaken = 0;
    this.responses.forEach(r => totalTimeTaken += (r.timeSpent || 0));

    // Determine performance rank
    let rankTitle = 'Novice Learner';
    let rankBadge = '📚';
    if (accuracyPercentage === 100) {
      rankTitle = 'Grand Master';
      rankBadge = '👑';
    } else if (accuracyPercentage >= 80) {
      rankTitle = 'Quiz Whiz';
      rankBadge = '🏆';
    } else if (accuracyPercentage >= 60) {
      rankTitle = 'Sharp Mind';
      rankBadge = '🥈';
    } else if (accuracyPercentage >= 40) {
      rankTitle = 'Apprentice';
      rankBadge = '🥉';
    }

    const summary = {
      quizId: this.quiz.id,
      quizTitle: this.quiz.title,
      category: this.quiz.category,
      score: this.score,
      correctCount: this.correctCount,
      totalQuestions: totalQuestions,
      accuracyPercentage: accuracyPercentage,
      maxStreak: this.maxStreak,
      totalTimeTaken: totalTimeTaken,
      rankTitle: rankTitle,
      rankBadge: rankBadge,
      responses: this.responses
    };

    if (window.quizAudio) window.quizAudio.playFanfare();

    if (this.onQuizComplete) {
      this.onQuizComplete(summary);
    }

    return summary;
  }
}

window.quizEngine = new QuizEngine();
