'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, RefreshCw, HeadphonesIcon, Globe, FileSearch, Building2 } from 'lucide-react';

const trustItems = [
  {
    icon: ShieldCheck,
    title: 'Trade Assurance',
    desc: 'Your payments are protected. Get quality products or your money back.',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    desc: 'Hassle-free returns within 30 days of delivery.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    desc: 'Multi-language support team ready to help anytime.',
  },
  {
    icon: Globe,
    title: 'Global Logistics',
    desc: 'End-to-end shipping solutions to 190+ countries.',
  },
  {
    icon: FileSearch,
    title: 'Supplier Verification',
    desc: 'All suppliers are thoroughly vetted and audited.',
  },
  {
    icon: Building2,
    title: 'On-Site Inspection',
    desc: 'Independent inspection services for quality assurance.',
  },
];

export function TrustIndicators() {
  return (
    <section className="py-20 sm:py-28 bg-apple-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-xs font-semibold text-apple-blue uppercase tracking-[0.2em] mb-3">Why Choose Us</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-apple-gray-900 mb-4">
            Trade with Confidence
          </h2>
          <p className="text-base sm:text-lg text-apple-gray-400 max-w-2xl mx-auto">
            We provide end-to-end protection and support for every transaction on our platform.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="p-6 sm:p-8 bg-white rounded-[20px] border border-apple-gray-100 ios-shadow-sm hover:border-apple-blue/20 apple-transition"
              >
                <div className="w-11 h-11 rounded-[12px] bg-apple-blue-light flex items-center justify-center mb-4">
                  <Icon size={22} className="text-apple-blue" />
                </div>
                <h3 className="text-base font-semibold text-apple-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-apple-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
