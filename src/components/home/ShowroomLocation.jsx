import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { motion } from "framer-motion";

export default function ShowroomLocation() {
  return (
    <section className="relative py-24 bg-zinc-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(213,0,0,0.1),transparent_70%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden luxury-shadow group">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
                alt="A.B.S Motor Group Showroom"
                className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute top-6 left-6 glass-effect rounded-2xl px-6 py-3 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-white font-semibold">Open Now</span>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -z-10 -bottom-8 -left-8 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="text-red-500 text-sm font-medium tracking-wider">VISIT OUR SHOWROOM</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-6 leading-tight">
              Experience Prestige in{" "}
              <span className="text-red-500">Airport West</span>
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              Visit our flagship showroom where luxury meets expertise. Our modern facility showcases an extensive collection of prestige vehicles in a welcoming, professional environment.
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 hover:border-red-500/30 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
                  <MapPin className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <div className="font-semibold text-zinc-50 mb-1">Address</div>
                  <a 
                    href="https://maps.app.goo.gl/uM1Xd5VUEJHa5S9X6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    17 Louis St, Airport West VIC 3042, Australia
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 hover:border-red-500/30 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
                  <Phone className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <div className="font-semibold text-zinc-50 mb-1">Phone</div>
                  <a href="tel:0394840084" className="text-zinc-400 hover:text-red-500 transition-colors">
                    03 9484 0084
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 hover:border-red-500/30 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
                  <Clock className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <div className="font-semibold text-zinc-50 mb-2">Opening Hours</div>
                  <div className="text-zinc-400 space-y-1 text-sm">
                    <div className="flex justify-between gap-8">
                      <span>Monday - Friday</span>
                      <span className="text-zinc-300">8:30am - 5:30pm</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span>Saturday</span>
                      <span className="text-zinc-300">9:00am - 3:00pm</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span>Sunday</span>
                      <span className="text-red-500">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <a 
              href="https://maps.app.goo.gl/uM1Xd5VUEJHa5S9X6"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="gradient-red text-white font-semibold px-8 py-6 hover:opacity-90 transition-all group w-full sm:w-auto">
                <Navigation className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Get Directions
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}