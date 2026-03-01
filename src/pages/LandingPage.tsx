import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, CheckCircle2, ArrowRight, Zap, Shield, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-bold text-2xl">S</div>
          <span className="font-bold text-2xl tracking-tight">SchedForm</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-brand">Features</a>
          <a href="#pricing" className="hover:text-brand">Pricing</a>
          <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8">
            Frictionless <span className="text-brand">Booking</span> & <span className="text-brand-accent italic font-serif">Data Capture</span>
          </h1>
          <p className="text-xl text-gray-500 mb-12 leading-relaxed">
            The all-in-one platform to share booking links, collect structured data, and convert visitors into confirmed appointments in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard" className="btn-primary px-8 py-4 text-lg rounded-2xl flex items-center gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="btn-secondary px-8 py-4 text-lg rounded-2xl">
              View Demo Link
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-brand/5 blur-3xl rounded-full -z-10"></div>
          <img 
            src="https://picsum.photos/seed/dashboard/1200/800" 
            alt="Dashboard Preview" 
            className="rounded-[32px] shadow-2xl border border-gray-100 mx-auto"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Built for Conversion</h2>
            <p className="text-gray-500">Everything you need to qualify leads and book meetings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: '2-Minute Setup', desc: 'Go from zero to a live booking link in less time than it takes to make coffee.' },
              { icon: Calendar, title: 'Smart Scheduling', desc: 'Automated availability management with time-zone detection and buffer times.' },
              { icon: CheckCircle2, title: 'AI Form Builder', desc: 'Let our AI generate the perfect qualification form based on your meeting description.' },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-brand/5 rounded-2xl flex items-center justify-center text-brand mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6 bg-brand rounded-[48px] p-16 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to start booking?</h2>
            <p className="text-white/70 text-xl mb-12 max-w-2xl mx-auto">
              Join 10,000+ professionals who use SchedForm to streamline their appointment workflow.
            </p>
            <Link to="/dashboard" className="bg-white text-brand px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all inline-block">
              Create Your First Link
            </Link>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
        &copy; 2026 SchedForm. All rights reserved.
      </footer>
    </div>
  );
}
