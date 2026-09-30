import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Building2,
  Sparkles
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userType: 'client',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            We're Here to Help
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Have questions about listing a hoarding or planning your next campaign across Pune? Contact our operations and support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
              <h3 className="text-xl font-bold tracking-tight">Contact Information</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect with our local team in Pune for enterprise campaigns or listing assistance.
              </p>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Pune Operations HQ</strong>
                    <span className="text-slate-400">402, Trade Center, FC Road, Shivajinagar, Pune, Maharashtra 411004</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Email Support</strong>
                    <span className="text-slate-400">support@flashads.in</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Direct Helpline</strong>
                    <span className="text-slate-400">+91 (020) 2553-ADVERT (Mon–Sat 9AM–7PM)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Median Response Time: &lt; 2 Hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm">
              {isSubmitted ? (
                <div className="py-12 text-center max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Received!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-6">
                    Thank you for contacting FlashAds. Our Pune operations team will get in touch with you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', userType: 'client', subject: '', message: '' });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Kulkarni"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rahul@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98220 00000"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        I am a...
                      </label>
                      <select
                        value={formData.userType}
                        onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:border-blue-500 focus:outline-none bg-slate-50/50 cursor-pointer"
                      >
                        <option value="client">Business / Advertiser looking to book</option>
                        <option value="advertiser">Board Owner / Hoarding Operator</option>
                        <option value="agency">Advertising Agency</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Inquiring about FC Road hoardings for October"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Message Details *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your target location, dates, or board specs..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none bg-slate-50/50"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
