import { Button } from "@/components/ui/button";

export default function Banner() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      {/* Background image */}
      <img
        src="/cl-banner.webp"
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Content */}
      <div className="max-w-3xl mx-auto text-center space-y-6 px-4">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Join <span className="text-primary">1,000,000+</span> Developers
          <br /> Around the Globe
        </h1>
        <p className="text-lg md:text-xl text-background/80">
          The no.1 platform to go from beginner to advanced developer. Access
          all courses + exclusive projects and level up your career.
        </p>
        <Button size="lg" className="rounded-full">
          Join Code Learner Pro →
        </Button>
      </div>
    </section>
  );
}
