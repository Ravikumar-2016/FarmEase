import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farm?</h2>
        <p className="text-xl mb-8">
          Join thousands of farmers who are already benefiting from our innovative solutions.
        </p>
        <Button variant="secondary" size="lg">
          Schedule a Demo
        </Button>
      </div>
    </section>
  )
}

