import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, DollarSign, MessageCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const quickActions = [
  {
    icon: Search,
    title: "Search Stock",
    description: "With one of the largest prestige vehicle ranges, search and find yourself the perfect car.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop",
    link: "Browse",
    color: "from-red-500/20 to-red-600/20"
  },
  {
    icon: DollarSign,
    title: "Sell Your Car",
    description: "Trust our team of luxury and prestige experts to provide a competitive offer on your car.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
    link: "Sell",
    color: "from-zinc-500/20 to-zinc-600/20"
  },
  {
    icon: MessageCircle,
    title: "Contact Us",
    description: "Speak to a member of our team or find directions to our showroom.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
    link: "Contact",
    color: "from-zinc-500/20 to-zinc-600/20"
  }
];

export default function QuickActionCards() {
  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(213,0,0,0.03),transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
            Expect the extraordinary,{" "}
            <span className="text-red-500">with A.B.S Motor Group.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={createPageUrl(action.link)}>
                  <Card className="group relative bg-zinc-900 border-zinc-800 overflow-hidden hover:border-red-500/50 transition-all duration-500 h-full">
                    {/* Image Background */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                      <img
                        src={action.image}
                        alt={action.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <CardContent className="relative p-8 flex flex-col h-full min-h-[320px]">
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-zinc-50 mb-4 group-hover:text-red-500 transition-colors duration-300">
                        {action.title}
                      </h3>
                      
                      <p className="text-zinc-400 leading-relaxed mb-6 flex-grow">
                        {action.description}
                      </p>

                      {/* Arrow */}
                      {/* <div className="flex items-center text-red-500 font-medium group-hover:gap-3 gap-2 transition-all duration-300">
                        <span>Learn More</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div> */}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}