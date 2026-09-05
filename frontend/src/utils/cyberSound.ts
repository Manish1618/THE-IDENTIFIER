// Cyberpunk Web Audio Sound FX Generator
// Synthesizes sci-fi UI sound effects with zero external audio assets

class CyberSoundEngine {
  private ctx: AudioContext | null = null
  public enabled: boolean = true

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  // Sci-fi click / pip
  playClick() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05)

    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.05)
  }

  // Laser scanner / sweep
  playScan() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(1800, ctx.currentTime + 0.25)

    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.25)
  }

  // Biometric lock / confirmation
  playLock() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()

    osc1.type = 'triangle'
    osc2.type = 'sine'

    osc1.frequency.setValueAtTime(523.25, now) // C5
    osc1.frequency.setValueAtTime(659.25, now + 0.08) // E5
    osc1.frequency.setValueAtTime(1046.50, now + 0.16) // C6

    osc2.frequency.setValueAtTime(261.63, now)
    osc2.frequency.setValueAtTime(329.63, now + 0.08)
    osc2.frequency.setValueAtTime(523.25, now + 0.16)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.35)
    osc2.stop(now + 0.35)
  }

  // Tamper alert / Glitch alarm
  playAlert() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.setValueAtTime(440, now + 0.1)
    osc.frequency.setValueAtTime(880, now + 0.2)
    osc.frequency.setValueAtTime(440, now + 0.3)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.4)
  }
}

export const cyberSound = new CyberSoundEngine()
