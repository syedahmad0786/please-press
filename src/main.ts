import "./style.css";
import { ACTS, actFor } from "./acts";
import { clickSound, sting } from "./audio";

const KEY = "please-press:n";
const button = document.querySelector<HTMLButtonElement>("#the-button")!;
const face = button.querySelector(".face")!;
const whisper = document.querySelector("#whisper")!;
const yours = document.querySelector("#yours")!;
const globalEl = document.querySelector("#global")!;
const counter = document.querySelector<HTMLElement>("#counter")!;
const loreEl = document.querySelector<HTMLElement>("#lore")!;
const dialogs = document.querySelector("#dialogs")!;
const ending = document.querySelector<HTMLElement>("#ending")!;
const canvas = document.querySelector<HTMLCanvasElement>("#field")!;
const ctx = canvas.getContext("2d")!;

let n = Number(localStorage.getItem(KEY) || "0");
let seen = new Set<number>();
let particles: { x: number; y: number; vx: number; vy: number; life: number; hue: number }[] = [];
let shake = 0;

function resize() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
resize();
addEventListener("resize", resize);

function burst(count: number) {
  const r = button.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 1.2 + Math.random() * 6;
    particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 1,
      hue: (n * 7 + i * 19) % 360,
    });
  }
}

function tick() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  particles = particles.filter((p) => p.life > 0);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04;
    p.life -= 0.012;
    ctx.fillStyle = `hsla(${p.hue}, 70%, 45%, ${p.life})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (shake > 0.2) {
    document.documentElement.style.setProperty("--shake", `${(Math.random() - 0.5) * shake}px`);
    shake *= 0.9;
  } else {
    document.documentElement.style.setProperty("--shake", "0px");
  }
  requestAnimationFrame(tick);
}
tick();

function showDialog(title: string, body: string) {
  const el = document.createElement("div");
  el.className = "sys";
  el.style.left = 40 + Math.random() * 40 + "%";
  el.style.top = 18 + Math.random() * 40 + "%";
  el.style.transform = "translateX(-50%)";
  el.innerHTML = `<header><span>${title}</span><span>FT–002</span></header><p>${body}</p><button type="button">Acknowledge</button>`;
  el.querySelector("button")!.onclick = () => el.remove();
  dialogs.append(el);
  setTimeout(() => el.remove(), 8000);
}

function apply() {
  const act = actFor(n);
  yours.textContent = String(n);
  if (n > 0) counter.hidden = false;
  face.textContent = act.face || "·";
  whisper.textContent = act.whisper;
  button.classList.remove("wide", "huge");
  if (act.buttonClass) button.classList.add(...act.buttonClass.split(" "));
  document.body.className = act.body || "";
  if (n >= 1000) document.body.classList.add("cracked");
  if (act.lore) {
    loreEl.hidden = false;
    loreEl.textContent = act.lore;
  }
  if (n >= 10000) ending.hidden = false;
}

function crossed(prev: number, next: number) {
  for (const a of ACTS) {
    if (prev < a.at && next >= a.at && !seen.has(a.at)) {
      seen.add(a.at);
      if (a.dialog) showDialog(a.dialog.title, a.dialog.body);
      if (a.at >= 500) sting();
      if (a.at === 1000) shake = 18;
      if (a.at === 2500) shake = 24;
    }
  }
}

async function pingGlobal() {
  try {
    const res = await fetch("/api/click", { method: "POST" });
    if (!res.ok) return;
    const data = (await res.json()) as { total?: number };
    if (typeof data.total === "number") globalEl.textContent = data.total.toLocaleString();
  } catch {
    /* local-only is fine */
  }
}

button.addEventListener("click", () => {
  const prev = n;
  n += 1;
  localStorage.setItem(KEY, String(n));
  const act = actFor(n);
  const actIdx = ACTS.findIndex((a) => a.at === act.at);
  clickSound(Math.max(0, actIdx), n);
  burst(n < 10 ? 6 : n < 100 ? 14 : n < 1000 ? 28 : 48);
  if (n % 50 === 0) shake = Math.min(14, 4 + n / 400);
  crossed(prev, n);
  apply();
  if (n === 1 || n % 10 === 0) void pingGlobal();
});

document.querySelector("#reset")!.addEventListener("click", () => {
  n = 0;
  seen = new Set();
  localStorage.setItem(KEY, "0");
  ending.hidden = true;
  loreEl.hidden = true;
  document.body.className = "";
  apply();
  whisper.textContent = "";
  counter.hidden = true;
});

document.querySelector("#share-act")!.addEventListener("click", async () => {
  const c = document.createElement("canvas");
  c.width = 1080;
  c.height = 1080;
  const g = c.getContext("2d")!;
  g.fillStyle = "#f4f0e6";
  g.fillRect(0, 0, 1080, 1080);
  g.fillStyle = "#16140f";
  g.beginPath();
  g.arc(540, 480, 90, 0, Math.PI * 2);
  g.fill();
  g.font = "italic 42px Georgia";
  g.fillText("THE BUTTON.", 80, 160);
  g.font = "28px monospace";
  g.fillText(`I reached ${n.toLocaleString()} presses.`, 80, 820);
  g.fillText("a Fun Toy", 80, 980);
  c.toBlob(async (blob) => {
    if (!blob) return;
    const file = new File([blob], "the-button.png", { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: "THE BUTTON." });
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "the-button.png";
      a.click();
    }
  });
});

apply();
if (n > 0) void pingGlobal();
