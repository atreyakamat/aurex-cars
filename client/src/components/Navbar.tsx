import { Link } from "wouter";
import { Button } from "@/components/ui/button-custom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { PreorderModal } from "./PreorderModal";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-display font-bold tracking-[0.2em] text-white">
          AUREX<span className="text-primary">.</span>MOTORS
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {["Features", "Specs", "Performance"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <PreorderModal>
            <Button variant="outline" size="sm" className="px-6">
              Pre-Order Now
            </Button>
          </PreorderModal>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-t border-white/10 p-6 md:hidden flex flex-col space-y-4">
          {["Features", "Specs", "Performance"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-lg uppercase tracking-widest text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <PreorderModal>
            <Button variant="neon" className="w-full">
              Pre-Order Now
            </Button>
          </PreorderModal>
        </div>
      )}
    </nav>
  );
}
