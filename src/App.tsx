import Footer from "@/sections/Footer";
import Header from "@/sections/Header";
import Input from "@/sections/Input";
import Output from "@/sections/Output";
import "@/components/tooltip";
import "./App.css";

const App = () => (
  <>
    <Header />
    <main>
      <Input />
      <Output />
    </main>
    <Footer />
  </>
);

export default App;
