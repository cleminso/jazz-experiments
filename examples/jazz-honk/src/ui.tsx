import { Account } from "jazz-tools";
import { useCoState } from "jazz-tools/react";
import { useRef, useState, useEffect } from "react";
import { InfoButton } from "./info";

export function AppContainer(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between w-screen h-dvh overflow-hidden bg-stone-50 dark:bg-stone-925 dark:text-white">
      {props.children}
    </div>
  );
}

export function ChatTopBar({
  otherUserId,
}: {
  otherUserId: string | undefined;
}) {
  const otherUser = useCoState(Account, otherUserId);

  return (
    <div className="p-3 bg-white w-full flex justify-between items-center border-b dark:bg-transparent dark:border-stone-900">
      <div className="flex-shrink-0">
        <InfoButton />
      </div>

      <div className="flex-1 text-center">
        <div className="text-sm text-stone-600 dark:text-stone-400">
          Chatting with
        </div>
        <div className="text-lg font-medium text-stone-800 dark:text-stone-200">
          {otherUser?.profile?.name || "Anonymous"}
        </div>
      </div>

      <div className="flex-shrink-0 w-9" />
    </div>
  );
}

export function ChatBody(props: { children: React.ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto h-full" role="application">
      {props.children}
    </div>
  );
}

export function InputBar(props: { children: React.ReactNode }) {
  return (
    <div className="p-3 bg-white border-t shadow-2xl mt-auto flex gap-1 dark:bg-transparent dark:border-stone-900">
      {props.children}
    </div>
  );
}

export function HonkBubbles({
  myBubble,
  otherBubble,
  onMyBubbleChange,
}: {
  myBubble: string;
  otherBubble: string;
  onMyBubbleChange: (text: string) => void;
}) {
  const [localText, setLocalText] = useState(myBubble);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [otherIsTyping, setOtherIsTyping] = useState(false);
  const debounceTimerRef = useRef<number | undefined>(undefined);
  const otherDebounceTimerRef = useRef<number | undefined>(undefined);

  const MAX_CHARS = 240;

  useEffect(() => {
    setLocalText(myBubble);
  }, [myBubble]);

  useEffect(() => {
    clearTimeout(otherDebounceTimerRef.current);
    const otherHasContent = otherBubble.trim().length > 0;
    setOtherIsTyping(otherHasContent);

    if (otherHasContent) {
      otherDebounceTimerRef.current = setTimeout(
        () => setOtherIsTyping(false),
        3000,
      );
    }
  }, [otherBubble]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;

    if (newText.length > MAX_CHARS) return;

    setLocalText(newText);
    onMyBubbleChange(newText);

    clearTimeout(debounceTimerRef.current);
    const hasContent = newText.trim().length > 0;
    setIsTyping(hasContent);

    if (hasContent) {
      debounceTimerRef.current = setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setLocalText("");
      onMyBubbleChange("");

      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const getBubbleHeights = () => {
    if (isTyping && !otherIsTyping) return { other: "35%", mine: "65%" };
    if (!isTyping && otherIsTyping) return { other: "65%", mine: "35%" };
    if (isTyping && otherIsTyping) return { other: "50%", mine: "50%" };
    return { other: "25%", mine: "25%" };
  };

  const heights = getBubbleHeights();

  return (
    <div className="flex flex-col h-full p-3 sm:p-6">
      <div style={{ height: heights.other, minHeight: "20%", maxHeight: "70%" }} className="flex-shrink-0">
        <div className="h-full flex items-center justify-center p-3 sm:p-6 mx-3 sm:mx-auto max-w-sm sm:max-w-md md:max-w-lg">
          <div className="text-stone-700 dark:text-stone-300 whitespace-pre-wrap text-center text-sm sm:text-base md:text-lg leading-relaxed tracking-wide overflow-hidden">
            {otherBubble.length > MAX_CHARS
              ? otherBubble.slice(0, MAX_CHARS) + "..."
              : otherBubble || "Type something..."}
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <div style={{ height: heights.mine, minHeight: "20%", maxHeight: "70%" }} className="flex-shrink-0">
        <div className="h-full bg-blue-500 rounded-2xl sm:rounded-3xl p-3 sm:p-6 mx-3 sm:mx-auto max-w-sm sm:max-w-md md:max-w-lg">
          <div className="h-full flex flex-col">
            <textarea
              value={localText}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isFocused ? "" : "Type something..."}
              maxLength={MAX_CHARS}
              className="flex-1 w-full text-center content-center resize-none border-none outline-none focus:ring-0 placeholder-blue-200 text-sm sm:text-base md:text-lg leading-relaxed tracking-wide"
              style={{
                backgroundColor: "transparent",
                color: "#f5f5f4",
                caretColor: "#f5f5f4",
              }}
            />
            {isTyping && (
              <div className="text-blue-200 text-xs mt-1 sm:mt-2 text-center flex-shrink-0">
                {localText.length}/{MAX_CHARS}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
