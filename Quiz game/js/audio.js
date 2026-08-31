/**
 * QuizAudio - Web Audio API Sound Synthesizer
 * Generates custom sound effects without external audio files.
 */
class QuizAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.volume = 0.3;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(mute) {
    this.muted = mute;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.1, startDelay = 0, rampEndFreq = null) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startDelay);
      
      if (rampEndFreq) {
        osc.frequency.exponentialRampToValueAtTime(rampEndFreq, this.ctx.currentTime + startDelay + duration);
      }

      gain.gain.setValueAtTime(this.volume, this.ctx.currentTime + startDelay);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startDelay + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + startDelay);
      osc.stop(this.ctx.currentTime + startDelay + duration);
    } catch (e) {
      console.warn("Audio play error:", e);
    }
  }

  playClick() {
    this.playTone(600, 'sine', 0.05);
  }

  playSelect() {
    this.playTone(800, 'triangle', 0.08);
  }

  playCorrect() {
    if (this.muted) return;
    // Pleasant major triad arpeggio (C5 - E5 - G5 - C6)
    this.playTone(523.25, 'sine', 0.12, 0);
    this.playTone(659.25, 'sine', 0.12, 0.08);
    this.playTone(783.99, 'sine', 0.14, 0.16);
    this.playTone(1046.50, 'sine', 0.3, 0.24);
  }

  playWrong() {
    if (this.muted) return;
    // Low dissonant tone
    this.playTone(180, 'sawtooth', 0.25, 0, 90);
    this.playTone(135, 'square', 0.25, 0.05, 80);
  }

  playTick() {
    this.playTone(900, 'sine', 0.03);
  }

  playLowTimeWarning() {
    this.playTone(1000, 'square', 0.06);
  }

  playPowerup() {
    if (this.muted) return;
    this.playTone(300, 'sine', 0.1, 0, 900);
    this.playTone(900, 'sine', 0.2, 0.1, 1200);
  }

  playFanfare() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.25, idx * 0.1);
    });
  }
}

window.quizAudio = new QuizAudio();
