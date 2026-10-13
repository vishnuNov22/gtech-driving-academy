import { FloatingActions, Navbar, Preloader } from "@/components/Chrome";
import { Story } from "@/components/story/Story";
import {
  Contact, DoorToDoor, Enquiry, Faq, Footer, Gallery, BrandPromise, Rto, Safety, Signs, Stats, Team, Ticker, Training, WhyUs,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main>
        <Story />
        <Ticker />
        <Stats />
        <BrandPromise />
        <Training />
        <Safety />
        <WhyUs />
        <DoorToDoor />
        <Signs />
        <Rto />
        <Team />
        <Gallery />
        <Faq />
        <Enquiry />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
