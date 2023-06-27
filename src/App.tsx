import File from "@/sections/File";
import Footer from "@/sections/Footer";
import Header from "@/sections/Header";
import Results from "@/sections/Results";
import "@/components/tooltip";
import "./App.css";

const App = () => (
  <>
    <Header />
    <main>
      <section>
        <File />
      </section>
      <section>
        <Results />
      </section>
    </main>
    <Footer />
  </>
);

export default App;
