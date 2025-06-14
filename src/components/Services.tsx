export default function Services() {
    return (
      <section id="services" className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Consultation Services</h3>
              <p>
                Our expert team offers personalized consultation to help you assess your specific needs and develop
                tailored solutions for your farming practices.
              </p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Crop Management Solutions</h3>
              <p>
                Comprehensive services that include soil analysis, crop rotation planning, and pest control strategies to
                maximize yield and maintain sustainable practices.
              </p>
            </div>
            {/* Add more service blocks here */}
          </div>
        </div>
      </section>
    )
  }
  
  