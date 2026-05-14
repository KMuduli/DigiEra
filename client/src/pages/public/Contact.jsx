import React, { useState, useEffect } from 'react';
import SEOHead from '../../components/SEOHead';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import api from '../../api/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await api.get('/pages/contact');
        setContent(res.data.page.content);
      } catch (err) {}
    };
    fetchPage();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="bg-slate-50 min-h-screen pt-20 pb-24">
      <SEOHead 
        title="Contact Us | DigitalEra" 
        description="Get in touch with the DigitalEra team for inquiries, feedback, or collaborations." 
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Connect</span>
          </h1>
          {content ? (
            <div 
              className="prose prose-slate text-lg mx-auto"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Have a question, feedback, or looking to collaborate? Drop us a line below and our team will get back to you as soon as possible.
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-6 text-xl tracking-tight">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 mr-4">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Email Us</p>
                    <p className="text-sm text-slate-500">hello@digitalera.test</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-violet-50 p-3 rounded-full text-violet-600 mr-4">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Call Us</p>
                    <p className="text-sm text-slate-500">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-emerald-50 p-3 rounded-full text-emerald-600 mr-4">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Headquarters</p>
                    <p className="text-sm text-slate-500">123 Tech Boulevard<br/>San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-6 text-xl tracking-tight">Send a Message</h3>
              
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-6 rounded-2xl text-center space-y-3">
                  <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Send className="text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-lg">Message Sent!</h4>
                  <p className="text-sm">Thank you for reaching out. We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Your Name</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Your Email</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                        placeholder="john@example.com" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Message</label>
                    <textarea 
                      name="message"
                      rows="5" 
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none" 
                      placeholder="How can we help you today?" 
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 tracking-wide text-white font-black py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center">
                    <Send size={18} className="mr-2" /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
