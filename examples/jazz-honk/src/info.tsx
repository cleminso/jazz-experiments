import { useState } from "react";
import { Info, ExternalLink } from "lucide-react";

function AlertDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white dark:bg-stone-900 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}

function AlertDialogContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col h-full">{children}</div>;
}

function AlertDialogHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col space-y-3 p-6 pb-4 border-b dark:border-stone-800">
      {children}
    </div>
  );
}

function AlertDialogTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
      {children}
    </h2>
  );
}

function AlertDialogDescription({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm text-stone-600 dark:text-stone-400 overflow-y-auto flex-1 px-6 py-4">
      {children}
    </div>
  );
}

function AlertDialogFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4 border-t dark:border-stone-800">
      {children}
    </div>
  );
}

function AlertDialogAction({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 transition-colors"
    >
      {children}
    </button>
  );
}

export function InfoButton() {
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setAlertOpen(true)}
        className="p-2 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors shadow-sm"
      >
        <Info className="h-5 w-5 text-stone-900 dark:text-stone-200" />
      </button>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Real-time Chat Experiment</AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogDescription>
            <div className="space-y-6">
              <div>
                <p className="leading-relaxed">
                  Jazz-Honk is a real-time chat experiments built with Jazz
                  Tools, using Honk chat pattern.
                </p>
                <p>No send button, no chat history, simply two chat bubbles.</p>
              </div>

              {/* How to use */}
              <div>
                <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-3 flex items-center gap-2">
                  How to use
                </h3>
                <div className="text-sm space-y-2">
                  <p>
                    1. Open{" "}
                    <a
                      href="https://jazz-honk.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      jazz-honk.vercel.app
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                  <p>2. Copy chatRoom URL</p>
                  <p>3. Send it to a friend or open a private browser window</p>
                </div>
              </div>

              {/* How it Works */}
              <div>
                <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-3 flex items-center gap-2">
                  How it Works
                </h3>
                <div className="text-sm space-y-2">
                  <p>
                    Jazz Honk uses Collaborative Objects to manage chat and
                    bubbles state. Each characters is show in real-time to all
                    participants.
                  </p>
                  <p>
                    The chat bubbles dynamically resize based on typing
                    activity, creating an engaging visual representation of the
                    conversation flow.
                  </p>
                </div>
              </div>

              {/* Sources */}
              <div>
                <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-3 flex items-center gap-2">
                  Sources
                </h3>
                <div className="text-sm space-y-2">
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://github.com/cleminso/jazz-experiments/tree/main/examples/jazz-honk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      Code
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <span className="text-stone-400">|</span>
                    <a
                      href="https://jazz.tools"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      Jazz Tools
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <span className="text-stone-400">|</span>
                    <a
                      href="https://benji.org/honkish"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      Honk
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </AlertDialogDescription>

          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
