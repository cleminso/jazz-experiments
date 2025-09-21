import { useRef, useState, useEffect } from "react";

export function AppContainer(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between w-screen h-screen bg-stone-50 dark:bg-stone-925 dark:text-white">
      {props.children}
    </div>
  );
}

export function TopBar(props: { children: React.ReactNode }) {
  return (
    <div className="p-3 bg-white w-full flex justify-between gap-2 border-b dark:bg-transparent dark:border-stone-900">
      {props.children}
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
    if (isTyping && !otherIsTyping) return { other: "15%", mine: "70%" };
    if (!isTyping && otherIsTyping) return { other: "70%", mine: "15%" };
    if (isTyping && otherIsTyping) return { other: "50%", mine: "50%" };
    return { other: "15%", mine: "15%" };
  };

  const heights = getBubbleHeights();

  return (
    <div className="flex flex-col justify-between h-full p-6 gap-6">
      <div style={{ height: heights.other }} className="flex-shrink-0">
        <div className="h-full rounded-3xl flex items-center justify-center p-6 max-w-2xl mx-auto">
          <div className="text-stone-700 dark:text-stone-300 whitespace-pre-wrap text-center text-base md:text-lg leading-relaxed tracking-wide overflow-hidden">
            {otherBubble.length > MAX_CHARS
              ? otherBubble.slice(0, MAX_CHARS) + "..."
              : otherBubble || "Type something..."}
          </div>
        </div>
      </div>

      <div style={{ height: heights.mine }} className="flex-shrink-0">
        <div className="h-full bg-blue-500 rounded-3xl border-2 border-blue-600 p-6 flex items-center max-w-2xl mx-auto">
          <div className="w-full flex flex-col">
            <textarea
              value={localText}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isFocused ? "" : "Type something..."}
              maxLength={MAX_CHARS}
              className="w-full text-center content-center resize-none border-none outline-none focus:ring-0 placeholder-blue-200 text-base md:text-lg leading-relaxed tracking-wide overflow-hidden"
              style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                caretColor: "#ffffff",
                minHeight: "1.5rem",
                maxHeight: "calc(100% - 1.5rem)",
              }}
            />
            {isTyping && (
              <div className="text-blue-200 text-xs mt-2 text-center">
                {localText.length}/{MAX_CHARS}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
