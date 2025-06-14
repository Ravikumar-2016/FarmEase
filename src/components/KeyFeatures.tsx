export default function KeyFeatures() {
    return (
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Key Features of Field Grower</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-green-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Optimized Environment for Plant Growth</h3>
              <p>
                <strong>Tailored Conditions:</strong> Provides custom environmental settings, ensuring plants grow under
                ideal conditions based on crop requirements.
              </p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Guidance for Farmers</h3>
              <p>
                <strong>Plant Growth Schedule:</strong> Offers a detailed schedule for each stage of plant growth, helping
                farmers track progress and anticipate care steps.
              </p>
              <p>
                <strong>Pesticide and Fertilizer Recommendations:</strong> Recommends the best pesticides and fertilizers
                based on crop type, season, and soil conditions.
              </p>
            </div>
            {/* Add more feature blocks here */}
          </div>
        </div>
      </section>
    )
  }
  
  