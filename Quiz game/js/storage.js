/**
 * StorageManager - Handles LocalStorage persistence for Custom Quizzes, History, High Scores & Stats
 */
const STORAGE_KEYS = {
  CUSTOM_QUIZZES: 'quiz_app_custom_quizzes_v1',
  HISTORY: 'quiz_app_history_v1',
  STATS: 'quiz_app_stats_v1',
  SETTINGS: 'quiz_app_settings_v1'
};

class StorageManager {
  // --- CUSTOM QUIZZES ---
  getCustomQuizzes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUIZZES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse custom quizzes from localStorage', e);
      return [];
    }
  }

  saveCustomQuiz(quiz) {
    const quizzes = this.getCustomQuizzes();
    const existingIndex = quizzes.findIndex(q => q.id === quiz.id);
    
    if (existingIndex >= 0) {
      quizzes[existingIndex] = quiz;
    } else {
      quizzes.unshift(quiz);
    }
    
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUIZZES, JSON.stringify(quizzes));
    return quiz;
  }

  deleteCustomQuiz(quizId) {
    let quizzes = this.getCustomQuizzes();
    quizzes = quizzes.filter(q => q.id !== quizId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUIZZES, JSON.stringify(quizzes));
  }

  getCustomQuizById(quizId) {
    const quizzes = this.getCustomQuizzes();
    return quizzes.find(q => q.id === quizId) || null;
  }

  // --- HISTORY & HIGH SCORES ---
  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveHistoryRecord(record) {
    const history = this.getHistory();
    history.unshift({
      id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      ...record
    });
    // Keep max 50 recent records
    if (history.length > 50) history.pop();
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

    this.updateGlobalStats(record);
    return history[0];
  }

  clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }

  // --- STATS ---
  getStats() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      return data ? JSON.parse(data) : {
        quizzesTaken: 0,
        totalScore: 0,
        highestScore: 0,
        totalQuestionsAnswered: 0,
        correctAnswersCount: 0,
        highestStreak: 0,
        bestCategory: 'N/A'
      };
    } catch (e) {
      return {
        quizzesTaken: 0,
        totalScore: 0,
        highestScore: 0,
        totalQuestionsAnswered: 0,
        correctAnswersCount: 0,
        highestStreak: 0,
        bestCategory: 'N/A'
      };
    }
  }

  updateGlobalStats(record) {
    const stats = this.getStats();
    stats.quizzesTaken += 1;
    stats.totalScore += record.score;
    if (record.score > stats.highestScore) {
      stats.highestScore = record.score;
    }
    stats.totalQuestionsAnswered += record.totalQuestions;
    stats.correctAnswersCount += record.correctCount;
    if (record.maxStreak > stats.highestStreak) {
      stats.highestStreak = record.maxStreak;
    }
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  }

  // --- SETTINGS ---
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : { soundEnabled: true, theme: 'dark-glass' };
    } catch (e) {
      return { soundEnabled: true, theme: 'dark-glass' };
    }
  }

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
}

window.storageManager = new StorageManager();
