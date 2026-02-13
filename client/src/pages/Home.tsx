import { useEffect, useState } from "react";
import { Canvas3D } from "@/components/Canvas3D";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button-custom";
import { PreorderModal } from "@/components/PreorderModal";
import { motion, useScroll, useTransform } from "framer-motion";
import { ReactLenis } from "@studio-freight/react-lenis";
import { ArrowRight, Battery, Gauge, Zap, Wind, ShieldCheck, Cpu } from "lucide-react";

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [activeColor, setActiveColor] = useState("#1a1a1a");

  // Colors map
  const colors = [
    { name: "Stealth Black", hex: "#1a1a1a" },
    { name: "Quantum Silver", hex: "#C0C0C0" },
    { name: "Nebula Blue", hex: "#3b82f6" },
    { name: "Mars Red", hex: "#ef4444" },
  ];

  return (
    <ReactLenis root>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
        <Navbar />

        {/* HERO SECTION */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          {/* 3D Background */}
          <div className="absolute inset-0 z-0">
            <Canvas3D color={activeColor} />
          </div>

          {/* Overlay UI */}
          <div className="container relative z-10 mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 pointer-events-none h-full items-center">
            {/* Left: Text */}
            <motion.div 
              style={{ y: y1, opacity }} 
              className="space-y-6 pt-20 pointer-events-auto"
            >
              <h2 className="text-primary font-display text-xl tracking-[0.5em] animate-pulse">
                FUTURE IS HERE
              </h2>
              <h1 className="text-6xl md:text-8xl font-display font-bold leading-none text-glow">
                AUREX <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">X1</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-md font-light leading-relaxed">
                Redefining motion with aerogel composites and solid-state propulsion. 
                Experience the silence of pure speed.
              </p>
              
              <div className="flex gap-4 pt-4">
                <PreorderModal>
                  <Button variant="neon" size="lg">
                    Reserve Yours <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </PreorderModal>
                <Button variant="outline" size="lg">
                  Watch Film
                </Button>
              </div>
            </motion.div>

            {/* Right: Glass Specs */}
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="hidden md:flex flex-col items-end justify-center space-y-4 pointer-events-auto"
            >
              <div className="glass-panel p-6 rounded-lg w-64 backdrop-blur-md border-r-4 border-r-primary">
                <p className="text-xs uppercase text-gray-400 tracking-widest">0-100 km/h</p>
                <p className="text-4xl font-display font-bold">1.9s</p>
              </div>
              <div className="glass-panel p-6 rounded-lg w-64 backdrop-blur-md border-r-4 border-r-white">
                <p className="text-xs uppercase text-gray-400 tracking-widest">Top Speed</p>
                <p className="text-4xl font-display font-bold">410 <span className="text-sm">km/h</span></p>
              </div>
              <div className="glass-panel p-6 rounded-lg w-64 backdrop-blur-md border-r-4 border-r-gray-500">
                <p className="text-xs uppercase text-gray-400 tracking-widest">Range (WLTP)</p>
                <p className="text-4xl font-display font-bold">850 <span className="text-sm">km</span></p>
              </div>
            </motion.div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div 
            style={{ opacity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">Scroll to Explore</p>
            <div className="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent mx-auto"></div>
          </motion.div>
        </section>

        {/* PERFORMANCE SECTION */}
        <section id="performance" className="py-24 relative bg-black">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 border-b border-white/10 pb-8">
              <div>
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-2">UNLEASHED</h2>
                <p className="text-gray-400 max-w-xl">
                  Dual-motor architecture delivering instant torque vectoring.
                </p>
              </div>
              <div className="text-right mt-8 md:mt-0">
                <p className="text-6xl font-display text-primary font-bold">1,200 <span className="text-2xl text-white">HP</span></p>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Peak Power Output</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Zap className="w-8 h-8 text-primary" />, title: "Instant Torque", desc: "1,400 Nm available from 0 RPM." },
                { icon: <Wind className="w-8 h-8 text-primary" />, title: "Active Aero", desc: "Dynamic wing adjustment for 600kg downforce." },
                { icon: <Gauge className="w-8 h-8 text-primary" />, title: "Track Mode", desc: "Calibrated suspension for circuit dominance." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="glass-panel p-8 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* INTERACTIVE 360 SECTION */}
        <section id="design" className="min-h-screen py-24 relative flex items-center bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 h-full">
            
            {/* Configurator Controls */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-8 order-2 lg:order-1">
              <div>
                <h2 className="text-4xl font-display font-bold mb-2">BESPOKE DESIGN</h2>
                <p className="text-gray-400">Sculpted by wind, refined by obsession.</p>
              </div>

              <div className="space-y-4">
                <p className="uppercase tracking-widest text-sm text-gray-500">Select Finish</p>
                <div className="flex space-x-4">
                  {colors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setActiveColor(c.hex)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        activeColor === c.hex ? "border-primary scale-110 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
                <p className="font-display text-xl">{colors.find(c => c.hex === activeColor)?.name}</p>
              </div>

              <div className="glass-panel p-6 rounded-xl border-l-4 border-l-primary">
                <h4 className="text-lg font-bold mb-2">AERO-FRAME CHASSIS</h4>
                <p className="text-sm text-gray-400">
                  Monocoque carbon fiber structure integrated with the battery pack for maximum rigidity and safety.
                </p>
              </div>
            </div>

            {/* 3D Viewport */}
            <div className="lg:col-span-8 h-[50vh] lg:h-auto rounded-2xl overflow-hidden border border-white/10 relative order-1 lg:order-2 shadow-2xl">
              <Canvas3D color={activeColor} />
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-xs text-white/70 uppercase">
                Interactive 3D Preview
              </div>
            </div>
          </div>
        </section>

        {/* SPECS GRID */}
        <section id="specs" className="py-24 bg-black relative overflow-hidden">
          {/* Background textural elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-center text-4xl font-display font-bold mb-16 text-glow">TECHNICAL SPECIFICATIONS</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
              {[
                { label: "Drivetrain", value: "Quad Motor AWD", icon: <Cpu /> },
                { label: "Battery", value: "120 kWh Solid State", icon: <Battery /> },
                { label: "Charging", value: "350kW DC Fast", icon: <Zap /> },
                { label: "Weight", value: "1,850 kg", icon: <ShieldCheck /> },
                { label: "Seating", value: "2+2 GT Config", icon: null },
                { label: "Cargo", value: "450 Liters", icon: null },
                { label: "Warranty", value: "8 Years / Unltd km", icon: null },
                { label: "Delivery", value: "Q4 2025", icon: null },
              ].map((spec, i) => (
                <div key={i} className="bg-black p-8 hover:bg-white/5 transition-colors group">
                  <div className="flex items-center justify-between mb-4 text-gray-500 group-hover:text-primary transition-colors">
                    <span className="text-xs uppercase tracking-widest">{spec.label}</span>
                    {spec.icon && <div className="w-5 h-5">{spec.icon}</div>}
                  </div>
                  <p className="text-2xl font-display font-semibold">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FOOTER */}
        <footer className="py-32 relative flex flex-col items-center justify-center text-center bg-gradient-to-t from-primary/20 to-black">
          <div className="container mx-auto px-4 z-10">
            <h2 className="text-5xl md:text-8xl font-display font-bold mb-8 tracking-tighter">
              DRIVE THE <span className="text-outline text-transparent stroke-white" style={{ WebkitTextStroke: "1px white" }}>FUTURE</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Limited Founder's Edition allocation now open. Secure your build slot today.
            </p>
            <PreorderModal>
              <Button className="h-16 px-12 text-xl rounded-full shadow-[0_0_50px_rgba(59,130,246,0.6)]" variant="neon">
                Reserve Now - $100
              </Button>
            </PreorderModal>
          </div>
          
          <div className="absolute bottom-0 w-full p-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 border-t border-white/5 bg-black/80 backdrop-blur-sm">
            <p>&copy; 2025 AUREX MOTORS. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Press Kit</a>
            </div>
          </div>
        </footer>
      </div>
    </ReactLenis>
  );
}
