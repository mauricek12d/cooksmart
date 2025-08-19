import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Sparkles, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

const quickActions = [
  { title: "Upload Pantry",  description: "Snap a photo of your ingredients", icon: Camera,   href: "/pantry"   },
  { title: "Generate Meals", description: "AI-powered recipe suggestions",    icon: Sparkles, href: "/generate" },
  { title: "Weekly Planner", description: "Plan your meals for the week",     icon: Calendar, href: "/planner"  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-6">
        {/* Hero */}
        <section className="py-20 lg:py-28 max-w-5xl mx-auto text-center">
          <Hero />
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl md:text-4xl font-bold">
              Everything you need to cook smarter
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              From pantry management to meal planning, CookSmart handles it all
            </p>
          </div>

          {/* ✅ Always 1 col on mobile, 2 at 640px, 3 at 768px+ */}
          <div className="mx-auto w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 min-[768px]:grid-cols-3 gap-6 xl:gap-8">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href} className="contents">
                <Card className="h-full cursor-pointer border-gray-800 bg-gray-900 transition-colors hover:bg-gray-800">
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/10 transition-colors group-hover:bg-purple-600/20">
                      <action.icon className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-white">{action.title}</h3>
                    <p className="mb-4 text-gray-400">{action.description}</p>
                    <div className="flex items-center justify-center text-purple-400">
                      <span className="text-sm font-medium">Learn more</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
