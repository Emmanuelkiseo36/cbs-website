import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import Services from '@/components/Services';
import Process from '@/components/Process';
import WhyCbs from '@/components/WhyCbs';
import GlobalTrade from '@/components/GlobalTrade';
import About from '@/components/About';
import Statement from '@/components/Statement';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { getPageData } from '@/lib/public';

export const dynamic = 'force-dynamic';

export default function Home() {
  const data = getPageData();
  const { settings, hero, intro, servicesHeading, services, whyCbs, cta } = data;

  return (
    <>
      <Navbar settings={settings} />
      <main>
        <Hero
          content={{
            heading: hero.heading,
            description: hero.description,
            primaryText: hero.ctaText,
            primaryUrl: hero.ctaUrl,
            secondaryText: hero.cta2Text,
            secondaryUrl: hero.cta2Url,
            image: hero.image,
          }}
          slogan={settings.slogan}
          shortName={settings.shortName}
        />
        <Intro content={{ heading: intro.heading, description: intro.description }} />
        <Services services={services} heading={servicesHeading.heading} />
        <Process />
        <WhyCbs heading={whyCbs.heading} description={whyCbs.description} values={whyCbs.values} />
        <GlobalTrade />
        <About />
        <Statement
          content={{ heading: cta.heading, description: cta.description, primaryText: cta.ctaText, primaryUrl: cta.ctaUrl }}
        />
        <Contact
          content={{ heading: cta.heading, description: cta.description }}
          serviceOptions={settings.serviceOptions}
          settings={settings}
        />
      </main>
      <Footer settings={settings} services={services} />
      <FloatingWhatsApp settings={settings} />
    </>
  );
}