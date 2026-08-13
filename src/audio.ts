let ctx: AudioContext | null = null;

function audio(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function beep(freq: number, dur = 0.08, type: OscillatorType = "sine", gain = 0.05) {
  const ac = audio();
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g);
  g.connect(ac.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  o.stop(ac.currentTime + dur + 0.02);
}

export function clickSound(act: number, n: number) {
  if (act < 1) beep(440 + (n % 7) * 12, 0.07, "sine", 0.04);
  else if (act < 3) beep(520 + (n % 12) * 18, 0.09, "triangle", 0.05);
  else if (act < 5) {
    beep(180, 0.12, "square", 0.03);
    beep(720, 0.06, "sine", 0.04);
  } else if (act < 7) {
    beep(90, 0.2, "sawtooth", 0.03);
    beep(1200, 0.04, "square", 0.02);
  } else {
    beep(40, 0.35, "sawtooth", 0.05);
    beep(880, 0.18, "triangle", 0.04);
    beep(1320, 0.08, "sine", 0.03);
  }
}

export function sting() {
  beep(196, 0.4, "triangle", 0.06);
  setTimeout(() => beep(247, 0.5, "triangle", 0.05), 180);
  setTimeout(() => beep(330, 0.8, "sine", 0.04), 360);
}
