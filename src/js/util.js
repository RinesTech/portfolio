export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
