import edl from './edl.json';

export const FPS = 25;
export const CARD = 40; // chapter card, frames
export const OUTRO = 150; // frames

type Clip = {from: number; to: number};
type Chapter = {id: string; title: string | null; clips: Clip[]};

export type Item =
  | {kind: 'clip'; start: number; dur: number; srcFrom: number; chapter: number}
  | {kind: 'card'; start: number; dur: number; chapter: number; title: string}
  | {kind: 'outro'; start: number; dur: number};

const chapters = edl as Chapter[];

export const items: Item[] = [];
export const chapterSpans: {title: string; start: number; end: number}[] = [];

let t = 0;
chapters.forEach((ch, ci) => {
  if (ch.title) {
    items.push({kind: 'card', start: t, dur: CARD, chapter: ci, title: ch.title});
    t += CARD;
  }
  const chStart = t;
  ch.clips.forEach((c) => {
    items.push({kind: 'clip', start: t, dur: c.to - c.from, srcFrom: c.from, chapter: ci});
    t += c.to - c.from;
  });
  if (ch.title) chapterSpans.push({title: ch.title, start: chStart - CARD, end: t});
});
items.push({kind: 'outro', start: t, dur: OUTRO});
export const TOTAL = t + OUTRO;

/** Map a source-video time (seconds) to the timeline frame, or null if it was cut. */
export const srcToTimeline = (sec: number): number | null => {
  const f = Math.round(sec * FPS);
  for (const it of items) {
    if (it.kind === 'clip' && f >= it.srcFrom && f < it.srcFrom + it.dur) return it.start + (f - it.srcFrom);
  }
  return null;
};

/* ---------- inserts, positioned by SOURCE time so they stay glued to the moment ---------- */
export type Insert =
  | {type: 'lower'; at: number; dur: number; name: string; role: string; icon?: string}
  | {type: 'fact'; at: number; dur: number; label: string; value: string; icon?: string}
  | {type: 'counter'; at: number; dur: number; label: string; from: number; to: number; suffix: string}
  | {type: 'sticker'; at: number; dur: number; text: string; tilt: number}
  | {type: 'myth'; at: number; dur: number};

export const inserts: Insert[] = [
  {type: 'lower', at: 21.9, dur: 2.5, name: 'Дарья', role: 'первокурсница', icon: 'graduation'},
  {type: 'lower', at: 24.6, dur: 5, name: 'Виктор, 23', role: 'магистрант · робототехника · из Барселоны', icon: 'bot'},
  {type: 'sticker', at: 71.4, dur: 3, text: 'Россия звучит мощно!', tilt: -4},
  {type: 'fact', at: 190.0, dur: 4, label: 'Все лекции', value: 'на английском', icon: 'languages'},
  {type: 'fact', at: 235.4, dur: 4, label: 'Диплом', value: 'автономные дроны', icon: 'drone'},
  {type: 'sticker', at: 348.0, dur: 4.5, text: 'Защищал статью вместо преподавателя', tilt: 3},
  {type: 'counter', at: 435.6, dur: 6, label: 'Стипендия магистранта', from: 18000, to: 42000, suffix: ' ₽'},
  {type: 'sticker', at: 445.9, dur: 2.6, text: 'Где моя золотая цепь?', tilt: -6},
  {type: 'fact', at: 481.2, dur: 4.5, label: 'Общежитие', value: '2 000 ₽ в месяц', icon: 'building'},
  {type: 'fact', at: 524.3, dur: 4, label: 'Строгого режима нет', value: 'хоть в 3 часа ночи', icon: 'key'},
  {type: 'sticker', at: 537.7, dur: 1.8, text: 'Без алкоголя!', tilt: 5},
  {type: 'myth', at: 599.3, dur: 9.6},
  {type: 'sticker', at: 646.0, dur: 2, text: 'Ммм, вкусно!', tilt: -5},
  {type: 'fact', at: 705.7, dur: 5, label: 'Физкультура', value: '30 часов в спорткомплексе', icon: 'dumbbell'},
  {type: 'sticker', at: 757.3, dur: 2.4, text: 'Создай свой клуб!', tilt: 4},
  {type: 'fact', at: 834.0, dur: 5, label: 'После выпуска', value: 'год работы в компании', icon: 'briefcase'},
];
