"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = [
    {
      value: "item-1",
      question: "Who can partner with Buyronix?",
      answer:
        "Any registered retail hardware shop, computer hardware vendor, electronics component supplier, or local tech store owner with a physical storefront or commercial setup can join the Buyronix marketplace.",
    },
    {
      value: "item-2",
      question: "What do I need to register?",
      answer:
        "You'll need basic details about your shop name and address, owner contact information, bank account details for fast payout settlements, and your GSTIN (GST registration certificate).",
    },
    {
      value: "item-3",
      question: "How does instant delivery work?",
      answer:
        "When an order is placed by a nearby customer, you receive an instant alert. Once you pack the requested components or hardware, our local delivery fleet collects it directly from your shop counter and delivers it straight to the customer's doorstep.",
    },
    {
      value: "item-4",
      question: "Why is GST verification important?",
      answer:
        "GST verification builds unmatched trust with local buyers, ensures authentic tax invoices with seamless input tax credits (ITC), and elevates reputable neighborhood hardware shops above unorganized counterfeit vendors.",
    },
  ];

  return (
    <div id="faq" className="py-8 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 w-full bg-[#fefbfc] flex flex-col justify-center">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-10 md:mb-14"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.15]">
            A few things you might be wondering
          </h2>
        </motion.div>

        {/* Accordion with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Accordion
            defaultValue={["item-1"]}
            className="w-full divide-y divide-neutral-200 border-y border-neutral-200"
          >
            {faqs.map((faq) => (
              <AccordionItem key={faq.value} value={faq.value} className="py-2">
                <AccordionTrigger className="text-base sm:text-lg font-medium text-neutral-900 hover:text-[#623ac3] py-4 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-neutral-600 leading-relaxed pb-5 pr-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
