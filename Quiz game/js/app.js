/**
 * Main Application Controller - QuizSphere
 * Handles routing, UI state, preset/custom quiz rendering, confetti effects, and hotkeys.
 */

class App {
  constructor() {
    this.currentView = 'home';
    this.activeCategory = 'all';
    this.activeQuizId = null;
    this.confettiAnimationId = null;
  }

  init() {
    this.updateStatsDisplay();
    this.renderQuizzesGrid();
    this.setupEventListeners();
    this.setupKeyboardHotkeys();

    // Set engine callbacks
    window.quizEngine.onQuestionChange = (data) => this.handleQuestionChange(data);
    window.quizEngine.onTick = (timeRemaining, duration) => this.handleTimerTick(timeRemaining, duration);
    window.quizEngine.onQuizComplete = (summary) => this.handleQuizComplete(summary);
  }

  // --- VIEW ROUTING ---
  showView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const target = document.getElementById(`view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`);
    if (target) {
      target.classList.add('active');
    }

    if (viewName === 'home') {
      this.updateStatsDisplay();
      this.renderQuizzesGrid();
    } else if (viewName === 'creator') {
      window.quizCreator.initUI();
    } else if (viewName === 'history') {
      this.renderHistoryTable();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- STATS & HOME RENDER ---
  updateStatsDisplay() {
    const stats = window.storageManager.getStats();
    const elemTaken = document.getElementById('statQuizzesTaken');
    const elemScore = document.getElementById('statHighestScore');
    const elemCorrect = document.getElementById('statTotalCorrect');
    const elemStreak = document.getElementById('statHighestStreak');

    if (elemTaken) elemTaken.textContent = stats.quizzesTaken;
    if (elemScore) elemScore.textContent = stats.highestScore;
    if (elemCorrect) elemCorrect.textContent = stats.correctAnswersCount;
    if (elemStreak) elemStreak.textContent = `${stats.highestStreak} 🔥`;
  }

  renderQuizzesGrid() {
    const grid = document.getElementById('quizzesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const customQuizzes = window.storageManager.getCustomQuizzes();
    const allQuizzes = [...window.PRESET_QUIZZES, ...customQuizzes];

    const filtered = allQuizzes.filter(q => {
      if (this.activeCategory === 'all') return true;
      if (this.activeCategory === 'Custom') return q.isCustom;
      return q.category === this.activeCategory;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-12 glass-card rounded-2xl p-8 border border-white/10">
          <div class="w-16 h-16 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto text-2xl mb-4">
            <i class="fas fa-folder-open"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">No Quizzes Found</h3>
          <p class="text-gray-400 text-sm mb-4">No quizzes available in this category yet.</p>
          <button onclick="app.showView('creator')" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all inline-flex items-center gap-2">
            <i class="fas fa-plus"></i> Create Custom Quiz
          </button>
        </div>
      `;
      return;
    }

    filtered.forEach(quiz => {
      const card = document.createElement('div');
      card.className = 'glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4 border border-white/10 relative overflow-hidden group';

      const qCount = quiz.questions ? quiz.questions.length : 0;
      const difficultyColor = quiz.difficulty === 'Hard' ? 'text-rose-400 border-rose-500/30' : quiz.difficulty === 'Medium' ? 'text-amber-400 border-amber-500/30' : 'text-emerald-400 border-emerald-500/30';

      card.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-tr ${quiz.color || 'from-indigo-500 to-purple-600'} flex items-center justify-center text-white text-xl shadow-lg">
              <i class="fas ${quiz.icon || 'fa-question'}"></i>
            </div>
            <div class="flex items-center gap-2">
              <span class="badge-category ${difficultyColor}">
                ${quiz.difficulty || 'Medium'}
              </span>
              ${quiz.isCustom ? `
                <button onclick="app.deleteCustomQuiz('${quiz.id}', event)" class="text-gray-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors" title="Delete Custom Quiz">
                  <i class="fas fa-trash-alt"></i>
                </button>
              ` : ''}
            </div>
          </div>

          <div>
            <h3 class="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">${quiz.title}</h3>
            <p class="text-xs text-gray-400 mt-1 line-clamp-2">${quiz.description || 'Test your knowledge now.'}</p>
          </div>
        </div>

        <div class="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-300">
          <div class="flex items-center gap-3">
            <span class="flex items-center gap-1"><i class="fas fa-list text-indigo-400"></i> ${qCount} Questions</span>
            <span class="flex items-center gap-1"><i class="fas fa-clock text-pink-400"></i> ${quiz.timePerQuestion || 20}s / q</span>
          </div>

          <button onclick="app.startQuiz('${quiz.id}')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5">
            Start <i class="fas fa-play text-2xs"></i>
          </button>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  filterCategory(category) {
    this.activeCategory = category;
    document.querySelectorAll('.cat-filter-btn').forEach(btn => {
      if (btn.dataset.cat === category) {
        btn.classList.remove('glass-card', 'text-gray-300');
        btn.classList.add('bg-indigo-600', 'text-white');
      } else {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('glass-card', 'text-gray-300');
      }
    });
    this.renderQuizzesGrid();
  }

  startRandomQuiz() {
    const customQuizzes = window.storageManager.getCustomQuizzes();
    const all = [...window.PRESET_QUIZZES, ...customQuizzes];
    if (all.length === 0) return;
    const randomQuiz = all[Math.floor(Math.random() * all.length)];
    this.startQuiz(randomQuiz.id);
  }

  deleteCustomQuiz(quizId, event) {
    if (event) event.stopPropagation();
    if (confirm('Are you sure you want to delete this custom quiz?')) {
      window.storageManager.deleteCustomQuiz(quizId);
      this.renderQuizzesGrid();
    }
  }

  // --- QUIZ GAME RUNNER ---
  startQuiz(quizId) {
    const customQuizzes = window.storageManager.getCustomQuizzes();
    const all = [...window.PRESET_QUIZZES, ...customQuizzes];
    const quiz = all.find(q => q.id === quizId);
    if (!quiz) return;

    this.activeQuizId = quizId;
    const modeSelect = document.getElementById('gameplayModeSelect');
    const selectedMode = modeSelect ? modeSelect.value : 'standard';

    document.getElementById('arenaQuizTitle').textContent = quiz.title;
    this.showView('arena');

    window.quizEngine.startQuiz(quiz, { mode: selectedMode });
  }

  handleQuestionChange(data) {
    const q = data.question;
    document.getElementById('arenaQuestionText').textContent = q.question;
    document.getElementById('arenaQProgressText').textContent = `Question ${data.index + 1} of ${data.total}`;
    document.getElementById('arenaDifficultyBadge').textContent = window.quizEngine.quiz.difficulty || 'Medium';

    // Progress bar percentage
    const pct = ((data.index + 1) / data.total) * 100;
    document.getElementById('arenaProgressBar').style.width = `${pct}%`;

    // Score & Streak
    document.getElementById('arenaScoreVal').textContent = data.score;
    const streakBadge = document.getElementById('arenaStreakBadge');
    const streakVal = document.getElementById('arenaStreakVal');
    if (data.streak >= 2) {
      streakBadge.classList.remove('hidden');
      streakVal.textContent = data.streak;
    } else {
      streakBadge.classList.add('hidden');
    }

    // Powerup button state
    const btnFifty = document.getElementById('btnPowerupFifty');
    if (btnFifty) {
      btnFifty.disabled = data.fiftyFiftyUsed;
      btnFifty.style.opacity = data.fiftyFiftyUsed ? '0.4' : '1';
    }

    // Reset hint & explanation containers
    const hintContainer = document.getElementById('arenaHintContainer');
    if (hintContainer) {
      hintContainer.classList.add('hidden');
      document.getElementById('arenaHintText').textContent = q.hint || 'Think carefully about the options!';
    }

    const expBox = document.getElementById('arenaExplanationBox');
    if (expBox) expBox.classList.add('hidden');

    const btnNext = document.getElementById('btnNextQuestion');
    if (btnNext) {
      btnNext.disabled = true;
      btnNext.classList.add('opacity-50', 'cursor-not-allowed');
    }

    // Options Rendering
    const optionsContainer = document.getElementById('arenaOptionsContainer');
    optionsContainer.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.dataset.optionIndex = idx;
      btn.onclick = () => this.selectOption(idx);

      btn.innerHTML = `
        <span class="option-letter">${letters[idx]}</span>
        <span class="option-text flex-grow">${optText}</span>
      `;
      optionsContainer.appendChild(btn);
    });
  }

  handleTimerTick(timeRemaining, duration) {
    const timerText = document.getElementById('timerTextVal');
    if (timerText) timerText.textContent = timeRemaining;

    const ring = document.getElementById('timerCirclePath');
    if (ring && duration > 0) {
      const fraction = timeRemaining / duration;
      const strokeDashoffset = 100 * (1 - fraction);
      ring.setAttribute('stroke-dashoffset', strokeDashoffset);

      if (timeRemaining <= 5) {
        ring.setAttribute('class', 'timer-ring-circle text-rose-500 low-time-pulse');
      } else {
        ring.setAttribute('class', 'timer-ring-circle text-indigo-500');
      }
    }
  }

  selectOption(optionIdx) {
    const result = window.quizEngine.submitAnswer(optionIdx);
    if (!result) return;

    const buttons = document.querySelectorAll('#arenaOptionsContainer .option-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === result.correctIndex) {
        btn.classList.add('correct');
      }
      if (idx === result.userSelectedIndex && !result.isCorrect) {
        btn.classList.add('wrong');
      }
    });

    // Update live score
    document.getElementById('arenaScoreVal').textContent = result.newScore;
    const streakBadge = document.getElementById('arenaStreakBadge');
    const streakVal = document.getElementById('arenaStreakVal');
    if (result.streak >= 2) {
      streakBadge.classList.remove('hidden');
      streakVal.textContent = result.streak;
    } else {
      streakBadge.classList.add('hidden');
    }

    // Show Explanation
    const expBox = document.getElementById('arenaExplanationBox');
    const expTitle = document.getElementById('arenaFeedbackTitle');
    const expText = document.getElementById('arenaExplanationText');

    if (expBox && expTitle && expText) {
      expBox.classList.remove('hidden');
      const currentQ = window.quizEngine.questions[window.quizEngine.currentIndex];
      
      if (result.isCorrect) {
        expTitle.innerHTML = `<i class="fas fa-check-circle text-emerald-400"></i> Correct! <span class="text-xs font-mono text-emerald-300 ml-auto">+${result.pointsEarned} pts</span>`;
      } else {
        expTitle.innerHTML = `<i class="fas fa-times-circle text-rose-400"></i> Incorrect`;
      }
      
      expText.textContent = currentQ.explanation || 'No detailed explanation provided.';
    }

    // Enable Next Question button
    const btnNext = document.getElementById('btnNextQuestion');
    if (btnNext) {
      btnNext.disabled = false;
      btnNext.classList.remove('opacity-50', 'cursor-not-allowed');

      if (result.isSurvivalOver) {
        btnNext.innerHTML = `<span>View Survival Results</span> <i class="fas fa-arrow-right"></i>`;
      } else if (window.quizEngine.currentIndex + 1 >= window.quizEngine.questions.length) {
        btnNext.innerHTML = `<span>Finish Quiz</span> <i class="fas fa-trophy"></i>`;
      } else {
        btnNext.innerHTML = `<span>Next Question</span> <i class="fas fa-arrow-right"></i>`;
      }
    }
  }

  useFiftyFifty() {
    const hiddenIndices = window.quizEngine.useFiftyFifty();
    if (!hiddenIndices) return;

    const buttons = document.querySelectorAll('#arenaOptionsContainer .option-btn');
    hiddenIndices.forEach(idx => {
      if (buttons[idx]) {
        buttons[idx].classList.add('dimmed');
      }
    });

    const btnFifty = document.getElementById('btnPowerupFifty');
    if (btnFifty) {
      btnFifty.disabled = true;
      btnFifty.style.opacity = '0.4';
    }
  }

  toggleHint() {
    const hintContainer = document.getElementById('arenaHintContainer');
    if (hintContainer) {
      hintContainer.classList.toggle('hidden');
      if (window.quizAudio) window.quizAudio.playClick();
    }
  }

  skipQuestion() {
    window.quizEngine.handleTimeout();
    this.nextQuestion();
  }

  nextQuestion() {
    if (window.quizAudio) window.quizAudio.playClick();
    window.quizEngine.nextQuestion();
  }

  quitQuiz() {
    if (confirm('Quit active quiz? Progress will be lost.')) {
      window.quizEngine.stopTimer();
      this.showView('home');
    }
  }

  // --- RESULTS DISPLAY ---
  handleQuizComplete(summary) {
    // Save to persistent storage
    window.storageManager.saveHistoryRecord(summary);

    document.getElementById('resultsRankBadge').textContent = summary.rankBadge;
    document.getElementById('resultsRankTitle').textContent = summary.rankTitle;
    document.getElementById('resultsQuizName').textContent = summary.quizTitle;
    document.getElementById('resultsPercentage').textContent = `${summary.accuracyPercentage}%`;
    document.getElementById('resultsScorePoints').textContent = `${summary.score} Points`;

    document.getElementById('resultsCorrectRatio').textContent = `${summary.correctCount} / ${summary.totalQuestions}`;
    document.getElementById('resultsMaxStreak').textContent = `${summary.maxStreak} 🔥`;
    document.getElementById('resultsTotalTime').textContent = `${summary.totalTimeTaken}s`;
    document.getElementById('resultsRankShort').textContent = summary.rankTitle;

    // Build Detailed Question Review Accordion
    const container = document.getElementById('resultsReviewContainer');
    if (container) {
      container.innerHTML = '';
      summary.responses.forEach((resp, idx) => {
        const item = document.createElement('div');
        item.className = `glass-card p-4 rounded-xl border ${resp.isCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'} space-y-2`;

        const userSelText = resp.userSelectedIndex >= 0 ? resp.options[resp.userSelectedIndex] : 'Timed Out / Skipped';
        const correctText = resp.options[resp.correctIndex];

        item.innerHTML = `
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-2">
              <span class="font-bold text-xs ${resp.isCorrect ? 'text-emerald-400' : 'text-rose-400'}">${idx + 1}.</span>
              <p class="text-sm font-semibold text-white">${resp.questionText}</p>
            </div>
            <span class="text-xs px-2 py-0.5 rounded ${resp.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'} font-bold">
              ${resp.isCorrect ? `+${resp.pointsEarned} pts` : '0 pts'}
            </span>
          </div>

          <div class="text-xs space-y-1 pt-1 border-t border-white/5 text-gray-300">
            <p><span class="text-gray-400">Your Answer:</span> <span class="${resp.isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 line-through'}">${userSelText}</span></p>
            ${!resp.isCorrect ? `<p><span class="text-gray-400">Correct Answer:</span> <span class="text-emerald-400 font-bold">${correctText}</span></p>` : ''}
            <p class="text-gray-400 italic pt-1">${resp.explanation}</p>
          </div>
        `;
        container.appendChild(item);
      });
    }

    this.showView('results');

    if (summary.accuracyPercentage >= 60) {
      this.triggerConfetti();
    }
  }

  replayActiveQuiz() {
    if (this.activeQuizId) {
      this.startQuiz(this.activeQuizId);
    } else {
      this.showView('home');
    }
  }

  // --- CREATOR HANDLER ---
  saveCustomQuiz() {
    const quizObj = window.quizCreator.collectFormData();
    if (!quizObj) return;

    window.storageManager.saveCustomQuiz(quizObj);
    alert('Custom Quiz saved successfully!');
    this.startQuiz(quizObj.id);
  }

  importQuizJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const quizObj = JSON.parse(e.target.result);
        if (!quizObj.title || !Array.isArray(quizObj.questions)) {
          alert('Invalid Quiz JSON format.');
          return;
        }
        quizObj.id = `custom_quiz_${Date.now()}`;
        quizObj.isCustom = true;
        window.storageManager.saveCustomQuiz(quizObj);
        alert(`Successfully imported quiz: "${quizObj.title}"`);
        this.showView('home');
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  }

  // --- HISTORY & LEADERBOARD ---
  renderHistoryTable() {
    const body = document.getElementById('historyTableBody');
    if (!body) return;
    body.innerHTML = '';

    const history = window.storageManager.getHistory();
    if (history.length === 0) {
      body.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-8 text-gray-500 text-sm">No history records found yet. Take a quiz to populate leaderboard!</td>
        </tr>
      `;
      return;
    }

    history.forEach(rec => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-white/5 transition-colors';
      const dateStr = new Date(rec.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

      tr.innerHTML = `
        <td class="py-3 px-4 text-xs text-gray-400">${dateStr}</td>
        <td class="py-3 px-4 font-bold text-white">${rec.quizTitle}</td>
        <td class="py-3 px-4 text-xs text-indigo-300">${rec.category}</td>
        <td class="py-3 px-4 font-mono font-bold text-emerald-400">${rec.score}</td>
        <td class="py-3 px-4 font-mono text-xs">${rec.accuracyPercentage}% (${rec.correctCount}/${rec.totalQuestions})</td>
        <td class="py-3 px-4 text-xs">${rec.rankBadge} ${rec.rankTitle}</td>
      `;
      body.appendChild(tr);
    });
  }

  clearHistory() {
    if (confirm('Clear all local quiz history & high scores?')) {
      window.storageManager.clearHistory();
      this.renderHistoryTable();
      this.updateStatsDisplay();
    }
  }

  // --- AUDIO TOGGLE ---
  toggleAudio() {
    const isMuted = window.quizAudio.toggleMute();
    const btn = document.getElementById('btnAudioToggle');
    if (btn) {
      btn.innerHTML = isMuted ? `<i class="fas fa-volume-mute text-rose-400"></i>` : `<i class="fas fa-volume-up text-indigo-400"></i>`;
    }
  }

  // --- KEYBOARD HOTKEYS ---
  setupKeyboardHotkeys() {
    window.addEventListener('keydown', (e) => {
      if (this.currentView !== 'arena') return;
      const key = e.key.toUpperCase();

      if (['1', 'A'].includes(key)) this.selectOption(0);
      else if (['2', 'B'].includes(key)) this.selectOption(1);
      else if (['3', 'C'].includes(key)) this.selectOption(2);
      else if (['4', 'D'].includes(key)) this.selectOption(3);
      else if (key === ' ' || key === 'ENTER') {
        const btnNext = document.getElementById('btnNextQuestion');
        if (btnNext && !btnNext.disabled) {
          this.nextQuestion();
        }
      } else if (key === 'ESCAPE') {
        this.quitQuiz();
      }
    });
  }

  setupEventListeners() {
    // Category filter button delegation is managed inline
  }

  // --- CANVAS CONFETTI EFFECT ---
  triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 5 + 3,
        speedX: (Math.random() - 0.5) * 4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10
      });
    }

    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (elapsed < 3500) {
        this.confettiAnimationId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});
