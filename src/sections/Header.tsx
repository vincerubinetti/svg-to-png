import Logo from "@/assets/logo.svg?react";

const { VITE_TITLE } = import.meta.env;

export default function Header() {
  return (
    <header className="flex items-center justify-center gap-8 bg-theme p-8 text-white">
      <h1 className="flex items-center gap-4 text-2xl tracking-wider">
        <Logo className="h-10" />
        {VITE_TITLE}
      </h1>
    </header>
  );
}
