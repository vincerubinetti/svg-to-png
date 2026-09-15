import Footer from "@/sections/Footer";
import Header from "@/sections/Header";
import Input from "@/sections/Input";
import Options from "@/sections/Options";
import Output from "@/sections/Output";
import "@fontsource-variable/figtree/wght.css";
import "@fontsource-variable/spline-sans-mono/wght.css";
import "./styles.css";

const App = () => (
  <>
    <Header />
    <main>
      <Input />
      <Options />
      <Output />
    </main>
    <Footer />
  </>
);

export default App;
