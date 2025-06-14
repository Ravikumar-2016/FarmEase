'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="py-4 bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">Field Grower</Link>
        <nav className="hidden md:flex space-x-8">
          <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-primary">Features</button>
          <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-primary">About</button>
          <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-primary">Contact</button>
        </nav>
        <Button>Get Started</Button>
      </div>
    </header>
  )
}