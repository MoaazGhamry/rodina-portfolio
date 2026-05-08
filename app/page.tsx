import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import VideoPortfolio from "@/components/VideoPortfolio";
import Moments from "@/components/Moments";
import PhotoGallery from "@/components/PhotoGallery";
import Contact from "@/components/Contact";
import FloralBackground from "@/components/FloralBackground";

export default function Home() {
  return (
    <main>
      <FloralBackground />
      <Navbar />
      <Hero />
      <About />
      <VideoPortfolio />
      <Moments />
      <PhotoGallery />
      <Contact />
    </main>
  );
}
