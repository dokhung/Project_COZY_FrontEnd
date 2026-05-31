import Hero from '@/components/landings/Hero';
import Footer from '@/components/landings/Footer';

export default function Home() {
  return (
    <main className="theme-page relative min-h-screen overflow-hidden pt-16">
      <div className="theme-glow-1 pointer-events-none absolute -top-28 left-1/2 h-56 w-[520px] -translate-x-1/2 rounded-full blur-2xl" />
      <div className="theme-stars pointer-events-none absolute inset-0" />
      <div className="theme-ocean-rays pointer-events-none absolute inset-0" />
      <Hero />
      {/*<Feature />*/}
      <Footer />
    </main>
  );
}
