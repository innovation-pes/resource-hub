import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, GraduationCap, Library } from "lucide-react";

import logo from "@/assets/pesitmlogo.png";
import bgImage from "@/assets/bg.png";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f8] via-white to-[#fef5f2] relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.12, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <motion.img
          src={bgImage}
          alt="Background"
          className="w-full h-full object-cover"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/75 to-white/70 z-0" />

      {/* Dark blue accent shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-destructive/5 rounded-full blur-3xl z-0" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-4 border-b border-primary/10 bg-white/70 backdrop-blur-md shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src={logo} alt="PESITM" className="h-16 md:h-20" />
            </motion.div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 text-accent border border-accent/30">
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm font-medium">For PESITM Students</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
                AI Academic Resource Hub
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground">
                Find the best curated resources for your subjects instantly. Access
                handpicked videos, articles, and code repositories tailored to your
                curriculum.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-3 px-12 py-5 rounded-xl bg-gradient-to-r from-primary to-[#2d3a6e] text-white hover:shadow-2xl transition-all shadow-lg shadow-primary/30 text-lg font-semibold"
              >
                <span>Get Started</span>
                <ArrowRight className="w-6 h-6" />
              </motion.button>

              {/* Stats */}
              <div className="flex gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Resources</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Subjects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">10+</div>
                  <div className="text-sm text-muted-foreground">Departments</div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid gap-6"
            >
              {[
                {
                  icon: BookOpen,
                  title: "Curated Content",
                  description:
                    "Carefully selected resources by faculty and top students",
                  color: "primary",
                },
                {
                  icon: Library,
                  title: "Organized Learning",
                  description:
                    "Resources structured by department, semester, subject, module, and topic",
                  color: "accent",
                },
                {
                  icon: GraduationCap,
                  title: "Exam Ready",
                  description:
                    "Focus on what matters with curriculum-aligned materials",
                  color: "destructive",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl hover:border-primary/20 transition-all"
                >
                  <div
                    className={`inline-flex p-3 rounded-xl mb-4 ${
                      feature.color === "primary"
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : feature.color === "accent"
                        ? "bg-accent/10 text-accent border border-accent/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl mb-2 text-primary font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-primary/10 mt-24 py-8 bg-white/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
            <p>© 2026 PESITM - Education for the Real World</p>
          </div>
        </footer>
      </div>
    </div>
  );
}