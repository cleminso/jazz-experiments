import { co, z } from "jazz-tools";

export const ChatRoom = co.map({
  bubble1: co.plainText(),
  bubble2: co.plainText(),
  bubble1Owner: z.optional(z.string()),
  bubble2Owner: z.optional(z.string()),
});
export type ChatRoom = co.loaded<typeof ChatRoom>;
