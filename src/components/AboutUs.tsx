export default function AboutUs() {
  return (
    <section id="aboutus" className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-green-800 mb-8">About Us</h2>
        <p className="mb-6">
          Welcome to <strong>Field Grower</strong> – your trusted partner in modern, sustainable farming. Founded with a
          vision to revolutionize agriculture, Field Grower empowers farmers and agribusinesses with innovative
          solutions and cutting-edge technologies that improve productivity, efficiency, and environmental
          sustainability.
        </p>

        <h3 className="text-2xl font-bold text-green-700 mb-4">Our Vision</h3>
        <p className="mb-6">
          To lead the future of sustainable agriculture through advanced technology, empowering every farmer to
          cultivate smarter, greener, and more profitable fields.
        </p>

        <h3 className="text-2xl font-bold text-green-700 mb-4">Our Core Values</h3>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            <strong>Innovation</strong>: We&apos;re dedicated to bringing you the latest advancements in agricultural technology.
          </li>
          <li>
            <strong>Sustainability</strong>: We promote farming practices that protect natural resources for future generations.
          </li>
          <li>
            <strong>Community</strong>: We believe in building strong relationships with the farming community and offering support every step of the way.
          </li>
          <li>
            <strong>Excellence</strong>: We are committed to quality and reliability in everything we do, from our products to our customer service.
          </li>
        </ul>

        {/* You can insert more custom sections or call-to-action buttons here if needed */}
      </div>
    </section>
  )
}
