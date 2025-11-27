import { Sparkles } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="pt-12 pb-20 sm:py-16 md:py-20 border-t border-white/10 bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="col-span-2 md:col-span-2">
            <Link
              href="/"
              className="mb-4 sm:mb-6 block w-32 sm:w-40 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Logo className="w-full h-auto" />
            </Link>
            <p className="text-sm sm:text-base text-gray-400 max-w-sm">
              Crafting efficient, scalable, and elegant solutions in software &
              web. Based in Lucca, IT.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-white text-sm sm:text-base">
              Explore
            </h4>
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-400">
              <li>
                <Link
                  href="#about"
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  My Story
                </Link>
              </li>
              <li>
                <Link
                  href="#process"
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  How I Work
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Expertise
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-white text-sm sm:text-base">
              Connect
            </h4>
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-400">
              <li>
                <Link
                  href="#contact"
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_SOCIAL_GITHUB || "#"}
                  target="_blank"
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "#"}
                  target="_blank"
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_SOCIAL_DEVTO || "#"}
                  target="_blank"
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Dev.to
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-8 border-t border-white/10 text-xs sm:text-sm text-gray-500 gap-6">
          <p className="text-left">
            © 2025 Fabrizio La Rosa. All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-xs font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-colors">
              <span className="text-gray-400">100%</span>
              <span className="bg-linear-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient bg-size-[200%_auto] font-bold">
                Prompt Engineered
              </span>
              <Sparkles className="w-3 h-3 text-pink-500 animate-pulse" />
            </div>

            <a
              href={`https://www.iubenda.com/privacy-policy/${
                process.env.NEXT_PUBLIC_IUBENDA_POLICY_ID || ""
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
