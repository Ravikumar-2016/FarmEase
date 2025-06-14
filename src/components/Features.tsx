import { Leaf, Droplet, Sun, Wind } from 'lucide-react'

const features = [
  { icon: Leaf, title: 'Sustainable Farming', description: 'Implement eco-friendly practices that reduce environmental impact and promote long-term agricultural sustainability.' },
  { icon: Droplet, title: 'Water Management', description: 'Optimize irrigation systems with smart sensors and AI-driven scheduling to conserve water and improve crop yields.' },
  { icon: Sun, title: 'Solar Integration', description: 'Harness renewable energy with cutting-edge solar technologies, reducing operational costs and carbon footprint.' },
  { icon: Wind, title: 'Climate Control', description: 'Maintain ideal growing conditions year-round with advanced climate control systems and predictive analytics.' },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Innovative Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}