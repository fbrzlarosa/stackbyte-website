import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="py-20 border-t border-white/10 bg-black/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <Link href="/" className="mb-6 block w-40 hover:opacity-80 transition-opacity">
              <Logo className="w-full h-auto" />
            </Link>
            <p className="text-gray-400 max-w-sm">
              Crafting efficient, scalable, and elegant solutions in software & web.
              Based in Lucca, IT.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white">Services</h4>
            <ul className="space-y-4 text-gray-400">
              {/* The ID #services is the container for the skill showcase */}
              <li><Link href="#services" className="hover:text-primary transition-colors">Websites</Link></li>
              <li><Link href="#services" className="hover:text-primary transition-colors">Backend</Link></li>
              <li><Link href="#services" className="hover:text-primary transition-colors">Web3</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Connect</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="#contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="https://github.com" target="_blank" className="hover:text-primary transition-colors">GitHub</Link></li>
              <li><Link href="https://linkedin.com" target="_blank" className="hover:text-primary transition-colors">LinkedIn</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-sm text-gray-500">
          <p>© 2025 Fabrizio La Rosa. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
