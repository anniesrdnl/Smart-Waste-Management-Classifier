import Categories from "@/components/Categories";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ModelInfo from "@/components/ModelInfo";
import WasteClassifier from "@/components/WasteClassifier";

export default function Home() {
  return (
    <>
      <a
        href="#classifier"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:shadow-raised"
      >
        Skip to classifier
      </a>
      <Header />
      <main>
        <Hero />
        <WasteClassifier />
        <HowItWorks />
        <Categories />
        <ModelInfo />
      </main>
      <Footer />
    </>
  );
}
