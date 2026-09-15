import Logo from "@/assets/logo.svg?react";

const { VITE_TITLE } = import.meta.env;

export default function Header() {
  return (
    <header className="relative flex items-center justify-center gap-2 bg-theme p-8 text-white max-md:flex-col">
      <h1 className="flex items-center gap-4 text-2xl tracking-wider">
        <Logo className="h-10" />
        <div>
          {VITE_TITLE}
          <sup className="opacity-75">*</sup>
        </div>
      </h1>
      <div className="italic opacity-75 md:absolute md:right-10">
        * and other formats
      </div>
    </header>
  );
}
