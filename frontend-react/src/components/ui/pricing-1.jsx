import { CheckIcon } from "lucide-react";
import React from "react";

const Pricing1 = () => {
  // Pricing plan data
  const pricingPlans = [
    {
      title: "Hobby",
      popular: false,
      description:
        "Perfect for students and individuals mapping out concepts on personal canvases.",
      price: "$0",
      features: [
        "Up to 3 active whiteboards",
        "Max 5 concurrent editors",
        "720p video synchronization",
        "7-day history retention",
        "Community support",
      ],
    },
    {
      title: "Pro Team",
      popular: true,
      description:
        "Ideal for agile teams requiring unlimited spaces and premium meeting features.",
      price: "$12",
      features: [
        "Unlimited whiteboards",
        "Up to 100 concurrent editors",
        "1080p video synchronization",
        "Unlimited history retention",
        "Export to vector formats",
        "Cancel anytime",
      ],
    },
    {
      title: "Enterprise",
      popular: false,
      description:
        "Designed for large scale organizations demanding custom SSO and high security.",
      price: "Custom",
      features: [
        "Unlimited everything",
        "SSO & Custom SAML",
        "End-to-End custom encryption",
        "Dedicated infrastructure",
        "24/7 dedicated support",
        "SLA guarantees",
      ],
    },
  ];

  return (
    <section id="pricing" className="flex flex-col items-center justify-center gap-20 w-full max-w-5xl px-6 mx-auto py-20 bg-background text-foreground">
      <div className="flex flex-col items-center gap-7 w-full">
        <h2 className="font-medium text-2xl leading-6 text-center">
          Simple and transparent pricing
        </h2>
      </div>

      <div className="flex justify-between flex-wrap w-full">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className={`flex-1 border border-primary/10 rounded-none ${
              index === 1 ? "border-t border-b border-l-0 border-r-0" : ""
            }`}
          >
            <div className="p-[30px] flex flex-col h-full gap-6 justify-between">
              <div className="flex flex-col gap-6">
                <div className="p-0 flex flex-col gap-4">
                  <div className="font-medium text-xl leading-5">
                    {plan.title}{" "}
                    {plan.popular && (
                      <span className="text-sm leading-[14px] opacity-80 font-normal">
                        // most popular
                      </span>
                    )}
                  </div>
                  <p className="opacity-80 font-normal text-sm leading-[22px]">
                    {plan.description}
                  </p>
                  <div className="font-normal text-xs leading-3">
                    <span className="font-medium text-base leading-4">
                      {plan.price}
                    </span>
                    <span> monthly</span>
                  </div>
                </div>
                <hr />

                <div className="flex flex-col h-[165px] justify-between">
                  {plan.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center gap-1.5"
                    >
                      <CheckIcon className="w-[15px] h-[15px]" />
                      <span className="font-normal text-sm leading-[15.4px]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <hr />
              <div className="p-0 ">
                <button
                  className={`w-[120px] h-10 rounded-none ${
                    index === 1
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground border border-[#0000001a] hover:bg-gray-50"
                  }`}
                >
                  Book a call
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export { Pricing1 };
