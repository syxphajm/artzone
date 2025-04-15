import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with ArtZone</h2>
          <p className="mb-6">
            Subscribe to our newsletter to receive updates on new artworks, exhibitions, and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-primary-foreground text-primary"
              required
            />
            <Button variant="secondary">Subscribe</Button>
          </form>
        </div>
      </div>
    </section>
  )
}

