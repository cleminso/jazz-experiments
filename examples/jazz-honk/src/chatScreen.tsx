import { Account } from "jazz-tools";
import { useAccount, useCoState } from "jazz-tools/react";
import { ChatRoom } from "./schema.ts";
import { Link, Trash2 } from "lucide-react";
import { ChatBody, InputBar, HonkBubbles, ChatTopBar } from "./ui.tsx";

export function ChatScreen(props: { chatID: string }) {
  const chatRoom = useCoState(ChatRoom, props.chatID);
  const { me } = useAccount();

  if (!chatRoom || !me) {
    return (
      <div className="flex-1 flex justify-center items-center">Loading...</div>
    );
  }

  // Determine which bubble belongs to current user
  const userBubbleNumber = getUserBubbleNumber(me, chatRoom);
  const myBubble = userBubbleNumber === 1 ? chatRoom.bubble1 : chatRoom.bubble2;
  const otherBubble =
    userBubbleNumber === 1 ? chatRoom.bubble2 : chatRoom.bubble1;

  const otherUserId =
    userBubbleNumber === 1 ? chatRoom.bubble2Owner : chatRoom.bubble1Owner;

  const handleMyBubbleChange = (text: string) => {
    myBubble?.$jazz.applyDiff(text);
  };

  const clearMyBubble = () => {
    myBubble?.$jazz.applyDiff("");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <>
      <ChatTopBar otherUserId={otherUserId} />
      <ChatBody>
        <HonkBubbles
          myBubble={myBubble?.toString() || ""}
          otherBubble={otherBubble?.toString() || ""}
          onMyBubbleChange={handleMyBubbleChange}
        />
      </ChatBody>

      <InputBar>
        <button
          onClick={copyLink}
          className=" text-stone-500 p-1.5 rounded-full hover:bg-stone-100 hover:text-stone-800 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
          title="Copy link"
        >
          <Link size={24} strokeWidth={1.5} />
        </button>

        <div className="flex-1 text-center content-center text-sm text-stone-500">
          <input
            type="text"
            value={me?.profile?.name ?? ""}
            className="bg-transparent h-full text-center content-center text-xl font-sans"
            onChange={(e) => {
              if (!me?.profile) return;
              me.profile.$jazz.set("name", e.target.value);
            }}
            placeholder="Set username"
          />
        </div>

        <button
          onClick={clearMyBubble}
          className="text-stone-500 p-1.5 dark:hover:text-red-400 transition-colors"
          title="Clear my bubble"
        >
          <Trash2 size={24} strokeWidth={1.5} />
        </button>
      </InputBar>
    </>
  );
}

function getUserBubbleNumber(user: Account, chatRoom: ChatRoom): 1 | 2 {
  const userId = user.$jazz.id;

  // Check if user is already assigned to a bubble
  if (chatRoom.bubble1Owner === userId) return 1;
  if (chatRoom.bubble2Owner === userId) return 2;

  // If neither bubble has an owner, assign to bubble1
  if (!chatRoom.bubble1Owner && !chatRoom.bubble2Owner) {
    chatRoom.$jazz.set("bubble1Owner", userId);
    return 1;
  }

  // If bubble1 has an owner but bubble2 doesn't, assign to bubble2
  if (chatRoom.bubble1Owner && !chatRoom.bubble2Owner) {
    chatRoom.$jazz.set("bubble2Owner", userId);
    return 2;
  }

  // If bubble2 has an owner but bubble1 doesn't, assign to bubble1
  if (chatRoom.bubble2Owner && !chatRoom.bubble1Owner) {
    chatRoom.$jazz.set("bubble1Owner", userId);
    return 1;
  }

  // Fallback: both bubbles have owners, assign based on user ID
  return userId < (chatRoom.bubble1Owner || "") ? 1 : 2;
}
