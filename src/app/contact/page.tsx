'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22,1,0.36,1] } },
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="page-enter">
      {/* Page header */}
      <div className="site-max site-px pt-16 pb-12 border-b border-hairline">
        <motion.p className="eyebrow mb-4" variants={fadeUp} initial="hidden" animate="visible">
          Get in Touch
        </motion.p>
        <motion.h1
          className="font-display text-[3rem] md:text-[5.5rem] leading-[0.92] tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.22,1,0.36,1] }}
        >
          We&rsquo;d Love to<br />
          <em>Hear From You.</em>
        </motion.h1>
      </div>

      <div className="site-max site-px py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">

          {/* Contact details */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="space-y-12">
              <div>
                <p className="eyebrow mb-5">Reach Us</p>
                <div className="space-y-5">
                  {[
                    { label: 'Email', value: 'sales@nurhaus.ca', href: 'mailto:sales@nurhaus.ca' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-muted tracking-widest uppercase mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-display text-xl hover:text-accent transition-colors duration-300">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-display text-xl">{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-hairline pt-8">
                <p className="eyebrow mb-4">Response Time</p>
                <p className="text-sm text-smoke leading-relaxed max-w-sm">
                  We respond to all enquiries within 24 hours on business days. Email is the fastest way to reach us.
                </p>
              </div>

              <div className="border-t border-hairline pt-8">
                <p className="eyebrow mb-5">Follow</p>
                <div className="flex gap-6">
                  {['Instagram'].map((s) => (
                    <a key={s} href="#" className="text-sm text-smoke hover:text-ink transition-colors duration-300 relative group">
                      {s}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-400" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="border-t border-hairline pt-8">
                <p className="eyebrow mb-5">Hours</p>
                <div className="space-y-2">
                  {[
                    { day: 'Monday – Friday', time: '10:00 – 18:00 EST' },
                    { day: 'Saturday',        time: '10:00 – 14:00 EST' },
                    { day: 'Sunday',          time: 'Closed' },
                  ].map((h) => (
                    <div key={h.day} className="flex justify-between text-sm">
                      <span className="text-smoke">{h.day}</span>
                      <span className="text-ink">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
                  className="h-full flex flex-col justify-center text-center py-20"
                >
                  <div className="w-16 h-16 rounded-full border border-hairline flex items-center justify-center mx-auto mb-8">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4">Thank you.</h2>
                  <p className="text-smoke text-sm leading-relaxed max-w-xs mx-auto mb-8">
                    We&rsquo;ve received your message and will be in touch within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="text-xs text-accent hover:text-ink transition-colors uppercase tracking-widest"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="eyebrow mb-8">Send a Message</p>

                  {[
                    { id: 'name',    label: 'Full Name',    type: 'text',  required: true },
                    { id: 'email',   label: 'Email Address',type: 'email', required: true },
                  ].map((f) => (
                    <div key={f.id} className="relative">
                      <input
                        id={f.id}
                        type={f.type}
                        value={form[f.id as keyof typeof form]}
                        onChange={update(f.id)}
                        onFocus={() => setFocused(f.id)}
                        onBlur={() => setFocused(null)}
                        required={f.required}
                        placeholder={f.label}
                        className="input-luxury"
                      />
                      <div
                        className={`absolute bottom-0 left-0 h-px bg-accent transition-all duration-500 ease-expo ${focused === f.id ? 'w-full' : 'w-0'}`}
                      />
                    </div>
                  ))}

                  <div className="relative">
                    <select
                      id="subject"
                      value={form.subject}
                      onChange={update('subject')}
                      onFocus={() => setFocused('subject')}
                      onBlur={() => setFocused(null)}
                      className="input-luxury appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Topic</option>
                      {['Order Enquiry', 'Product Question', 'Returns & Exchanges', 'Press', 'Wholesale', 'Other'].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <div
                      className={`absolute bottom-0 left-0 h-px bg-accent transition-all duration-500 ease-expo ${focused === 'subject' ? 'w-full' : 'w-0'}`}
                    />
                    <svg className="absolute right-0 top-1/2 -translate-y-1/2 text-muted pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>

                  <div className="relative">
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={update('message')}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused(null)}
                      required
                      rows={5}
                      placeholder="Your message"
                      className="input-luxury resize-none"
                    />
                    <div
                      className={`absolute bottom-0 left-0 h-px bg-accent transition-all duration-500 ease-expo ${focused === 'message' ? 'w-full' : 'w-0'}`}
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full">
                    Send Message
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
