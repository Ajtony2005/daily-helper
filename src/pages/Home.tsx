import { motion } from "framer-motion";
import {
  CheckSquare,
  CreditCard,
  ShoppingCart,
  UtensilsCrossed,
  Book,
  Heart,
  Package,
  Star,
  Zap,
  Lock,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const features = [
  {
    icon: CheckSquare,
    title: "To-Do",
    description:
      "Organize tasks and boost productivity with smart task management.",
    href: "/todo",
  },
  {
    icon: CreditCard,
    title: "Finance",
    description: "Track expenses and manage your budget effortlessly.",
    href: "/finance",
  },
  {
    icon: ShoppingCart,
    title: "Shopping",
    description: "Create and manage shopping lists for your needs.",
    href: "/shopping",
  },
  {
    icon: UtensilsCrossed,
    title: "Meals",
    description: "Plan your meals and stay organized with meal tracking.",
    href: "/meals",
  },
  {
    icon: Book,
    title: "Recipes",
    description: "Save and organize your favorite recipes in one place.",
    href: "/recipes",
  },
  {
    icon: Heart,
    title: "Wellness",
    description: "Monitor your health and wellness goals daily.",
    href: "/wellness",
  },
  {
    icon: Package,
    title: "Inventory",
    description: "Keep track of items and manage your inventory.",
    href: "/inventory",
  },
  {
    icon: Star,
    title: "Wishlist",
    description: "Curate and organize your wishlist items.",
    href: "/wishlist",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance for instant access to your data.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your data is encrypted and stored securely.",
  },
  {
    icon: Smartphone,
    title: "Fully Responsive",
    description: "Works seamlessly on all devices and screen sizes.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function HomePage() {
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Welcome Tag */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-block"
          >
            <div className="rounded-full bg-gradient-to-r from-accent/20 to-accent/10 px-4 py-1.5 backdrop-blur-sm border border-accent/20">
              <span className="text-sm font-medium text-accent">
                Welcome to DailyHelper
              </span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance text-foreground"
          >
            Your All-in-One Productivity Companion
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-10 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Manage tasks, finances, shopping lists, meals, recipes, wellness,
            inventory, and wishlists all in one intuitive platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/dashboard">
              <Button
                size="lg"
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToFeatures}
              className="cursor-pointer bg-transparent"
            >
              Learn More
            </Button>
          </motion.div>
        </div>

        {/* Background Gradient Accent */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent/10 to-accent/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold sm:text-4xl mb-4 text-foreground">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg">
              Comprehensive tools for every aspect of your life
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={item}
                  whileHover={{ y: -4 }}
                  className="group relative"
                >
                  <Link to={feature.href}>
                    <div className="relative h-full rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:bg-card hover:border-accent/50 cursor-pointer overflow-hidden">
                      {/* Gradient background on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative z-10">
                        <div className="mb-4 inline-flex p-3 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10">
                          <IconComponent className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20 sm:py-32 bg-card/30 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold sm:text-4xl mb-4 text-foreground">
              Why Choose DailyHelper?
            </h2>
            <p className="text-muted-foreground text-lg">
              Built with quality and user experience in mind
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {benefits.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={item}
                  className="rounded-xl border border-border bg-card p-8 text-center"
                >
                  <div className="mb-4 inline-flex p-4 rounded-lg bg-gradient-to-br from-accent/30 to-accent/10">
                    <IconComponent className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-3 text-lg">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold sm:text-4xl mb-4 text-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of users who are already mastering their
              productivity
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/todo">
              <Button
                size="lg"
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Start Today
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Background Gradient Accent */}
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-bl from-accent/20 to-accent/5 rounded-full blur-3xl -z-10" />
      </section>
    </main>
  );
}
