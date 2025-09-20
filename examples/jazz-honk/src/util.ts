// This is only for demo purposes for https://jazz.tools
// This is NOT needed to make the chat work

import { ChatRoom } from "./schema";

export function onChatLoad(chat: ChatRoom) {
  if (window.parent) {
    chat.$jazz.waitForSync().then(() => {
      window.parent.postMessage(
        { type: "chat-load", id: "/chat/" + chat.$jazz.id },
        "*",
      );
    });
  }
}

export const inIframe = window.self !== window.top;

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
