"use client";

import { motion } from "framer-motion";
import {
  Camera,
  PenTool,
  Layout,
  Building2,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import PricingPage from "./pricing/page";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const features = [
  {
    icon: Camera,
    title: "360° Virtual Tours",
    description:
      "Create immersive virtual experiences of your architectural projects with high-quality 360° tours.",
  },
  {
    icon: PenTool,
    title: "Design Tools",
    description:
      "Advanced tools for architectural visualization and project presentation.",
  },
  {
    icon: Layout,
    title: "Project Management",
    description:
      "Streamline your workflow with integrated project management tools.",
  },
  {
    icon: Building2,
    title: "BIM Integration",
    description:
      "Seamlessly integrate with BIM software for comprehensive project visualization.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <nav className="absolute top-0 w-full z-50 bg-white/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-2">
                <Camera className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Arch360</span>
              </div>
              <div className="hidden md:flex items-center gap-8">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-600 hover:text-gray-900"
                >
                  How it Works
                </a>
                <a
                  href="#pricing"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Pricing
                </a>
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <Button
                    onClick={() => router.push("/studio")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Studio
                  </Button>
                  <UserButton />
                </SignedIn>

                {/* <button onClick={()=>router.push('/sign-up')} className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                  Get Started
                </button> */}
              </div>
            </div>
          </div>
        </nav>

        <div className="pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Transform Your Architectural Vision Into Virtual Reality
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create stunning 360° virtual tours and leverage powerful tools
                designed specifically for architects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-100 text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <Image
              src="/api/placeholder/1200/600"
              alt="Platform Preview"
              className="w-full h-auto"
              width={1200}
              height={600}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </motion.div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Tools for Architects
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to showcase and manage your architectural
              projects
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in minutes with our simple workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Content",
                description:
                  "Upload your 360° photos or 3D models directly to our platform.",
              },
              {
                step: "02",
                title: "Customize Your Tour",
                description:
                  "Add hotspots, information points, and customize the viewer experience.",
              },
              {
                step: "03",
                title: "Share & Collaborate",
                description:
                  "Share your virtual tours with clients and collaborate with team members.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="text-4xl font-bold text-blue-600 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 text-gray-400 h-8 w-8" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <PricingPage />

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Architectural Projects?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of architects already using our platform
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
