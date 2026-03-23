import { SectionWrapper } from "./layout/SectionWrapper"
import { Container } from "./layout/Container"
import { HeadingBlock } from "./layout/HeadingBlock"
import { Card } from "@/components/ui/card"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "Linear",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=sarah",
    testimonial: "Plixa has completely transformed how our distributed team communicates. We sketch out ideas synchronously without ever feeling blocked by latency."
  },
  {
    name: "John Doe",
    role: "Staff Engineer",
    company: "Vercel",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=john",
    testimonial: "The architecture behind this canvas is a masterpiece. It handles hundreds of live cursors without dropping a single frame. Absolutely incredible engineering."
  },
  {
    name: "Emily Chen",
    role: "Lead UX Researcher",
    company: "Stripe",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=emily",
    testimonial: "We use Plixa for all our live user flow mapping. The infinite scaling and frictionless sharing makes it our default tool for every new project."
  }
]

function TestimonialDemo() {
  return (
    <SectionWrapper variant="default" id="testimonials">
      <Container>
        <HeadingBlock 
          badge="Wall of Love"
          title="Loved by the best teams."
          subtitle="Don't just take our word for it. See what top engineers and product leaders have to say about Plixa."
          align="center"
        />
        
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3 mt-16">
          {testimonials.map((t) => (
            <Card key={t.name} className="p-8 flex flex-col justify-between bg-card shadow-md rounded-2xl border-border/60 hover:border-primary/20 hover:-translate-y-2 transition-all duration-300">
              <p className="text-foreground leading-relaxed text-lg mb-8">&quot;{t.testimonial}&quot;</p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full border border-border bg-muted" />
                <div className="flex flex-col">
                  <span className="font-medium text-foreground tracking-tight">{t.name}</span>
                  <span className="text-sm text-muted-foreground">{t.role} at {t.company}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  )
}

export { TestimonialDemo }
