import { CustomCursor } from "./components/CustomCursor";
import { AmbientBackground } from "./components/AmbientBackground";
import { Loader } from "./components/Loader";
import { Navigation } from "./components/Navigation";
import { MagneticEffect } from "./components/MagneticEffect";
import { Hero } from "./components/sections/Hero";
import { Intro } from "./components/sections/Intro";
import { Spotlight } from "./components/sections/Spotlight";
import { BrochureFlip } from "./components/sections/BrochureFlip";
import { DragGallery } from "./components/sections/DragGallery";
import { RedactReveal } from "./components/sections/RedactReveal";
import { ComparisonSlider } from "./components/sections/ComparisonSlider";
import { Stats } from "./components/sections/Stats";
import { Manifesto } from "./components/sections/Manifesto";
import { TipForm } from "./components/sections/TipForm";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <MagneticEffect />
      <AmbientBackground />
      <Loader />
      <Navigation />
      
      <main>
        <Hero />
        <Intro />
        <Spotlight />
        <BrochureFlip />
        <DragGallery />
        <RedactReveal />
        <ComparisonSlider />
        <Stats />
        <Manifesto />
        <TipForm />
      </main>

      <Footer />
    </>
  );
}
