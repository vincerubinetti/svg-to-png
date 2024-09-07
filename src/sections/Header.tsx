import Logo from "@/assets/logo.svg?react";

const Header = () => (
  <header>
    <h1>
      <Logo style={{ height: "1.5em", flexShrink: 0 }} />
      SVG to PNG
    </h1>
  </header>
);

export default Header;
