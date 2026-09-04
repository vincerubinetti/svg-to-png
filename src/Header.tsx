const { VITE_TITLE, VITE_REPO } = import.meta.env;
import Logo from "@/logo.svg?react";

export default function Header() {
  return (
    <header className="max-sm:flex-col max-sm:gap-2">
      <div className="flex-1 max-md:hidden" />
      <hgroup className="flex flex-2 items-center gap-4 md:justify-center">
        <Logo className="h-10" />
        <h1>{VITE_TITLE}</h1>
      </hgroup>
      <div className="flex flex-1 justify-end">
        <a href={VITE_REPO}>Source & Help</a>
      </div>
    </header>
  );
}
