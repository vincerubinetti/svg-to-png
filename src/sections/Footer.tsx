import { Code } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex items-center justify-center bg-theme p-8 text-white">
      <a
        href="https://github.com/vincerubinetti/svg-to-png"
        target="_blank"
        className="flex items-center gap-2 hover:no-underline"
      >
        <Code />
        <span>Source code and help</span>
      </a>
    </footer>
  );
}
