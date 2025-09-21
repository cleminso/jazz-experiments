import { apiKey } from "@/apiKey.ts";
import { getRandomUsername } from "@/util.ts";
import { useIframeHashRouter } from "hash-slash";
import { Group } from "jazz-tools";
import { JazzInspector } from "jazz-tools/inspector";
import { JazzReactProvider, useAccount } from "jazz-tools/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChatScreen } from "./chatScreen.tsx";
import { ChatRoom } from "./schema.ts";
import { ThemeProvider } from "./themeProvider.tsx";
import { AppContainer } from "./ui.tsx";
import { co } from "jazz-tools";

export function App() {
  const { me } = useAccount();
  const router = useIframeHashRouter();

  const createChat = () => {
    if (!me) return;
    const group = Group.create();
    group.makePublic("writer");
    const chatRoom = ChatRoom.create(
      {
        bubble1: co.plainText().create("", group),
        bubble2: co.plainText().create("", group),
      },
      group,
    );
    router.navigate("/#/chat/" + chatRoom.$jazz.id);
  };

  return (
    <AppContainer>
      {router.route({
        "/": () => createChat() as never,
        "/chat/:id": (id) => <ChatScreen chatID={id} />,
      })}
    </AppContainer>
  );
}

const url = new URL(window.location.href);
const defaultProfileName = url.searchParams.get("user") ?? getRandomUsername();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <StrictMode>
      <JazzReactProvider
        sync={{
          peer: `wss://cloud.jazz.tools/?key=${apiKey}`,
        }}
        defaultProfileName={defaultProfileName}
      >
        <App />
        <JazzInspector />
      </JazzReactProvider>
    </StrictMode>
  </ThemeProvider>,
);
