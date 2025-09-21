import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const fruits = [
  "guave",
  "passionfruit",
  "apple",
  "pineapple",
  "mongustan",
  "breadfruit",
  "durian",
  "pomelo",
  "orange",
  "kiwi",
];

export function getRandomUsername() {
  return `Anonymous ${fruits[Math.floor(Math.random() * fruits.length)]}`;
}
