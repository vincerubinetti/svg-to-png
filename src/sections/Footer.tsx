import { Code, RefreshCw } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-center gap-8 bg-theme p-8 text-lg text-white *:no-underline *:hover:text-black">
      <a
        href="https://github.com/vincerubinetti/svg-to-png"
        target="_blank"
        className="flex items-center justify-center gap-2 text-center"
      >
        Source code
        <Code />
      </a>

      <button
        onClick={() => {
          if (
            !window.confirm(
              "Reset all remembered images, options, etc.? No undo.",
            )
          )
            return;
          window.localStorage.clear();
          window.location.reload();
        }}
      >
        Reset All
        <RefreshCw />
      </button>
    </footer>
  );
}
