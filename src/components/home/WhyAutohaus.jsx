import React from "react";
import { Shield, Award, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Prestige Cars, Prestige Quality",
    description: "We provide only the highest quality prestige, luxury, and performance cars, meeting the strictest standards in the industry. Our full-service experience includes seamless trade-ins, expert advice, competitive financing, and nationwide delivery.",
    gradient: "from-red-500 to-red-600"
  },
  {
    icon: Award,
    title: "An Unmatched Service",
    description: "Our dedicated team is here to guide you through every part of your experience. Whether buying, selling, or exploring options, we ensure a seamless, personalised process with the highest level of service and attention to detail.",
    gradient: "from-zinc-500 to-zinc-600"
  },
  {
    icon: DollarSign,
    title: "Tailored Finance, Built For You",
    description: "We offer flexible, competitive finance solutions through access to over 40 lenders, providing you with tailored options that make securing your next prestige vehicle effortless and affordable.",
    gradient: "from-zinc-500 to-zinc-600"
  }
];

export default function WhyAutohaus() {
  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-6 leading-tight">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              A.B.S Motor Group?
            </span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Built on passion, driven by excellence. Here's what sets us apart.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Card className="group relative bg-zinc-900 border-zinc-800 hover:border-red-500/50 transition-all duration-500 h-full overflow-hidden">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:via-transparent group-hover:to-transparent transition-all duration-500" />
                  
                  <CardContent className="relative p-8">
                    {/* Icon with Animated Background */}
                    <div className="relative mb-6">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 blur-2xl rounded-full`} />
                      <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-red-500/20`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-zinc-50 mb-4 group-hover:text-red-500 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-zinc-400 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Bottom Border Animation */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}