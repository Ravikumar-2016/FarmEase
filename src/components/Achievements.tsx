export default function Achievements() {
    return (
      <section id="achievements" className="bg-green-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Achievements and Awards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Excellence in Agricultural Innovation</h3>
              <p>
                Awarded for pioneering sustainable farming practices that enhance crop yield and reduce environmental
                impact. Recognized for implementing cutting-edge technologies in agriculture.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Best Sustainable Farm of the Year</h3>
              <p>
                Honoring our commitment to sustainability, this award celebrates our innovative approaches to resource
                management, including water conservation and organic farming methods.
              </p>
            </div>
            {/* Add more achievement blocks here */}
          </div>
        </div>
      </section>
    )
  }
  
  