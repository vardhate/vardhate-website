import React, { useRef, useState, useEffect } from 'react';

// Space Drone Web Audio API Synthesizer
class SpaceDroneSynth {
  constructor() {
    this.ctx = null;
    this.oscillators = [];
    this.gainNode = null;
    this.isPlaying = false;
  }

  init() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.ctx.createGain();
    const baseFreqs = [55, 110, 165, 220];
    baseFreqs.forEach(freq => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(230, this.ctx.currentTime);
      osc.connect(filter);
      filter.connect(this.gainNode);
      osc.start();
      this.oscillators.push(osc);
    });
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);
  }

  startDrone() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.gainNode.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 2);
    this.isPlaying = true;
  }

  stopDrone() {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.2);
    }
    this.isPlaying = false;
  }

  destroy() {
    try {
      this.oscillators.forEach(osc => osc.stop());
      if (this.ctx) this.ctx.close();
    } catch (e) {}
  }
}

const AudioManager = ({ visible }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const synthRef = useRef(null);
  const [useSynth, setUseSynth] = useState(false);

  const localPath = '/assets/music.mp3';
  const gdriveAudio = 'https://drive.google.com/uc?export=download&id=1nItZZR61aNFj8fUYXEpN2C5gRSOVj8o-&confirm=t';
  const cdnPath = 'https://assets.codepen.io/2567909/ambient-loop-1.mp3';

  useEffect(() => {
    // Initialize audio element
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.28;
    audio.src = localPath;
    audioRef.current = audio;

    const handleAudioError = () => {
      if (audio.src === window.location.origin + localPath) {
        console.warn("Local music.mp3 missing. Trying Google Drive...");
        audio.src = gdriveAudio;
        audio.load();
      } else if (audio.src === gdriveAudio) {
        console.warn("Google Drive audio failed. Trying CDN stream...");
        audio.src = cdnPath;
        audio.load();
      } else {
        console.warn("CDN stream failed. Switching to WebAudio Synth Drone fallback...");
        setUseSynth(true);
      }
    };

    audio.addEventListener('error', handleAudioError);

    return () => {
      audio.removeEventListener('error', handleAudioError);
      audio.pause();
      if (synthRef.current) {
        synthRef.current.destroy();
      }
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);

    if (nextPlaying) {
      if (useSynth) {
        if (!synthRef.current) synthRef.current = new SpaceDroneSynth();
        synthRef.current.startDrone();
      } else {
        audio.play().catch(() => {
          audio.src = cdnPath;
          audio.play().catch(() => {
            setUseSynth(true);
            if (!synthRef.current) synthRef.current = new SpaceDroneSynth();
            synthRef.current.startDrone();
          });
        });
      }
    } else {
      if (useSynth && synthRef.current) {
        synthRef.current.stopDrone();
      } else {
        audio.pause();
      }
    }
  };

  if (!visible) return null;

  return (
    <div 
      className="sound-control-wrapper" 
      id="ambient-sound-toggle" 
      style={{ opacity: 1, pointerEvents: 'auto', zIndex: 99 }}
    >
      <div className={`visualizer-container ${isPlaying ? 'active' : ''}`} id="visualizer-bars">
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      <button 
        className="sound-toggle" 
        onClick={toggle} 
        aria-label="Toggle ambient soundtrack"
      >
        {isPlaying ? '🔊' : '🔇'}
      </button>
    </div>
  );
};

export default AudioManager;
