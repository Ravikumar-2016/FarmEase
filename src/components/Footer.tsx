import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Field Grower</h3>
            <p>Innovative agricultural solutions for a sustainable future.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features">Features</Link>
              </li>
              <li>
                <Link href="#about">About Us</Link>
              </li>
              <li>
                <Link href="#contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p>Email: info@fieldgrower.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; 2023 Field Grower. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

