import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import VideoPortfolio from "@/components/VideoPortfolio";
import PhotoGallery from "@/components/PhotoGallery";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <VideoPortfolio />
      <PhotoGallery />
      <Contact />
    </main>
  );
}
