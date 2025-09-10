import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, useAnimation } from "framer-motion";

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
  const buttonControls = useAnimation();

  const handleButtonClick = async () => {
    await buttonControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1 },
    }),
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
            DailyHelper
          </h1>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto text-blue-300">
            Your all-in-one student companion to organize, plan, and thrive.
            Built for the modern student life.
          </p>
          <motion.div animate={buttonControls} className="mt-8">
            <Button
              asChild
              onClick={handleButtonClick}
              className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 px-6 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
            >
              <a href="/dashboard">
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 w-full">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
          Everything You Need to Succeed
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {features.map((feature, i) => (
            <motion.div
              key={feature.name}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden">
                <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
                <CardHeader className="flex flex-row items-center gap-4 p-6 relative z-10">
                  <span
                    className={`text-3xl p-3 rounded-full ${feature.accent}`}
                  >
                    {feature.icon}
                  </span>
                  <CardTitle className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                    {feature.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 relative z-10">
                  <p className="mb-4 min-h-[80px] text-blue-300 opacity-80">
                    {feature.desc}
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                  >
                    <a href={feature.path}>
                      <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                        Explore {feature.name}
                      </span>
                      <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-4 py-12 w-full">
        <Card className="bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
          <CardHeader className="p-6 relative z-10">
            <CardTitle className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
              Why DailyHelper?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 relative z-10">
            <ul className="list-disc pl-6 space-y-3 text-blue-300 opacity-80">
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
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              asChild
            >
              <a href="/about">
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                  Learn More
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="px-4 py-16 text-center w-full">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
          Ready to Simplify Your Student Life?
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8 text-blue-300 opacity-80">
          Join thousands of students who are staying organized and thriving with
          DailyHelper.
        </p>
        <motion.div animate={buttonControls}>
          <Button
            asChild
            onClick={handleButtonClick}
            className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 px-8 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group"
          >
            <a href="/res">
              <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
              </span>
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
            </a>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
