import Banner from "@/components/module/home/Banner";
import FAQ from "@/components/module/home/Faq";
import HomeCourse from "@/components/module/home/HomeCourse";
import Marquee from "@/components/module/home/Marquee";
import Testimonials from "@/components/module/home/Testimonials";

export default function Home() {
  return (
    <div>
      <Banner />
      <Marquee />
      <HomeCourse />
      <Testimonials />
      <FAQ />
    </div>
  );
}
