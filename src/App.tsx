import Footer from "@/sections/Footer";
import Header from "@/sections/Header";
import Input from "@/sections/Input";
import Options from "@/sections/Options";
import Output from "@/sections/Output";
import "@/components/tooltip";
import "./App.css";

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
