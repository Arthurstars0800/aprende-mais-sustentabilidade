const LEVELS = [
    { level: 1, name: "Semente Curiosa", minXp: 0, icon: "🌱" },
    { level: 2, name: "Brotinho Verde", minXp: 500, icon: "🌿" },
    { level: 3, name: "Árvore Jovem", minXp: 1200, icon: "🌳" },
    { level: 4, name: "Floresta Viva", minXp: 2500, icon: "🌲" },
    { level: 5, name: "Guardião Gaia", minXp: 4500, icon: "🌍" },
    { level: 6, name: "Defensor das Águas", minXp: 7000, icon: "💧" },
    { level: 7, name: "Mestre da Reciclagem", minXp: 10000, icon: "♻️" },
    { level: 8, name: "Protetor da Fauna", minXp: 13500, icon: "🦊" },
    { level: 9, name: "Aliado Solar", minXp: 17500, icon: "☀️" },
    { level: 10, name: "Herói Sustentável", minXp: 22000, icon: "🦸" },
    { level: 15, name: "Lenda Ecológica", minXp: 35000, icon: "🏆" },
    { level: 20, name: "Capivara Suprema", minXp: 50000, icon: "👑" }
];

let userProfile = {
    xp: 0,
    level: 1,
    badges: [],
    completedQuizzes: [],
    totalQuizzes: 6,
    unlockedItems: ['avatar_seed', 'theme-default'],
    unlockedEasterEgg: false,
    equipped: {
        avatar: 'avatar_seed',
        theme: 'theme-default',
        effect: 'effect_none'
    },
    lastVisit: Date.now(),
    dailyStreak: 0,
    audioMuted: true
};

// --- Audio Engine (Procedural Web Audio API) ---
let audioCtx = null;
let masterGain = null;
let activeAudioNodes = [];
let currentAmbienceType = null;

function getAudioCtx() {
    if (!audioCtx || audioCtx.state === 'closed') {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.35;
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function stopAllAudioNodes() {
    activeAudioNodes.forEach(node => {
        try {
            if (node.stop) node.stop();
            if (node.disconnect) node.disconnect();
        } catch (e) { }
    });
    activeAudioNodes = [];
    if (window._ambienceTimers) {
        window._ambienceTimers.forEach(t => clearTimeout(t));
        window._ambienceTimers = [];
    }
}

// Creates filtered noise (wind, rain, etc.)
function createNoise(ctx, type = 'brown', duration = Infinity) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    } else if (type === 'pink') {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
            b6 = white * 0.115926;
        }
    } else { // brown
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
        }
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
}

// --- Soundscape Generators ---

function playForestAmbience() {
    const ctx = getAudioCtx();

    // Soft brown noise = gentle breeze through trees
    const wind = createNoise(ctx, 'brown');
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.value = 220;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.15;
    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);
    wind.start();
    activeAudioNodes.push(wind, windFilter, windGain);

    // Gentle wind modulation (soft breathing)
    const windLFO = ctx.createOscillator();
    const windLFOGain = ctx.createGain();
    windLFO.frequency.value = 0.08;
    windLFOGain.gain.value = 0.05;
    windLFO.connect(windLFOGain);
    windLFOGain.connect(windGain.gain);
    windLFO.start();
    activeAudioNodes.push(windLFO, windLFOGain);

    // Bird chirps - random sine tone bursts
    window._ambienceTimers = [];
    function scheduleBird() {
        if (currentAmbienceType !== 'forest') return; // Stop if theme changed

        if (!userProfile.audioMuted) {
            const osc = ctx.createOscillator();
            const birdGain = ctx.createGain();
            const freq = 1800 + Math.random() * 2500;
            osc.type = 'sine';
            osc.frequency.value = freq;

            // Quick chirp pattern
            const now = ctx.currentTime;
            const chirpDur = 0.05 + Math.random() * 0.08;
            const numChirps = 2 + Math.floor(Math.random() * 4);

            birdGain.gain.value = 0;
            for (let i = 0; i < numChirps; i++) {
                const t = now + i * (chirpDur + 0.03);
                birdGain.gain.setValueAtTime(0, t);
                birdGain.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.06, t + chirpDur * 0.3);
                osc.frequency.setValueAtTime(freq + Math.random() * 400, t);
                osc.frequency.linearRampToValueAtTime(freq - 200 + Math.random() * 600, t + chirpDur);
                birdGain.gain.linearRampToValueAtTime(0, t + chirpDur);
            }

            osc.connect(birdGain);
            birdGain.connect(masterGain);
            osc.start(now);
            osc.stop(now + numChirps * (chirpDur + 0.03) + 0.1);
        }

        const tid = setTimeout(scheduleBird, 2000 + Math.random() * 5000);
        window._ambienceTimers.push(tid);
    }
    scheduleBird();
    // Start a second bird with offset
    const tid2 = setTimeout(scheduleBird, 1000 + Math.random() * 3000);
    window._ambienceTimers.push(tid2);
}

function playWindAmbience() {
    const ctx = getAudioCtx();

    // Soft layered wind
    const wind1 = createNoise(ctx, 'brown');
    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.value = 200;
    filter1.Q.value = 0.3;
    const gain1 = ctx.createGain();
    gain1.gain.value = 0.18;
    wind1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(masterGain);
    wind1.start();

    const wind2 = createNoise(ctx, 'pink');
    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.value = 300;
    const gain2 = ctx.createGain();
    gain2.gain.value = 0.08;
    wind2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(masterGain);
    wind2.start();

    // Slow modulation for gentle gusts
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.06;
    lfoGain.gain.value = 0.08;
    lfo.connect(lfoGain);
    lfoGain.connect(gain1.gain);
    lfo.start();

    activeAudioNodes.push(wind1, filter1, gain1, wind2, filter2, gain2, lfo, lfoGain);
}

function playRainAmbience(isStorm = false) {
    const ctx = getAudioCtx();

    // Base rain = filtered white noise
    const rain = createNoise(ctx, 'white');
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.value = isStorm ? 2500 : 3000;
    rainFilter.Q.value = 0.3;
    const rainGain = ctx.createGain();
    rainGain.gain.value = isStorm ? 0.5 : 0.35;
    rain.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(masterGain);
    rain.start();

    // Low rumble (like distant thunder for storm, or distant water for rain)
    const rumble = createNoise(ctx, 'brown');
    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.value = isStorm ? 150 : 80;
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = isStorm ? 0.4 : 0.15;
    rumble.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(masterGain);
    rumble.start();

    activeAudioNodes.push(rain, rainFilter, rainGain, rumble, rumbleFilter, rumbleGain);

    // Storm: periodic thunder rumbles
    if (isStorm) {
        window._ambienceTimers = window._ambienceTimers || [];
        function thunder() {
            if (currentAmbienceType !== 'storm') return; // Stop recursion if theme changed

            if (!userProfile.audioMuted) {
                const thunderOsc = createNoise(ctx, 'brown');
                const tFilter = ctx.createBiquadFilter();
                tFilter.type = 'lowpass';
                tFilter.frequency.value = 100;
                const tGain = ctx.createGain();
                const now = ctx.currentTime;
                tGain.gain.setValueAtTime(0, now);
                tGain.gain.linearRampToValueAtTime(0.6 + Math.random() * 0.3, now + 0.1);
                tGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5 + Math.random());
                thunderOsc.connect(tFilter);
                tFilter.connect(tGain);
                tGain.connect(masterGain);
                thunderOsc.start(now);
                thunderOsc.stop(now + 2.5);
            }

            const tid = setTimeout(thunder, 6000 + Math.random() * 12000);
            window._ambienceTimers.push(tid);
        }
        const tid = setTimeout(thunder, 3000 + Math.random() * 5000);
        window._ambienceTimers.push(tid);
    }
}

function playCricketAmbience() {
    const ctx = getAudioCtx();

    // Rich nighttime atmosphere - layered
    const nightBrown = createNoise(ctx, 'brown');
    const nightBrownFilter = ctx.createBiquadFilter();
    nightBrownFilter.type = 'lowpass';
    nightBrownFilter.frequency.value = 200;
    const nightBrownGain = ctx.createGain();
    nightBrownGain.gain.value = 0.25;
    nightBrown.connect(nightBrownFilter);
    nightBrownFilter.connect(nightBrownGain);
    nightBrownGain.connect(masterGain);
    nightBrown.start();

    // Soft high-frequency bed (like distant insects hum)
    const nightPink = createNoise(ctx, 'pink');
    const nightPinkFilter = ctx.createBiquadFilter();
    nightPinkFilter.type = 'bandpass';
    nightPinkFilter.frequency.value = 3000;
    nightPinkFilter.Q.value = 0.3;
    const nightPinkGain = ctx.createGain();
    nightPinkGain.gain.value = 0.015;
    nightPink.connect(nightPinkFilter);
    nightPinkFilter.connect(nightPinkGain);
    nightPinkGain.connect(masterGain);
    nightPink.start();

    // Gentle wind
    const wind = createNoise(ctx, 'brown');
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 200;
    windFilter.Q.value = 0.3;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.06;
    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);
    wind.start();
    // Wind breathing
    const windLFO = ctx.createOscillator();
    const windLFOGain = ctx.createGain();
    windLFO.frequency.value = 0.07;
    windLFOGain.gain.value = 0.03;
    windLFO.connect(windLFOGain);
    windLFOGain.connect(windGain.gain);
    windLFO.start();

    activeAudioNodes.push(nightBrown, nightBrownFilter, nightBrownGain,
        nightPink, nightPinkFilter, nightPinkGain,
        wind, windFilter, windGain, windLFO, windLFOGain);

    // Natural cricket chirps - each "voice" has its own character
    window._ambienceTimers = window._ambienceTimers || [];

    function makeChirp(baseFreq, volume) {
        if (userProfile.audioMuted || currentAmbienceType !== 'crickets') return;

        const numPulses = 3 + Math.floor(Math.random() * 6);
        const pulseGap = 0.025 + Math.random() * 0.02;
        const pulseDur = 0.015 + Math.random() * 0.015;
        const totalDur = numPulses * (pulseDur + pulseGap) + 0.15;

        // Main tone + slight harmonic for richness
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = baseFreq;

        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = baseFreq * 2.01; // slight detune on harmonic

        // Bandpass to soften
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = baseFreq;
        filter.Q.value = 2;

        const chirpGain = ctx.createGain();
        chirpGain.gain.value = 0;

        const harmGain = ctx.createGain();
        harmGain.gain.value = 0;

        const now = ctx.currentTime;
        const vol = volume * (0.7 + Math.random() * 0.3);

        // Natural trill: each pulse fades in and out smoothly
        for (let i = 0; i < numPulses; i++) {
            const t = now + i * (pulseDur + pulseGap);
            const peakVol = vol * (0.6 + Math.random() * 0.4);
            // Gentle fade in
            chirpGain.gain.setValueAtTime(0, t);
            chirpGain.gain.linearRampToValueAtTime(peakVol, t + pulseDur * 0.4);
            // Gentle fade out
            chirpGain.gain.linearRampToValueAtTime(0, t + pulseDur);
            // Harmonic follows but quieter
            harmGain.gain.setValueAtTime(0, t);
            harmGain.gain.linearRampToValueAtTime(peakVol * 0.15, t + pulseDur * 0.4);
            harmGain.gain.linearRampToValueAtTime(0, t + pulseDur);

            // Subtle frequency wobble for organic feel
            osc1.frequency.setValueAtTime(baseFreq + Math.random() * 80 - 40, t);
        }

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(chirpGain);
        chirpGain.connect(masterGain);

        // Parallel harmonic path
        const harmFilter = ctx.createBiquadFilter();
        harmFilter.type = 'bandpass';
        harmFilter.frequency.value = baseFreq * 2;
        harmFilter.Q.value = 3;
        osc2.connect(harmFilter);
        harmFilter.connect(harmGain);
        harmGain.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + totalDur);
        osc2.stop(now + totalDur);
    }

    // Cricket voice 1 - higher pitch, frequent
    function voice1() {
        if (userProfile.audioMuted || currentAmbienceType !== 'crickets') return;
        makeChirp(4200 + Math.random() * 600, 0.04);
        const tid = setTimeout(voice1, 1500 + Math.random() * 3000);
        window._ambienceTimers.push(tid);
    }

    // Cricket voice 2 - lower pitch, less frequent
    function voice2() {
        if (userProfile.audioMuted || currentAmbienceType !== 'crickets') return;
        makeChirp(3200 + Math.random() * 400, 0.035);
        const tid = setTimeout(voice2, 2500 + Math.random() * 4000);
        window._ambienceTimers.push(tid);
    }

    // Cricket voice 3 - medium, sporadic
    function voice3() {
        if (userProfile.audioMuted || currentAmbienceType !== 'crickets') return;
        makeChirp(3800 + Math.random() * 500, 0.03);
        const tid = setTimeout(voice3, 3000 + Math.random() * 6000);
        window._ambienceTimers.push(tid);
    }

    // Stagger the starts for natural feel
    voice1();
    const t1 = setTimeout(voice2, 800 + Math.random() * 1200);
    const t2 = setTimeout(voice3, 1500 + Math.random() * 2000);
    window._ambienceTimers.push(t1, t2);
}

// --- NES Chiptune Note Frequencies ---
const NES_NOTES = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
    C6: 1046.50, R: 0  // R = rest
};

// Melody phrases inspired by classic NES platformer tunes
const CHIPTUNE_MELODIES = [
    // Upbeat adventure phrase 1
    [
        { n: 'E5', d: 0.12 }, { n: 'E5', d: 0.12 }, { n: 'R', d: 0.12 }, { n: 'E5', d: 0.12 },
        { n: 'R', d: 0.12 }, { n: 'C5', d: 0.12 }, { n: 'E5', d: 0.18 },
        { n: 'G5', d: 0.3 }, { n: 'R', d: 0.15 }, { n: 'G4', d: 0.3 }
    ],
    // Bouncy phrase 2
    [
        { n: 'C5', d: 0.15 }, { n: 'G4', d: 0.15 }, { n: 'R', d: 0.15 }, { n: 'E4', d: 0.15 },
        { n: 'A4', d: 0.15 }, { n: 'B4', d: 0.12 }, { n: 'A4', d: 0.18 },
        { n: 'G4', d: 0.12 }, { n: 'E5', d: 0.12 }, { n: 'G5', d: 0.15 }, { n: 'A5', d: 0.18 },
        { n: 'F5', d: 0.12 }, { n: 'G5', d: 0.15 }
    ],
    // Underground/mystery phrase
    [
        { n: 'C4', d: 0.1 }, { n: 'C5', d: 0.1 }, { n: 'A4', d: 0.1 }, { n: 'A3', d: 0.1 },
        { n: 'B3', d: 0.1 }, { n: 'B4', d: 0.1 }, { n: 'R', d: 0.2 },
        { n: 'C4', d: 0.1 }, { n: 'C5', d: 0.1 }, { n: 'A4', d: 0.1 }, { n: 'A3', d: 0.1 },
        { n: 'B3', d: 0.1 }, { n: 'B4', d: 0.1 }
    ],
    // Coin/star power phrase
    [
        { n: 'B4', d: 0.08 }, { n: 'E5', d: 0.08 }, { n: 'G5', d: 0.08 }, { n: 'B5', d: 0.08 },
        { n: 'A5', d: 0.08 }, { n: 'E5', d: 0.08 }, { n: 'G5', d: 0.08 }, { n: 'A5', d: 0.15 },
        { n: 'R', d: 0.1 },
        { n: 'A4', d: 0.08 }, { n: 'D5', d: 0.08 }, { n: 'F5', d: 0.08 }, { n: 'A5', d: 0.08 },
        { n: 'G5', d: 0.08 }, { n: 'D5', d: 0.08 }, { n: 'F5', d: 0.08 }, { n: 'G5', d: 0.15 }
    ],
    // Victory fanfare
    [
        { n: 'G4', d: 0.1 }, { n: 'C5', d: 0.1 }, { n: 'E5', d: 0.1 }, { n: 'G5', d: 0.15 },
        { n: 'E5', d: 0.1 }, { n: 'G5', d: 0.3 },
        { n: 'R', d: 0.15 },
        { n: 'A4', d: 0.1 }, { n: 'D5', d: 0.1 }, { n: 'F5', d: 0.1 }, { n: 'A5', d: 0.15 },
        { n: 'F5', d: 0.1 }, { n: 'A5', d: 0.3 }
    ],
    // Fast running phrase
    [
        { n: 'E5', d: 0.08 }, { n: 'D5', d: 0.08 }, { n: 'C5', d: 0.08 }, { n: 'D5', d: 0.08 },
        { n: 'E5', d: 0.08 }, { n: 'E5', d: 0.08 }, { n: 'E5', d: 0.15 }, { n: 'R', d: 0.08 },
        { n: 'D5', d: 0.08 }, { n: 'D5', d: 0.08 }, { n: 'D5', d: 0.15 }, { n: 'R', d: 0.08 },
        { n: 'E5', d: 0.08 }, { n: 'G5', d: 0.08 }, { n: 'G5', d: 0.15 }
    ]
];

// Bass patterns
const CHIPTUNE_BASS = [
    [{ n: 'C3', d: 0.15 }, { n: 'G3', d: 0.15 }, { n: 'C3', d: 0.15 }, { n: 'G3', d: 0.15 }, { n: 'E3', d: 0.15 }, { n: 'G3', d: 0.15 }, { n: 'E3', d: 0.15 }, { n: 'G3', d: 0.15 }],
    [{ n: 'C3', d: 0.12 }, { n: 'R', d: 0.06 }, { n: 'C3', d: 0.12 }, { n: 'R', d: 0.06 }, { n: 'G3', d: 0.12 }, { n: 'R', d: 0.06 }, { n: 'G3', d: 0.12 }, { n: 'R', d: 0.06 }, { n: 'A3', d: 0.12 }, { n: 'R', d: 0.06 }, { n: 'A3', d: 0.12 }],
    [{ n: 'F3', d: 0.15 }, { n: 'R', d: 0.08 }, { n: 'F3', d: 0.1 }, { n: 'A3', d: 0.15 }, { n: 'R', d: 0.08 }, { n: 'C3', d: 0.15 }, { n: 'R', d: 0.08 }, { n: 'C3', d: 0.1 }, { n: 'E3', d: 0.15 }]
];

function playChiptuneMelody(ctx, targetNode, melody, volume, waveType = 'square') {
    const now = ctx.currentTime;
    let time = now;

    melody.forEach(note => {
        const freq = NES_NOTES[note.n];
        if (freq > 0) {
            const osc = ctx.createOscillator();
            osc.type = waveType;
            osc.frequency.value = freq;

            const noteGain = ctx.createGain();
            // NES-style sharp attack, slight decay
            noteGain.gain.setValueAtTime(0, time);
            noteGain.gain.linearRampToValueAtTime(volume, time + 0.005);
            noteGain.gain.setValueAtTime(volume * 0.8, time + 0.01);
            noteGain.gain.setValueAtTime(volume * 0.7, time + note.d * 0.7);
            noteGain.gain.linearRampToValueAtTime(0, time + note.d);

            osc.connect(noteGain);
            noteGain.connect(targetNode);
            osc.start(time);
            osc.stop(time + note.d + 0.01);
        }
        time += note.d;
    });

    return time - now; // total duration
}

function playDigitalAmbience(isMatrix = false) {
    const ctx = getAudioCtx();

    // Low digital drone (quieter to let the melody shine)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = isMatrix ? 55 : 80;
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = isMatrix ? 200 : 300;
    const droneGain = ctx.createGain();
    droneGain.gain.value = isMatrix ? 0.06 : 0.05;
    osc1.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(masterGain);
    osc1.start();

    // Soft shimmer
    const shimmer = createNoise(ctx, 'white');
    const shimmerFilter = ctx.createBiquadFilter();
    shimmerFilter.type = 'bandpass';
    shimmerFilter.frequency.value = isMatrix ? 6000 : 4000;
    shimmerFilter.Q.value = 5;
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = isMatrix ? 0.02 : 0.01;
    shimmer.connect(shimmerFilter);
    shimmerFilter.connect(shimmerGain);
    shimmerGain.connect(masterGain);
    shimmer.start();

    // Pulsing modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = isMatrix ? 0.5 : 0.3;
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain);
    lfoGain.connect(droneGain.gain);
    lfo.start();

    activeAudioNodes.push(osc1, droneFilter, droneGain, shimmer, shimmerFilter, shimmerGain, lfo, lfoGain);

    // === 8-BIT CHIPTUNE MUSIC LOOP ===
    window._ambienceTimers = window._ambienceTimers || [];
    const ambiType = isMatrix ? 'matrix' : 'digital';

    function playMelodyLoop() {
        if (userProfile.audioMuted || currentAmbienceType !== ambiType) return;

        // Pick random melody and bass
        const melody = CHIPTUNE_MELODIES[Math.floor(Math.random() * CHIPTUNE_MELODIES.length)];
        const bass = CHIPTUNE_BASS[Math.floor(Math.random() * CHIPTUNE_BASS.length)];

        // Lead melody (square wave — classic NES pulse 1)
        const melodyVol = isMatrix ? 0.045 : 0.035;
        const melodyDur = playChiptuneMelody(ctx, masterGain, melody, melodyVol, 'square');

        // Bass line (triangle-ish — NES triangle channel)
        const bassVol = isMatrix ? 0.03 : 0.025;
        playChiptuneMelody(ctx, masterGain, bass, bassVol, 'triangle');

        // Arpeggio harmony on some loops (50% chance)
        if (Math.random() > 0.5) {
            // Simple arpeggio based on first note of melody
            const rootFreq = NES_NOTES[melody[0].n] || 523.25;
            const arpNotes = [
                { n: melody[0].n, d: 0.08 },
                { n: Object.keys(NES_NOTES).find(k => Math.abs(NES_NOTES[k] - rootFreq * 1.25) < 20) || melody[0].n, d: 0.08 },
                { n: Object.keys(NES_NOTES).find(k => Math.abs(NES_NOTES[k] - rootFreq * 1.5) < 20) || melody[0].n, d: 0.08 }
            ];
            // Repeat arpeggio pattern
            const arpPattern = [];
            for (let i = 0; i < 6; i++) {
                arpPattern.push(arpNotes[i % 3]);
            }
            playChiptuneMelody(ctx, masterGain, arpPattern, melodyVol * 0.4, 'square');
        }

        // Gap between phrases + schedule next
        const gap = 0.8 + Math.random() * 2.0;
        const tid = setTimeout(playMelodyLoop, (melodyDur + gap) * 1000);
        window._ambienceTimers.push(tid);
    }

    // Start the music after a short delay
    const startTid = setTimeout(playMelodyLoop, 500);
    window._ambienceTimers.push(startTid);
}

function playSciFiAmbience() {
    const ctx = getAudioCtx();

    // === RADIO BUS — everything goes through this for the "Alastor" effect ===

    // 1. Bandpass filter = the classic "tinny radio" sound (300Hz - 3500Hz)
    const radioLowCut = ctx.createBiquadFilter();
    radioLowCut.type = 'highpass';
    radioLowCut.frequency.value = 300;
    radioLowCut.Q.value = 0.7;

    const radioHighCut = ctx.createBiquadFilter();
    radioHighCut.type = 'lowpass';
    radioHighCut.frequency.value = 3500;
    radioHighCut.Q.value = 0.7;

    // 2. Mid-range resonance peak (makes it sound "boxy" like a small speaker)
    const radioResonance = ctx.createBiquadFilter();
    radioResonance.type = 'peaking';
    radioResonance.frequency.value = 1200;
    radioResonance.Q.value = 1.5;
    radioResonance.gain.value = 6;

    // 3. Distortion/saturation (warm tube-like overdrive)
    const distortion = ctx.createWaveShaper();
    function makeDistortionCurve(amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
        }
        return curve;
    }
    distortion.curve = makeDistortionCurve(8);
    distortion.oversample = '2x';

    // Radio bus gain
    const radioBusGain = ctx.createGain();
    radioBusGain.gain.value = 0.7;

    // Chain: source → lowcut → highcut → resonance → distortion → busGain → master
    radioLowCut.connect(radioHighCut);
    radioHighCut.connect(radioResonance);
    radioResonance.connect(distortion);
    distortion.connect(radioBusGain);
    radioBusGain.connect(masterGain);

    // === SOUND SOURCES (all routed into the radio bus) ===

    // Deep humming drone (like old radio electronics)
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 110;
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.12;
    osc.connect(oscGain);
    oscGain.connect(radioLowCut);
    osc.start();

    // 60Hz mains hum (classic radio interference)
    const hum = ctx.createOscillator();
    hum.type = 'sine';
    hum.frequency.value = 60;
    const humGain = ctx.createGain();
    humGain.gain.value = 0.08;
    hum.connect(humGain);
    humGain.connect(radioLowCut);
    hum.start();

    // Second harmonic of hum
    const hum2 = ctx.createOscillator();
    hum2.type = 'sine';
    hum2.frequency.value = 120;
    const humGain2 = ctx.createGain();
    humGain2.gain.value = 0.04;
    hum2.connect(humGain2);
    humGain2.connect(radioLowCut);
    hum2.start();

    // Eerie ambient tone (mysterious radio broadcast feel)
    const eerieOsc = ctx.createOscillator();
    eerieOsc.type = 'sine';
    eerieOsc.frequency.value = 440;
    const eerieGain = ctx.createGain();
    eerieGain.gain.value = 0.03;
    eerieOsc.connect(eerieGain);
    eerieGain.connect(radioLowCut);
    eerieOsc.start();
    // Slow vibrato on the eerie tone
    const eerieLFO = ctx.createOscillator();
    const eerieLFOGain = ctx.createGain();
    eerieLFO.frequency.value = 0.3;
    eerieLFOGain.gain.value = 15;
    eerieLFO.connect(eerieLFOGain);
    eerieLFOGain.connect(eerieOsc.frequency);
    eerieLFO.start();

    // === RADIO STATIC & CRACKLE (directly to master, not through distortion) ===

    // Continuous light static
    const staticNoise = createNoise(ctx, 'white');
    const staticFilter = ctx.createBiquadFilter();
    staticFilter.type = 'bandpass';
    staticFilter.frequency.value = 2000;
    staticFilter.Q.value = 0.5;
    const staticGain = ctx.createGain();
    staticGain.gain.value = 0.04;
    staticNoise.connect(staticFilter);
    staticFilter.connect(staticGain);
    staticGain.connect(masterGain);
    staticNoise.start();

    // Static volume flutter (radio signal wavering)
    const staticLFO = ctx.createOscillator();
    const staticLFOGain = ctx.createGain();
    staticLFO.frequency.value = 0.4;
    staticLFOGain.gain.value = 0.02;
    staticLFO.connect(staticLFOGain);
    staticLFOGain.connect(staticGain.gain);
    staticLFO.start();

    activeAudioNodes.push(
        radioLowCut, radioHighCut, radioResonance, distortion, radioBusGain,
        osc, oscGain, hum, humGain, hum2, humGain2,
        eerieOsc, eerieGain, eerieLFO, eerieLFOGain,
        staticNoise, staticFilter, staticGain, staticLFO, staticLFOGain
    );

    // === RANDOM CRACKLE POPS & RADIO TUNING ===
    window._ambienceTimers = window._ambienceTimers || [];

    // Random crackle/pops (like old vinyl or radio interference)
    function crackle() {
        if (currentAmbienceType !== 'scifi') return; // Stop if theme changed

        if (!userProfile.audioMuted) {
            const numPops = 1 + Math.floor(Math.random() * 4);
            const now = ctx.currentTime;

            for (let i = 0; i < numPops; i++) {
                const popNoise = createNoise(ctx, 'white');
                const popFilter = ctx.createBiquadFilter();
                popFilter.type = 'highpass';
                popFilter.frequency.value = 1000 + Math.random() * 3000;
                const popGain = ctx.createGain();
                const t = now + i * (0.02 + Math.random() * 0.05);
                const popVol = 0.05 + Math.random() * 0.08;
                popGain.gain.setValueAtTime(0, t);
                popGain.gain.linearRampToValueAtTime(popVol, t + 0.003);
                popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02 + Math.random() * 0.03);
                popNoise.connect(popFilter);
                popFilter.connect(popGain);
                popGain.connect(masterGain);
                popNoise.start(t);
                popNoise.stop(t + 0.08);
            }
        }

        const tid = setTimeout(crackle, 500 + Math.random() * 2500);
        window._ambienceTimers.push(tid);
    }

    // 8-bit chiptune melody through the radio filter (Mario on vintage radio!)
    function radioMelody() {
        if (currentAmbienceType !== 'scifi') return; // Stop if theme changed

        let nextTime = 2000; // Default gap if muted

        if (!userProfile.audioMuted) {
            const melody = CHIPTUNE_MELODIES[Math.floor(Math.random() * CHIPTUNE_MELODIES.length)];
            const bass = CHIPTUNE_BASS[Math.floor(Math.random() * CHIPTUNE_BASS.length)];

            // Lead melody goes through the radio bus for that Alastor crunch
            const melodyDur = playChiptuneMelody(ctx, radioLowCut, melody, 0.06, 'square');
            playChiptuneMelody(ctx, radioLowCut, bass, 0.04, 'triangle');

            nextTime = (melodyDur + 1.5 + Math.random() * 3.0) * 1000;
        }

        const tid = setTimeout(radioMelody, nextTime);
        window._ambienceTimers.push(tid);
    }

    crackle();
    const t1 = setTimeout(radioMelody, 1000 + Math.random() * 2000);
    window._ambienceTimers.push(t1);
}

function getAmbienceType() {
    const effect = userProfile.equipped.effect;
    const theme = userProfile.equipped.theme;

    if (effect && effect !== 'effect_none') {
        if (effect === 'effect_leaves' || effect === 'effect_gold_leaves') return 'wind';
        if (effect === 'effect_rain') return 'rain';
        if (effect === 'effect_storm') return 'storm';
        if (effect === 'effect_vagalume') return 'crickets';
        if (effect === 'effect_digital_rain') return 'digital';
        if (effect === 'effect_matrix_rain') return 'matrix';
    }

    if (theme === 'theme-future') return 'scifi';
    return 'forest'; // default
}

function updateAmbience() {
    if (userProfile.audioMuted) {
        stopAllAudioNodes();
        currentAmbienceType = null;
        return;
    }

    const targetType = getAmbienceType();

    // Don't restart if already playing the right ambience
    if (targetType === currentAmbienceType) return;

    stopAllAudioNodes();
    currentAmbienceType = targetType;
    window._ambienceTimers = [];

    try {
        switch (targetType) {
            case 'forest': playForestAmbience(); break;
            case 'wind': playWindAmbience(); break;
            case 'rain': playRainAmbience(false); break;
            case 'storm': playRainAmbience(true); break;
            case 'crickets': playCricketAmbience(); break;
            case 'digital': playDigitalAmbience(false); break;
            case 'matrix': playDigitalAmbience(true); break;
            case 'scifi': playSciFiAmbience(); break;
        }
        console.log(`🎵 Ambience: ${targetType}`);
    } catch (err) {
        console.warn("Erro ao iniciar áudio:", err);
    }
}

function setupAudioToggle() {
    console.log("Tentando configurar o botão de áudio...");
    if (!document.getElementById('audioToggle')) {
        const nav = document.querySelector('.navbar .container');
        if (nav) {
            const btn = document.createElement('button');
            btn.id = 'audioToggle';
            btn.className = 'dark-mode-toggle';
            btn.style.marginLeft = '12px';
            btn.style.cursor = 'pointer';
            btn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            btn.title = "Rádio Ecológica";

            const mobileToggle = nav.querySelector('.mobile-menu-toggle');
            if (mobileToggle) {
                nav.insertBefore(btn, mobileToggle);
            } else {
                nav.appendChild(btn);
            }

            console.log("Botão de áudio injetado na Navbar!");
            updateAudioUI();
        } else {
            console.warn("Navbar container não encontrado.");
        }
    }
}

function toggleMute() {
    userProfile.audioMuted = !userProfile.audioMuted;
    saveProgress();
    updateAudioUI();
    if (!userProfile.audioMuted) {
        // Resume AudioContext in user gesture context (required by browsers)
        try { getAudioCtx().resume(); } catch (e) { }
        updateAmbience();
    } else {
        stopAllAudioNodes();
        currentAmbienceType = null;
    }
    showToast(userProfile.audioMuted ? "Rádio Silenciada 🔇" : "Rádio Ligada 📻");
}

function updateAudioUI() {
    const btn = document.getElementById('audioToggle');
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (userProfile.audioMuted) {
        icon.className = 'fas fa-volume-mute';
        btn.style.color = '#9ca3af';
    } else {
        icon.className = 'fas fa-volume-up';
        btn.style.color = 'var(--primary)';
    }
}

// --- Global State ---

// --- Core Logic ---

function loadProgress() {
    const saved = localStorage.getItem('eco_progress');
    if (saved) {
        const savedData = JSON.parse(saved);
        userProfile = { ...userProfile, ...savedData };
    }
    if (!userProfile.completedQuizzes) userProfile.completedQuizzes = [];
    checkDailyVisit();
    updateHud();
    applyTheme();
    // Delay curto para garantir que a navbar carregou
    setTimeout(setupAudioToggle, 500);
}

function saveProgress() {
    localStorage.setItem('eco_progress', JSON.stringify(userProfile));
    updateHud();
}

function addXp(amount, reason = "") {
    userProfile.xp += amount;
    checkLevelUp();
    saveProgress();
    showToast(`+${amount} EcoPoints! 🌿 ${reason}`);
}

function checkLevelUp() {
    let newLevelObj = LEVELS[0];
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (userProfile.xp >= LEVELS[i].minXp) {
            newLevelObj = LEVELS[i];
            break;
        }
    }

    if (newLevelObj.level > userProfile.level) {
        userProfile.level = newLevelObj.level;
        showToast(`🎉 SUBIU DE NÍVEL! Agora você é: ${newLevelObj.name} ${newLevelObj.icon}`, 6000);
    }
}

function checkDailyVisit() {
    const now = new Date();
    const last = new Date(userProfile.lastVisit);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate()).getTime();
    const diffDays = (today - lastDay) / (1000 * 60 * 60 * 24);

    if (today > lastDay) {
        if (diffDays === 1) {
            userProfile.dailyStreak = (userProfile.dailyStreak || 0) + 1;
        } else {
            userProfile.dailyStreak = 1;
        }

        const streakBonus = Math.min(userProfile.dailyStreak * 20, 200);
        const totalVisitXp = 100 + streakBonus;

        addXp(totalVisitXp, `(Visita Diária - Ofensiva de ${userProfile.dailyStreak} dias! 🔥)`);
        userProfile.lastVisit = now.getTime();
        saveProgress();
    }
}

// --- UI Components ---

function showToast(message, duration = 3000) {
    const existing = document.querySelector('.eco-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'eco-toast';
    toast.innerHTML = `
        <div class="eco-toast-icon">🌿</div>
        <div class="eco-toast-content">
            <span class="eco-toast-msg">${message}</span>
        </div>
    `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function updateHud() {
    const hud = document.getElementById('ecoHud');
    if (!hud) return;

    const fill = document.getElementById('ecoBarFill');
    const text = document.getElementById('ecoXpText');
    const icon = document.querySelector('.eco-level-icon');

    let currentLevelData = LEVELS.find(l => l.level === userProfile.level) || LEVELS[0];
    let nextLevelData = LEVELS.find(l => l.level === userProfile.level + 1);

    if (icon) icon.textContent = currentLevelData.icon;

    let percentage = 100;
    if (nextLevelData) {
        let min = currentLevelData.minXp;
        let max = nextLevelData.minXp;
        let current = userProfile.xp;
        percentage = Math.max(0, Math.min(100, Math.floor(((current - min) / (max - min)) * 100)));
    }

    if (fill) fill.style.width = `${percentage}%`;
    if (text) text.textContent = `${userProfile.xp} XP`;
    hud.title = `${currentLevelData.name} (Próximo nível em ${nextLevelData ? (nextLevelData.minXp - userProfile.xp) : 0} XP)`;
}

// --- Shop & Customization ---

const SHOP_ITEMS = {
    avatars: [
        { id: 'avatar_seed', name: 'Semente', icon: '🌱', reqLevel: 1 },
        { id: 'avatar_cat', name: 'Gatinho Reciclador', icon: '🐱', reqLevel: 5 },
        { id: 'avatar_robot', name: 'Robô G.A.I.A.', icon: '🤖', reqLevel: 10 },
        { id: 'avatar_capy', name: 'Capivara Suprema', icon: '👑', reqLevel: 20 }
    ],
    effects: [
        { id: 'effect_none', name: 'Nenhum', icon: '🚫', reqLevel: 1 },
        { id: 'effect_leaves', name: 'Chuva de Folhas', icon: '🍂', reqLevel: 3 },
        { id: 'effect_rain', name: 'Chuva Refrescante', icon: '🌧️', reqLevel: 4 },
        { id: 'effect_storm', name: 'Tempestade Feroz', icon: '⛈️ | ⚡', reqLevel: 9 },
        { id: 'effect_vagalume', name: 'Vagalumes', icon: '✨', reqLevel: 7 },
        { id: 'effect_gold_leaves', name: 'Folhas de Ouro', icon: '💰', reqLevel: 1, reqAllQuizzes: true },
        { id: 'effect_digital_rain', name: 'Chuva de Dados', icon: '💾', reqLevel: 1, reqTheme: 'theme-future' },
        { id: 'effect_matrix_rain', name: 'G.A.I.A. Matrix', icon: '🕶️', reqLevel: 1, isEasterEgg: true }
    ],
    themes: [
        { id: 'theme-default', name: 'Ambiental', icon: '🌿', reqLevel: 1 },
        { id: 'theme-future', name: 'G.A.I.A. Core', icon: '🌌', reqLevel: 20 }
    ]
};

function applyTheme() {
    const themeId = userProfile.equipped.theme || 'theme-default';
    document.body.classList.remove('theme-future');
    if (themeId === 'theme-future') document.body.classList.add('theme-future');
}

function openProfile() {
    const modal = document.createElement('div');
    modal.className = 'eco-modal-overlay';
    modal.id = 'ecoProfileModal';
    const currentLevel = LEVELS.find(l => l.level === userProfile.level) || LEVELS[0];

    modal.innerHTML = `
    <div class="eco-modal">
        <div class="eco-modal-header">
            <h2>Seu Perfil de Guardião</h2>
            <button class="eco-close-modal">&times;</button>
        </div>
        <div class="eco-modal-content">
            <div class="eco-profile-summary">
                <div class="eco-profile-avatar-big">${currentLevel.icon}</div>
                <div class="eco-profile-info">
                    <h3>${currentLevel.name}</h3>
                    <p>Nível ${userProfile.level}</p>
                    <p>Total: ${userProfile.xp} XP acumulados</p>
                </div>
            </div>
            <div class="eco-shop-tabs">
                <button class="eco-tab-btn active" data-tab="shop-effects">Efeitos Visuais</button>
                <button class="eco-tab-btn" data-tab="shop-avatars">Avatares</button>
                <button class="eco-tab-btn" data-tab="shop-themes">Temas</button>
            </div>
            <div class="eco-shop-grid" id="shopGrid"></div>
        </div>
    </div>`;

    document.body.appendChild(modal);
    renderShop('effects');

    modal.querySelector('.eco-close-modal').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    modal.querySelectorAll('.eco-tab-btn').forEach(btn => {
        btn.onclick = () => {
            modal.querySelectorAll('.eco-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderShop(btn.dataset.tab.split('-')[1]);
        };
    });
}

function renderShop(category) {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;
    const items = SHOP_ITEMS[category] || [];
    grid.innerHTML = items.map(item => {
        const levelUnlocked = userProfile.level >= item.reqLevel;
        let themeUnlocked = item.reqTheme ? userProfile.equipped.theme === item.reqTheme : true;
        let quizzesUnlocked = item.reqAllQuizzes ? userProfile.completedQuizzes.length >= (userProfile.totalQuizzes || 6) : (item.reqQuizzes ? userProfile.completedQuizzes.length >= item.reqQuizzes : true);

        // Easter eggs remain hidden until found
        if (item.isEasterEgg && !userProfile.unlockedEasterEgg) return '';

        // FORCE UNLOCK FOR AVATARS (User Request)
        const isAvatar = category === 'avatars';
        const isUnlocked = isAvatar || (levelUnlocked && quizzesUnlocked && themeUnlocked);

        const isEquipped = category === 'effects' ? userProfile.equipped.effect === item.id : (category === 'avatars' ? userProfile.equipped.avatar === item.id : userProfile.equipped.theme === item.id);

        let statusText = isEquipped ? 'Equipado' : 'Usar';
        if (!isUnlocked) {
            if (!levelUnlocked) statusText = `🔒 Nvl ${item.reqLevel}`;
            else if (item.reqTheme && !themeUnlocked) statusText = `🔒 Tema Futuro`;
            else statusText = `🔒 Bloqueado`;
        }

        return `<div class="eco-shop-item ${!isUnlocked ? 'locked' : ''} ${isEquipped ? 'equipped' : ''}" 
                     onclick="equipItem('${category}', '${item.id}', ${isUnlocked})">
                    <div class="item-icon">${item.icon}</div>
                    <div class="item-name">${item.name}</div>
                    <div class="item-status">${statusText}</div>
                </div>`;
    }).join('');
}

function equipItem(category, itemId, isUnlocked) {
    if (!isUnlocked) {
        showToast("Bloqueado! 🔒");
        return;
    }
    if (category === 'effects' && itemId === 'effect_storm') {
        showStormWarning(() => {
            userProfile.equipped.effect = itemId;
            saveProgress();
            renderShop(category);
            applyEffects();
            currentAmbienceType = null; // Force ambience refresh
            updateAmbience();
        });
        return;
    }
    if (category === 'effects') userProfile.equipped.effect = itemId;
    else if (category === 'avatars') userProfile.equipped.avatar = itemId;
    else if (category === 'themes') { userProfile.equipped.theme = itemId; applyTheme(); }
    saveProgress();
    renderShop(category);
    applyEffects();
    if (category === 'effects' || category === 'themes') {
        currentAmbienceType = null; // Force ambience refresh
        updateAmbience();
    }
    showToast(`Equipado! ✨`);
}

function showStormWarning(onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'eco-modal-overlay';
    modal.innerHTML = `
    <div class="eco-modal" style="max-width: 400px; text-align: center;">
        <h3>⚠️ Aviso</h3>
        <p>Este efeito contém flashes intensos. Prosseguir?</p>
        <button class="btn btn-primary" id="confirmStorm">Sim</button>
        <button class="btn btn-outline" id="cancelStorm">Não</button>
    </div>`;
    document.body.appendChild(modal);
    modal.querySelector('#confirmStorm').onclick = () => { modal.remove(); onConfirm(); };
    modal.querySelector('#cancelStorm').onclick = () => modal.remove();
}

// --- Visual Effects ---

function applyEffects() {
    if (window.ecoEffectInterval) clearInterval(window.ecoEffectInterval);
    const existing = document.getElementById('ecoEffectLayer');
    if (existing) existing.remove();
    const oldWater = document.querySelector('.eco-flood-water');
    if (oldWater) oldWater.remove();

    clearTimeout(window.ecoLightningTimer);
    clearInterval(window.ecoFloodTimer);
    clearInterval(window.ecoBoatTimer);
    clearInterval(window.ecoSeaLifeTimer);

    const effect = userProfile.equipped.effect;
    if (!effect || effect === 'effect_none') return;

    const layer = document.createElement('div');
    layer.id = 'ecoEffectLayer';
    layer.className = `eco-effect-${effect}`;
    document.body.appendChild(layer);

    const VESSELS_SVG = {
        sailboat: `<svg viewBox="0 0 100 80" class="vessel-svg"><path d="M10 60 Q 50 80, 90 60 L 80 75 Q 50 85, 20 75 Z" fill="#5D4037" /><path d="M48 5 L 48 55 L 15 45 Z" fill="#FFFFFF" /><path d="M52 10 L 52 55 L 85 50 Z" fill="#F8F8F8" /></svg>`,
        jetski: `<svg viewBox="0 0 100 60" class="vessel-svg"><path d="M10 40 L 80 40 L 95 55 L 5 55 Z" fill="#2563eb" /><path d="M60 25 L 85 40 L 55 40 Z" fill="#1e40af" /></svg>`,
        pirate: `<svg viewBox="0 0 160 120" class="vessel-svg"><path d="M10 65 L 150 65 Q 160 65, 155 75 L 140 100 Q 80 115, 20 100 L 5 75 Q 0 65, 10 65 Z" fill="#3E2723" /><rect x="78" y="5" width="4" height="65" fill="#2D1B18" /><path d="M78 10 Q 50 30, 78 40 Q 106 30, 78 10 Z" fill="#111" /></svg>`,
        link: `<svg viewBox="0 0 100 80" class="vessel-svg"><rect x="10" y="55" width="80" height="10" rx="3" fill="#5D4037" /><rect x="15" y="52" width="70" height="10" rx="3" fill="#795548" /><path d="M40 52 L 60 52 L 58 35 L 42 35 Z" fill="#4CAF50" /><circle cx="50" cy="30" r="8" fill="#fbc199" /><path d="M43 25 L 57 25 L 50 5 Z" fill="#2E7D32" /><path d="M45 30 Q 50 25, 55 30" fill="none" stroke="#FFD600" stroke-width="3" /></svg>`,
        fish: `<svg viewBox="0 0 40 20" class="vessel-svg"><path d="M5 10 Q 20 0, 35 10 Q 20 20, 5 10 Z" fill="#ff9800" /></svg>`,
        shark: `<svg viewBox="0 0 100 40" class="vessel-svg"><path d="M10 20 Q 50 5, 90 20 Q 50 35, 10 20 Z" fill="#607d8b" /><path d="M40 10 L 55 10 L 45 20 Z" fill="#455a64" /></svg>`
    };

    const runBoatSpawner = (waterEl) => {
        window.ecoBoatTimer = setInterval(() => {
            if (userProfile.equipped.effect !== effect || !waterEl.parentNode) return;
            if (Math.random() > 0.4) return;
            const boat = document.createElement('div');
            boat.className = effect === 'effect_storm' ? (Math.random() > 0.1 ? 'eco-pirate' : 'eco-link-wood') : (Math.random() > 0.7 ? 'eco-jetski' : 'eco-boat');
            boat.innerHTML = `<div class="boat-icon">${boat.className === 'eco-pirate' ? VESSELS_SVG.pirate : (boat.className === 'eco-link-wood' ? VESSELS_SVG.link : (boat.className === 'eco-jetski' ? VESSELS_SVG.jetski : VESSELS_SVG.sailboat))}</div>`;
            const fromLeft = Math.random() > 0.5;
            const duration = 12 + Math.random() * 8;
            boat.style.left = fromLeft ? '-150px' : '105vw';
            boat.style.animation = `${fromLeft ? 'drift-right' : 'drift-left'} ${duration}s linear forwards`;
            if (!fromLeft) boat.style.transform = 'scaleX(-1)';
            waterEl.appendChild(boat);
            setTimeout(() => boat.remove(), duration * 1000);
        }, 4000);
    };

    const runSeaLifeSpawner = (waterEl) => {
        window.ecoSeaLifeTimer = setInterval(() => {
            if (userProfile.equipped.effect !== effect || !waterEl.parentNode) return;
            if (Math.random() > 0.5) return;
            const isShark = Math.random() > 0.8;
            const creature = document.createElement('div');
            creature.className = isShark ? 'eco-shark' : 'eco-fish';
            creature.innerHTML = `<div class="creature-icon">${isShark ? VESSELS_SVG.shark : VESSELS_SVG.fish}</div>`;
            const fromLeft = Math.random() > 0.5;
            const duration = 6 + Math.random() * 6;
            creature.style.left = fromLeft ? '-100px' : '105vw';
            creature.style.top = `${10 + Math.random() * 80}%`;
            creature.style.animation = `${fromLeft ? 'drift-right' : 'drift-left'} ${duration}s linear forwards`;
            if (!fromLeft) creature.style.transform = 'scaleX(-1)';
            waterEl.appendChild(creature);
            setTimeout(() => creature.remove(), duration * 1000);
        }, 2500);
    };

    if (effect === 'effect_rain' || effect === 'effect_storm') {
        const isStorm = effect === 'effect_storm';
        window.ecoEffectInterval = setInterval(() => {
            const drop = document.createElement('div');
            drop.className = isStorm ? 'eco-storm-drop' : 'eco-rain-drop';
            drop.style.left = Math.random() * 100 + 'vw';
            layer.appendChild(drop);
            setTimeout(() => drop.remove(), 1000);
        }, isStorm ? 15 : 40);

        if (isStorm) {
            const lightning = () => {
                if (userProfile.equipped.effect !== effect) return;
                const flash = document.createElement('div');
                flash.className = 'eco-lightning-flash';
                document.body.appendChild(flash);
                requestAnimationFrame(() => { flash.style.opacity = 0.5; setTimeout(() => { flash.style.opacity = 0; setTimeout(() => flash.remove(), 200); }, 100); });
                window.ecoLightningTimer = setTimeout(lightning, 5000 + Math.random() * 8000);
            };
            lightning();
        }

        const water = document.createElement('div');
        water.className = 'eco-flood-water';
        water.innerHTML = `<div class="water-wave-layer wave-3"></div><div class="water-wave-layer wave-2"></div><div class="water-wave-layer wave-1"></div><div class="wave-shine"></div>`;
        document.body.appendChild(water);
        let level = 1;
        const maxLevel = isStorm ? 25 : 6;
        window.ecoFloodTimer = setInterval(() => {
            if (level < maxLevel) { level += 0.5; water.style.height = level + 'vh'; }
            else { water.style.height = (maxLevel + Math.sin(Date.now() / 1000) * (isStorm ? 2 : 0.5)) + 'vh'; }
        }, 50);

        runBoatSpawner(water);
        runSeaLifeSpawner(water);
    } else if (effect === 'effect_leaves' || effect === 'effect_gold_leaves') {
        window.ecoEffectInterval = setInterval(() => {
            const types = ['type-1', 'type-2', 'type-3', 'boldo'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            const leaf = document.createElement('div');
            leaf.className = `eco-leaf eco-leaf-${randomType} ${effect === 'effect_gold_leaves' ? 'eco-leaf-gold' : ''}`;
            leaf.style.left = Math.random() * 100 + 'vw';
            layer.appendChild(leaf);
            setTimeout(() => leaf.remove(), 12000);
        }, 1200);
    } else if (effect === 'effect_vagalume') {
        window.ecoEffectInterval = setInterval(() => {
            const glow = document.createElement('div');
            glow.className = 'eco-vagalume';
            glow.style.left = Math.random() * 100 + 'vw';
            glow.style.top = Math.random() * 100 + 'vh';
            layer.appendChild(glow);
            setTimeout(() => glow.remove(), 10000);
        }, 800);
    } else if (effect === 'effect_digital_rain' || effect === 'effect_matrix_rain') {
        const isMatrix = effect === 'effect_matrix_rain';
        window.ecoEffectInterval = setInterval(() => {
            const bit = document.createElement('div');
            bit.className = `eco-data-bit ${isMatrix ? 'matrix-style' : ''}`;
            bit.textContent = Math.random() > 0.5 ? '1' : '0';
            bit.style.left = Math.random() * 100 + 'vw';
            bit.style.fontSize = (0.8 + Math.random() * 1.5) + 'rem';
            bit.style.animationDuration = (2 + Math.random() * 3) + 's';
            layer.appendChild(bit);
            setTimeout(() => bit.remove(), 5000);
        }, isMatrix ? 50 : 150);
    }
}

function updateTotalQuizzes(count) {
    if (count && count !== userProfile.totalQuizzes) {
        userProfile.totalQuizzes = count;
        saveProgress();
    }
}

function markQuizComplete(quizType) {
    if (!userProfile.completedQuizzes) userProfile.completedQuizzes = [];
    if (!userProfile.completedQuizzes.includes(quizType)) {
        userProfile.completedQuizzes.push(quizType);
        saveProgress();
    }
}

// --- Initialization ---

window.gamification = { addXp, markQuizComplete, updateTotalQuizzes, userProfile, loadProgress, openProfile };

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    applyEffects();

    const hud = document.getElementById('ecoHud');
    if (hud) {
        hud.addEventListener('click', (e) => {
            if (e.target.classList.contains('eco-level-icon')) {
                window.clickCount = (window.clickCount || 0) + 1;

                // 7 cliques = Easter Egg Matrix
                if (window.clickCount === 7) {
                    userProfile.unlockedEasterEgg = true;
                    saveProgress();
                    showToast("🕵️ MODO HACKER ATIVADO!");
                }

                // 30 cliques = Console para Celular (Eruda)
                if (window.clickCount === 30) {
                    showToast("🛠️ ABRINDO CONSOLE DE DEV...");
                    const script = document.createElement('script');
                    script.src = "//cdn.jsdelivr.net/npm/eruda";
                    document.body.appendChild(script);
                    script.onload = function () {
                        eruda.init();
                        eruda.show();
                    };
                }
            }
            openProfile();
        });
    }

    document.addEventListener('click', (e) => {
        const audioBtn = e.target.closest('#audioToggle');
        if (audioBtn) {
            toggleMute();
        }
    });

    window.addEventListener('storage', (e) => {
        if (e.key === 'eco_progress' && e.newValue) {
            const newData = JSON.parse(e.newValue);
            const effectChanged = newData.equipped.effect !== userProfile.equipped.effect;
            const themeChanged = newData.equipped.theme !== userProfile.equipped.theme;
            const muteChanged = newData.audioMuted !== userProfile.audioMuted;

            userProfile = newData;
            updateHud();

            if (themeChanged) applyTheme();
            if (effectChanged || themeChanged || muteChanged) {
                applyEffects();
                updateAmbience();
                updateAudioUI();
            }

            if (document.getElementById('ecoProfileModal')) {
                const activeTabBtn = document.querySelector('.eco-tab-btn.active');
                if (activeTabBtn) renderShop(activeTabBtn.dataset.tab.split('-')[1]);
            }
        }
    });

    window.addEventListener('scroll', () => {
        const layer = document.getElementById('ecoEffectLayer');
        if (layer) {
            const shift = Math.max(-20, Math.min(20, -window.scrollY * 0.1));
            layer.style.setProperty('--eco-scroll-shift-y', `${shift}px`);
        }
    }, { passive: true });
});
