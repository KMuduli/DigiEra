import React, { useState, useEffect } from 'react';
import SEOHead from '../../components/SEOHead';
import { Mail, MapPin, Phone } from 'lucide-react';
import api from '../../api/api';
import Spinner from '../../components/Spinner';

const About = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await api.get('/pages/about');
        setContent(res.data.page.content);
      } catch (err) {
        // Fallback to static if not set up in CMS
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="bg-slate-50 min-h-screen pt-20 pb-24">
      <SEOHead 
        title="About Us | DigitalEra" 
        description="Learn more about DigitalEra and our mission to provide cutting-edge technology content." 
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Driving the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Digital Insight</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            DigitalEra is a premier platform dedicated to empowering developers, engineers, and tech enthusiasts with cutting-edge knowledge on web development, programming, and software architecture.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 mb-16">
          {content ? (
            <div 
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                We believe that technology evolves incredibly fast...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
