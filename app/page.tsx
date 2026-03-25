import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { FeaturedDSACourse } from "@/components/featured-dsa-course"
import { LandingMarquee } from "@/components/landing-marquee"
import { StatsCounter } from "@/components/stats-counter"
import { Courses } from "@/components/courses"
import { Features } from "@/components/features"
import { DSAVisualizerWrapper } from "@/components/dsa-visualizer-wrapper"
import { LearningPaths } from "@/components/learning-paths"
import { Testimonials } from "@/components/testimonials"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"
import { ScrollRobotWrapper } from "@/components/scroll-robot-wrapper"

import { getPlatformStats } from "@/app/actions/stats"

export default async function Home() {
  const stats = await getPlatformStats()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="h-[68px]" />
      <Hero />
      <FeaturedDSACourse />
      <LandingMarquee />
      <StatsCounter />
      <Courses />
      <Features stats={stats} />
      <DSAVisualizerWrapper />
      <LearningPaths />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer showCTA />
      <ScrollRobotWrapper />
    </main>
  )
}
