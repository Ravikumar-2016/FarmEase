import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center">
      <div className="container mx-auto px-4 z-10">
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-2xl">
          <h1 className="text-5xl font-bold text-primary mb-4">Revolutionizing Agriculture</h1>
          <p className="text-xl text-gray-700 mb-8">Empowering farmers with cutting-edge technology and sustainable practices</p>
          <div className="flex space-x-4">
            <Link href="/signup">
              <Button size="lg" className="bg-primary text-white hover:bg-primary-dark">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Image 
        src="/hero-bg.jpg" 
        alt="Modern farming landscape" 
        fill 
        className="object-cover"
        priority
      />
    </section>
  )
}