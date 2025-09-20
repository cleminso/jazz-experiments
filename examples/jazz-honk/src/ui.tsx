import clsx from "clsx";
import { CoPlainText, ImageDefinition } from "jazz-tools";
import { Image } from "jazz-tools/react";
import { ImageIcon } from "lucide-react";
import { useId, useRef, useState, useEffect } from "react";

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

export function EmptyChatMessage() {
  return (
    <div className="h-full text-base text-stone-500 flex items-center justify-center px-3 md:text-2xl">
      Start a conversation below.
    </div>
  );
}

export function BubbleContainer(props: {
  children: React.ReactNode;
  fromMe: boolean | undefined;
}) {
  const align = props.fromMe ? "items-end" : "items-start";
  return (
    <div className={`${align} flex flex-col m-3`} role="row">
      {props.children}
    </div>
  );
}

export function BubbleBody(props: {
  children: React.ReactNode;
  fromMe: boolean | undefined;
}) {
  return (
    <div
      className={clsx(
        "line-clamp-10 text-ellipsis whitespace-pre-wrap",
        "rounded-2xl overflow-hidden max-w-[calc(100%-5rem)] shadow-sm p-1",
        props.fromMe
          ? "bg-white dark:bg-stone-900 dark:text-white"
          : "bg-blue text-white",
      )}
    >
      {props.children}
    </div>
  );
}

export function BubbleText(props: {
  text: CoPlainText | string;
  className?: string;
}) {
  return (
    <p className={clsx("px-2 leading-relaxed", props.className)}>
      {props.text}
    </p>
  );
}

export function BubbleImage(props: { image: ImageDefinition }) {
  return (
    <Image
      imageId={props.image.$jazz.id}
      className="h-auto max-h-80 max-w-full rounded-t-xl mb-1"
      height="original"
      width="original"
    />
  );
}

export function BubbleInfo(props: { by: string | undefined; madeAt: Date }) {
  return (
    <div className="text-xs text-neutral-500 mt-1.5">
      {props.by} · {props.madeAt.toLocaleTimeString()}
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

export function ImageInput({
  onImageChange,
}: {
  onImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onUploadClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <button
        type="button"
        aria-label="Send image"
        title="Send image"
        onClick={onUploadClick}
        className="text-stone-500 p-1.5 rounded-full hover:bg-stone-100 hover:text-stone-800 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
      >
        <ImageIcon size={24} strokeWidth={1.5} />
      </button>

      <label className="sr-only">
        Image
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/gif"
          onChange={onImageChange}
        />
      </label>
    </>
  );
}

export function TextInput(props: { onSubmit: (text: string) => void }) {
  const inputId = useId();

  return (
    <div className="flex-1">
      <label className="sr-only" htmlFor={inputId}>
        Type a message and press Enter
      </label>
      <input
        id={inputId}
        className="rounded-full text-center py-1 px-3 border block w-full placeholder:text-stone-500 dark:bg-stone-925 dark:text-white dark:border-stone-900"
        placeholder="Type a message and press Enter"
        maxLength={2048}
        onKeyDown={({ key, currentTarget: input }) => {
          if (key !== "Enter" || !input.value) return;
          props.onSubmit(input.value);
          input.value = "";
        }}
      />
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
  const debounceTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setLocalText(myBubble);
  }, [myBubble]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setLocalText(newText);
    onMyBubbleChange(newText);

    // Simple debounce logic
    clearTimeout(debounceTimerRef.current);
    const hasContent = newText.trim().length > 0;
    setIsTyping(hasContent);

    if (hasContent) {
      debounceTimerRef.current = setTimeout(() => setIsTyping(false), 3000);
    }
  };

  // Single height calculation
  const getBubbleHeights = () => {
    const otherHasContent = otherBubble.trim().length > 0;

    if (isTyping && !otherHasContent) return { other: "15%", mine: "70%" };
    if (!isTyping && otherHasContent) return { other: "70%", mine: "15%" };
    if (isTyping && otherHasContent) return { other: "50%", mine: "50%" };
    return { other: "15%", mine: "15%" };
  };

  const heights = getBubbleHeights();

  return (
    <div className="flex flex-col justify-between h-full p-6 gap-6">
      <div style={{ height: heights.other }} className="flex-shrink-0">
        <div className="h-full bg-stone-100 dark:bg-stone-800 rounded-3xl p-6 border-2 border-stone-200 dark:border-stone-700">
          <div className="text-sm text-stone-500 dark:text-stone-400 mb-2">
            Other person
          </div>
          <div className="h-full overflow-y-auto">
            <p className="text-stone-700 dark:text-stone-300 whitespace-pre-wrap leading-relaxed">
              {otherBubble || "Type something..."}
            </p>
          </div>
        </div>
      </div>

      <div style={{ height: heights.mine }} className="flex-shrink-0">
        <div className="h-full bg-blue-500 rounded-3xl p-6 border-2 border-blue-600">
          <div className="text-sm text-blue-100 mb-2">You</div>
          <textarea
            value={localText}
            onChange={handleChange}
            placeholder="Type something..."
            className="w-full h-full resize-none border-none outline-none leading-relaxed focus:ring-0 placeholder-blue-200"
            style={{
              backgroundColor: "transparent",
              color: "#ffffff",
              caretColor: "#ffffff",
            }}
          />
        </div>
      </div>
    </div>
  );
}
