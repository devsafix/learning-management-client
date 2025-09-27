import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
      icon: "clock",
      question: "What are your business hours?",
      answer:
        "Our customer service team is available Monday through Friday from 9:00 AM to 8:00 PM EST, and weekends from 10:00 AM to 6:00 PM EST. During holidays, hours may vary and will be posted on our website.",
    },
    {
      id: "item-2",
      icon: "credit-card",
      question: "How do subscription payments work?",
      answer:
        "Subscription payments are automatically charged to your default payment method on the same day each month or year, depending on your billing cycle. You can update your payment information and view billing history in your account dashboard.",
    },
    {
      id: "item-3",
      icon: "truck",
      question: "Can I expedite my shipping?",
      answer:
        "Yes, we offer several expedited shipping options at checkout. Next-day and 2-day shipping are available for most U.S. addresses if orders are placed before 2:00 PM EST. International expedited shipping options vary by destination.",
    },
    {
      id: "item-4",
      icon: "globe",
      question: "Do you offer localized support?",
      answer:
        "We offer multilingual support in English, Spanish, French, German, and Japanese. Our support team can assist customers in these languages via email, chat, and phone during standard business hours for each respective region.",
    },
    {
      id: "item-5",
      icon: "package",
      question: "How do I track my order?",
      answer:
        "Once your order ships, you'll receive a confirmation email with a tracking number. You can use this number on our website or the carrier's website to track your package. You can also view order status and tracking information in your account dashboard under \"Order History\".",
    },
  ];

  return (
    <section className="bg-[#0A091A] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-1/3">
            <div className="sticky top-20 text-white">
              <h2 className="mt-4 text-4xl font-extrabold leading-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-4">
                Can't find what you're looking for? Contact our{" "}
                <Link
                  to="#"
                  className="text-primary font-medium hover:underline"
                >
                  customer support team
                </Link>
              </p>
            </div>
          </div>
          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  style={{
                    background:
                      "linear-gradient(135deg, #2A2A4A 0%, #1A1A3A 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                  className="shadow-xs text-white rounded-lg border px-4 last:border-b"
                >
                  <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6">
                        <DynamicIcon
                          name={item.icon}
                          className="m-auto size-4"
                        />
                      </div>
                      <span className="text-base">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="px-9">
                      <p className="text-base">{item.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
