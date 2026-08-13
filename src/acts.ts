export type Act = {
  at: number;
  name: string;
  whisper: string;
  lore?: string;
  body?: string;
  face?: string;
  buttonClass?: string;
  dialog?: { title: string; body: string };
};

export const ACTS: Act[] = [
  { at: 1, name: "I", whisper: "oh.", face: "·" },
  { at: 3, name: "I", whisper: "again? alright.", face: "o" },
  { at: 10, name: "II", whisper: "particles. you did that.", face: "◦" },
  { at: 25, name: "II", whisper: "the room is paying attention.", face: "•" },
  {
    at: 80,
    name: "III½",
    whisper: "the room is now the button.",
    face: "▣",
    body: "act-takeover",
    dialog: {
      title: "DISPLAY",
      body: "Gallery lighting has been reassigned to Object FT–002. Please remain seated.",
    },
  },
  {
    at: 100,
    name: "IV",
    whisper: "one hundred. the button has a favorite now.",
    face: "◉",
    dialog: {
      title: "SYSTEM",
      body: "A visitor is interacting with Object FT–002 beyond recommended duration. Continue?",
    },
  },
  {
    at: 180,
    name: "V",
    whisper: "do not look at the corners.",
    lore: "The button was never installed. It arrived with the building.",
    face: "◎",
  },
  { at: 250, name: "VI", whisper: "the glass is optional.", face: "✦", buttonClass: "wide" },
  {
    at: 400,
    name: "VII",
    whisper: "something under the floor clicked back.",
    lore: "Accession note: previous visitor reached 397 and left a coat.",
    face: "✶",
    dialog: {
      title: "CURATOR",
      body: "If the button begins to speak in the second person, that is expected.",
    },
  },
  { at: 500, name: "VIII", whisper: "five hundred. theatrical lighting, please.", face: "✸", body: "act-gold" },
  {
    at: 750,
    name: "IX",
    whisper: "you can stop. you will not.",
    lore: "Fragment 12: All museums contain one object that is also a door.",
    face: "✺",
    buttonClass: "huge",
  },
  {
    at: 1200,
    name: "X½",
    whisper: "an update is ready. it is not.",
    face: "↻",
    body: "act-os",
    dialog: {
      title: "System Update",
      body: "Installing Button 16.0 (Theatrical). Do not unplug the museum.",
    },
  },
  {
    at: 1500,
    name: "XI",
    whisper: "lore says the last press is a kindness.",
    lore: "When the count reaches ten thousand the button remembers being a star.",
    face: "✦",
  },
  {
    at: 2500,
    name: "XII",
    whisper: "choir incoming. this is not a metaphor.",
    face: "☉",
  },
  {
    at: 5000,
    name: "XIII",
    whisper: "the museum has been replaced with the button.",
    lore: "You are the exhibition now. The gift shop is closed.",
    face: "●",
  },
  {
    at: 10000,
    name: "XIV",
    whisper: "enough. enough. thank you.",
    face: "·",
    body: "act-end",
  },
];

export function actFor(n: number): Act {
  let current = ACTS[0];
  for (const a of ACTS) if (n >= a.at) current = a;
  return current;
}
