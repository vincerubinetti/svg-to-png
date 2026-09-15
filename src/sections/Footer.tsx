import { Code } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex items-center justify-center bg-theme p-8 text-lg text-white">
      <a
        href="https://github.com/vincerubinetti/svg-to-png"
        target="_blank"
        className="flex items-center gap-2 hover:text-black hover:no-underline"
      >
        <Code />
        <span>Source code</span>
      </a>
    </footer>
  );
}
