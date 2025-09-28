import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { Link } from "react-router";

type FAQItem = {
  id: string;
  icon: IconName;
  question: string;
  answer: string;
};

export default function FAQ() {
  const faqItems: FAQItem[] = [
    {
      id: "item-1",
      icon: "graduation-cap",
      question: "What programming languages and technologies do you teach?",
      answer:
        "Code Learner offers comprehensive courses in JavaScript, Python, React, Node.js, TypeScript, Next.js, MongoDB, PostgreSQL, and more. Our curriculum covers both frontend and backend development, along with DevOps, cloud technologies, and modern frameworks. New courses are added regularly based on industry demands.",
    },
    {
      id: "item-2",
      icon: "credit-card",
      question: "How does the subscription and payment system work?",
      answer:
        "We offer flexible monthly and yearly subscription plans. Your subscription automatically renews on the same date each billing cycle. You get unlimited access to all courses, projects, and community features. You can upgrade, downgrade, or cancel anytime from your dashboard. We also offer a 14-day free trial for new users.",
    },
    {
      id: "item-3",
      icon: "trophy",
      question: "Will I receive a certificate upon course completion?",
      answer:
        "Yes! Upon successfully completing a course and passing all assessments, you'll receive a verified digital certificate. These certificates can be shared on LinkedIn, added to your resume, or downloaded as PDF. We also provide project portfolio showcases to demonstrate your practical skills to potential employers.",
    },
    {
      id: "item-4",
      icon: "users",
      question: "Do you provide mentorship and community support?",
      answer:
        "Absolutely! Code Learner includes access to our vibrant community of learners and industry professionals. You get 1-on-1 mentorship sessions, code reviews, career guidance, and 24/7 community support through our Discord server. Our instructors are active in forums and provide personalized feedback on projects.",
    },
    {
      id: "item-5",
      icon: "code",
      question: "Are the courses project-based and hands-on?",
      answer:
        "Yes! Every course includes real-world projects and hands-on coding exercises. You'll build actual applications, deploy them live, and create a professional portfolio. Our 'learning by doing' approach ensures you gain practical experience, not just theoretical knowledge. All projects come with starter templates and step-by-step guidance.",
    },
  ];

  return (
    <section className="relative bg-[#0A091A] py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
          {/* Left column - Title and description */}
          <div className="lg:w-2/5">
            <div className="sticky top-24">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-semibold text-sm mb-6">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                FAQ
              </div>

              {/* Main heading */}
              <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
                Got Questions About
                <span className="block bg-gradient-to-r from-primary via-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Code Learner?
                </span>
              </h2>

              {/* Description */}
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Find answers to the most common questions about our courses,
                platform, and learning experience.
              </p>

              {/* CTA */}
              <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] border border-gray-700/30 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <DynamicIcon
                        name="message-circle"
                        className="w-6 h-6 text-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">
                      Still have questions?
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Our support team is here to help you succeed in your
                      coding journey.
                    </p>
                    <Link
                      to="/support"
                      className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors group"
                    >
                      <span>Contact Support</span>
                      <DynamicIcon
                        name="arrow-right"
                        className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - FAQ Items */}
          <div className="lg:w-3/5">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="group bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] border border-gray-700/30 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <AccordionTrigger className="cursor-pointer px-6 py-6 hover:no-underline group-hover:bg-gradient-to-r group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300">
                    <div className="flex items-center gap-4 text-left w-full">
                      {/* Icon with gradient background */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-yellow-500/20 rounded-xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-yellow-500/30 transition-all duration-300">
                          <DynamicIcon
                            name={item.icon}
                            className="w-6 h-6 text-primary"
                          />
                        </div>
                      </div>

                      {/* Question */}
                      <div className="flex-grow">
                        <span className="text-lg font-semibold text-white group-hover:text-primary transition-colors duration-300">
                          {item.question}
                        </span>
                      </div>

                      {/* Number badge */}
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-700/30 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-400">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-6 pb-6">
                    <div className="ml-16 pr-12">
                      <div className="border-l-2 border-primary/30 pl-6">
                        <p className="text-gray-300 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Bottom CTA */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] border border-primary/20 rounded-2xl p-8">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <DynamicIcon
                      name="rocket"
                      className="w-8 h-8 text-primary"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Ready to Start Learning?
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Join thousands of developers who have transformed their
                    careers with Code Learner.
                  </p>
                  <Link to="/all-courses">
                    <Button
                      size="lg"
                      className="relative px-8 py-4 bg-primary text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 group cursor-pointer"
                    >
                      <span>Explore Courses</span>

                      {/* Button glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 rounded-xl blur-lg opacity-30 -z-10 group-hover:opacity-50 transition-opacity duration-300"></div>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
