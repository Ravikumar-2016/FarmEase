import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
            <h2 className="text-4xl font-bold mb-6">About Field Grower</h2>
            <p className="text-lg text-gray-700 mb-6">
              Field Grower is at the forefront of agricultural innovation, combining cutting-edge technology with sustainable farming practices. Our mission is to empower farmers worldwide, enhancing crop yields while preserving our planet&apos;s resources.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              With a team of expert agronomists, data scientists, and technology specialists, we provide comprehensive solutions that address the complex challenges of modern agriculture. From precision farming techniques to AI-driven crop management, Field Grower is shaping the future of food production.
            </p>
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
              Learn More
            </Button>
          </div>
          <div className="lg:w-1/2">
            <Image
              src="/Farm-Management.png"
              alt="Illustration of Field Grower technology"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
