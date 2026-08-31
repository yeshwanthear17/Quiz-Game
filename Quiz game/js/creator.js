/**
 * QuizCreator - Interactive Custom Quiz Builder & JSON Importer/Exporter
 */

class QuizCreator {
  constructor() {
    this.questionCount = 0;
  }

  initUI() {
    const questionsContainer = document.getElementById('creatorQuestionsList');
    if (questionsContainer) {
      questionsContainer.innerHTML = '';
      this.questionCount = 0;
      // Add first 2 blank questions by default
      this.addQuestionBlock();
      this.addQuestionBlock();
    }
  }

  addQuestionBlock(data = null) {
    this.questionCount++;
    const qIndex = this.questionCount;
    const questionsContainer = document.getElementById('creatorQuestionsList');
    if (!questionsContainer) return;

    const card = document.createElement('div');
    card.className = 'glass-card p-5 mb-4 relative rounded-xl border border-white/10 shadow-lg';
    card.dataset.questionId = qIndex;

    const defaultQ = data || {
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      hint: '',
      explanation: ''
    };

    card.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h4 class="text-lg font-bold text-indigo-300 flex items-center gap-2">
          <span class="w-7 h-7 rounded-full bg-indigo-600/50 flex items-center justify-center text-xs text-white font-mono">${qIndex}</span>
          Question #${qIndex}
        </h4>
        ${qIndex > 1 ? `
          <button type="button" class="btn-remove-q text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors" title="Remove Question">
            <i class="fas fa-trash-alt"></i>
          </button>
        ` : ''}
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Question Prompt *</label>
          <input type="text" class="q-prompt-input form-input" placeholder="e.g. What is the syntax for arrow functions in JS?" value="${this.escapeHtml(defaultQ.question)}" required />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Answer Choices (Select the radio button for the CORRECT answer) *</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${[0, 1, 2, 3].map(optIdx => `
              <div class="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-white/5 focus-within:border-indigo-500/50 transition-all">
                <input type="radio" name="correct_opt_${qIndex}" value="${optIdx}" ${defaultQ.correct === optIdx ? 'checked' : ''} class="w-4 h-4 text-indigo-500 focus:ring-indigo-400 cursor-pointer" required />
                <input type="text" class="q-opt-input-${optIdx} form-input text-sm py-1.5 px-2 bg-transparent border-0 focus:ring-0" placeholder="Option ${optIdx + 1}" value="${this.escapeHtml(defaultQ.options[optIdx] || '')}" required />
              </div>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div>
            <label class="block text-xs font-medium text-gray-400 mb-1"><i class="fas fa-lightbulb text-amber-400 mr-1"></i> Optional Hint</label>
            <input type="text" class="q-hint-input form-input text-xs" placeholder="e.g. Look for the fat arrow syntax =>" value="${this.escapeHtml(defaultQ.hint || '')}" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-400 mb-1"><i class="fas fa-info-circle text-blue-400 mr-1"></i> Optional Explanation</label>
            <input type="text" class="q-explanation-input form-input text-xs" placeholder="e.g. Arrow functions were introduced in ES6..." value="${this.escapeHtml(defaultQ.explanation || '')}" />
          </div>
        </div>
      </div>
    `;

    // Add remove listener
    const removeBtn = card.querySelector('.btn-remove-q');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        card.remove();
        this.renumberQuestions();
      });
    }

    questionsContainer.appendChild(card);
  }

  renumberQuestions() {
    const cards = document.querySelectorAll('#creatorQuestionsList > div');
    this.questionCount = cards.length;
    cards.forEach((card, idx) => {
      const qNum = idx + 1;
      card.dataset.questionId = qNum;
      const titleSpan = card.querySelector('h4 span');
      if (titleSpan) titleSpan.textContent = qNum;
      const titleText = card.querySelector('h4');
      if (titleText) {
        titleText.childNodes[2].nodeValue = ` Question #${qNum}`;
      }
      const radios = card.querySelectorAll('input[type="radio"]');
      radios.forEach(radio => {
        radio.name = `correct_opt_${qNum}`;
      });
    });
  }

  collectFormData() {
    const titleInput = document.getElementById('quizTitleInput');
    const categorySelect = document.getElementById('quizCategorySelect');
    const descInput = document.getElementById('quizDescInput');
    const timeSelect = document.getElementById('quizTimeSelect');
    const difficultySelect = document.getElementById('quizDifficultySelect');

    const title = titleInput ? titleInput.value.trim() : '';
    const category = categorySelect ? categorySelect.value : 'General';
    const description = descInput ? descInput.value.trim() : '';
    const timePerQuestion = timeSelect ? parseInt(timeSelect.value, 10) : 20;
    const difficulty = difficultySelect ? difficultySelect.value : 'Medium';

    if (!title) {
      alert('Please enter a Quiz Title.');
      if (titleInput) titleInput.focus();
      return null;
    }

    const cards = document.querySelectorAll('#creatorQuestionsList > div');
    if (cards.length === 0) {
      alert('Please add at least 1 question.');
      return null;
    }

    const questions = [];
    let isValid = true;

    cards.forEach((card, idx) => {
      const promptInput = card.querySelector('.q-prompt-input');
      const hintInput = card.querySelector('.q-hint-input');
      const explanationInput = card.querySelector('.q-explanation-input');
      const checkedRadio = card.querySelector('input[type="radio"]:checked');

      const questionText = promptInput ? promptInput.value.trim() : '';
      if (!questionText) {
        alert(`Question #${idx + 1} prompt cannot be empty.`);
        promptInput.focus();
        isValid = false;
        return;
      }

      const options = [];
      for (let i = 0; i < 4; i++) {
        const optInput = card.querySelector(`.q-opt-input-${i}`);
        const optVal = optInput ? optInput.value.trim() : '';
        if (!optVal) {
          alert(`Option ${i + 1} in Question #${idx + 1} cannot be empty.`);
          if (optInput) optInput.focus();
          isValid = false;
          return;
        }
        options.push(optVal);
      }

      const correctIndex = checkedRadio ? parseInt(checkedRadio.value, 10) : 0;

      questions.push({
        id: `cq_${Date.now()}_${idx}`,
        question: questionText,
        options: options,
        correct: correctIndex,
        hint: hintInput ? hintInput.value.trim() : '',
        explanation: explanationInput ? explanationInput.value.trim() : ''
      });
    });

    if (!isValid) return null;

    return {
      id: `custom_quiz_${Date.now()}`,
      title: title,
      category: category,
      icon: 'fa-user-edit',
      color: 'from-fuchsia-500 to-purple-600',
      accentColor: '#c026d3',
      description: description || 'User-created custom quiz challenge.',
      timePerQuestion: timePerQuestion,
      difficulty: difficulty,
      isCustom: true,
      questions: questions
    };
  }

  exportQuizJSON(quizObj) {
    if (!quizObj) return;
    const jsonStr = JSON.stringify(quizObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quizObj.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_quiz.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

window.quizCreator = new QuizCreator();
