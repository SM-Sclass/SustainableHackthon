import Showcase from "./components/Showcase";
import BrandsSuggest from "./components/BrandsSuggest";
export default function Home() {
  return (
    <main className="min-h-screen bg-[rgb(233,241,252)]">
        <Showcase/>
        <BrandsSuggest/>
    </main>
  );
}
