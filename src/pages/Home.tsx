import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const features = [
  {
    name: "Finance",
    path: "/finance",
    desc: "Track expenses, visualize spending, and get weekly/monthly insights to manage your budget like a pro.",
    icon: "💸",
    accent: "bg-gradient-to-br from-teal-500 to-teal-700",
  },
  {
    name: "Inventory",
    path: "/inventory",
    desc: "Keep tabs on dorm essentials, avoid overstocking, and streamline your supplies.",
    icon: "📦",
    accent: "bg-gradient-to-br from-purple-500 to-purple-700",
  },
  {
    name: "Shopping",
    path: "/shopping",
    desc: "Smart shopping lists synced with your inventory for hassle-free grocery runs.",
    icon: "🛒",
    accent: "bg-gradient-to-br from-pink-500 to-pink-700",
  },
  {
    name: "Meals",
    path: "/meals",
    desc: "Plan breakfast, lunch, dinner, and snacks for the week with nutrition tracking.",
    icon: "🍽️",
    accent: "bg-gradient-to-br from-orange-500 to-orange-700",
  },
  {
    name: "To-Do",
    path: "/todo",
    desc: "Organize tasks with priorities and deadlines to stay on top of your studies.",
    icon: "✅",
    accent: "bg-gradient-to-br from-green-500 to-green-700",
  },
  {
    name: "Recipes",
    path: "/recipes",
    desc: "Store and explore recipes to cook delicious meals tailored to your ingredients.",
    icon: "📖",
    accent: "bg-gradient-to-br from-blue-500 to-blue-700",
  },
  {
    name: "Wellness",
    path: "/wellness",
    desc: "Track vitamins, workouts, and get weather-based daily prep tips.",
    icon: "💪",
    accent: "bg-gradient-to-br from-red-500 to-red-700",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-appBackground dark:bg-appBackground-dark text-card-foreground dark:text-card-darkForeground transition-colors duration-500">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-500 dark:from-primary-300 dark:to-secondary-400">
          DailyHelper
        </h1>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto text-card-foreground dark:text-card-darkForeground opacity-80">
          Your all-in-one student companion to organize, plan, and thrive. Built
          for the modern student life.
        </p>
        <Button
          asChild
          className="mt-8 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-soft"
        >
          <a href="/dashboard">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 w-full">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-card-foreground dark:text-card-darkForeground">
          Everything You Need to Succeed
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {features.map((feature) => (
            <Card
              key={feature.name}
              className="bg-card-glass dark:bg-card-glass-dark backdrop-blur-lg border border-border dark:border-border-dark rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <span className={`text-3xl p-3 rounded-full ${feature.accent}`}>
                  {feature.icon}
                </span>
                <CardTitle className="text-xl font-semibold text-card-foreground dark:text-card-darkForeground">
                  {feature.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 min-h-[80px] text-card-foreground dark:text-card-darkForeground opacity-80">
                  {feature.desc}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-colors"
                >
                  <a href={feature.path}>Explore {feature.name}</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-4 py-12 w-full bg-card-glass dark:bg-card-glass-dark">
        <Card className="w-full bg-card-glass dark:bg-card-glass-dark backdrop-blur-lg border border-border dark:border-border-dark rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary-400 dark:text-primary-300">
              Why DailyHelper?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-3 text-card-foreground dark:text-card-darkForeground opacity-80">
              <li>All-in-one dashboard tailored for student life</li>
              <li>Modern, responsive, and visually stunning design</li>
              <li>
                Smart integrations: sync inventory with shopping, meals with
                recipes, and more
              </li>
              <li>Personalized insights and automated reminders via email</li>
              <li>
                Powered by cutting-edge tech: Vite, Tailwind CSS, Shadcn UI, and
                Firebase
              </li>
            </ul>
            <Button
              className="mt-6 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-full shadow-soft"
              asChild
            >
              <a href="/about">Learn More</a>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="px-4 py-16 text-center w-full">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-card-foreground dark:text-card-darkForeground">
          Ready to Simplify Your Student Life?
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8 text-card-foreground dark:text-card-darkForeground opacity-80">
          Join thousands of students who are staying organized and thriving with
          DailyHelper.
        </p>
        <Button
          asChild
          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-soft"
        >
          <a href="/signup">
            Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </section>
    </div>
  );
}
