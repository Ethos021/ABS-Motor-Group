import React from "react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import VehicleCard from "../shared/VehicleCard";
import { motion } from "framer-motion";

export default function NewArrivals({ vehicles }) {
  const latestVehicles = vehicles.slice(0, 6);

  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span className="text-red-500 text-sm font-medium tracking-wider">LATEST COLLECTION</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4 leading-tight">
              Browse our{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                recent arrivals
              </span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl">
              Discover the latest additions to our premium collection of luxury and prestige vehicles
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <Link to={createPageUrl("Browse")}>
              <Button className="gradient-red text-white font-semibold px-8 py-6 hover:opacity-90 transition-all group">
                View All Stock
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {latestVehicles.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {latestVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <VehicleCard vehicle={vehicle} />
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:hidden"
            >
              <Link to={createPageUrl("Browse")}>
                <Button className="gradient-red text-white font-semibold px-8 py-6 hover:opacity-90 transition-all group">
                  View All Stock
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-red-500" />
            </div>
            <p className="text-zinc-400 text-lg">New vehicles coming soon...</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}