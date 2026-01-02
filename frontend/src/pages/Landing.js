import { Link } from 'react-router-dom';
import { Search, MapPin, Award, Shield, TrendingUp, Users } from 'lucide-react';
import { Button } from '../components/ui/button';

const Landing = ({ user }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-outfit text-primary">ACCIO</span>
          </div>
          <div className="flex gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button data-testid="dashboard-btn" className="bg-primary text-white hover:bg-primary/90 h-11 px-8 rounded-full font-medium">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button data-testid="login-btn" variant="outline" className="h-11 px-8 rounded-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button data-testid="register-btn" className="bg-primary text-white hover:bg-primary/90 h-11 px-8 rounded-full font-medium shadow-lg shadow-blue-900/20">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 opacity-95"></div>
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1763890763432-17c9a529da20?crop=entropy&cs=srgb&fm=jpg&q=85" 
            alt="Students walking on campus"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 font-outfit">
              Lost Something?
              <br />
              <span className="text-accent">Accio</span> It Back!
            </h1>
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-10">
              College Lost & Found made simple. Report, browse, and recover items with AI-powered matching. Your campus community helping each other, one item at a time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button data-testid="hero-get-started-btn" className="bg-secondary text-white hover:bg-secondary/90 h-14 px-10 rounded-full font-medium text-lg shadow-lg shadow-orange-500/30 transition-transform hover:scale-105">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/browse-lost">
                <Button data-testid="browse-items-btn" variant="outline" className="h-14 px-10 rounded-full font-medium text-lg bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">
                  Browse Items
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-4 font-outfit">How ACCIO Works</h2>
            <p className="text-lg text-slate-600">Simple, secure, and smart lost & found system</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div data-testid="feature-report" className="p-8 bg-white rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3 font-outfit">Report Items</h3>
              <p className="text-slate-600 leading-relaxed">Lost or found something? Report it with photos, location, and description. Takes less than 2 minutes.</p>
            </div>
            <div data-testid="feature-match" className="p-8 bg-white rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3 font-outfit">AI Matching</h3>
              <p className="text-slate-600 leading-relaxed">Our AI compares photos and details to suggest potential matches. Smart technology, human connection.</p>
            </div>
            <div data-testid="feature-connect" className="p-8 bg-white rounded-3xl border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3 font-outfit">Connect & Recover</h3>
              <p className="text-slate-600 leading-relaxed">Chat securely in-app to verify and arrange return. Earn points and badges for helping others.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1758270705639-9727f350f026?crop=entropy&cs=srgb&fm=jpg&q=85"
                alt="Students taking selfie"
                className="rounded-3xl shadow-2xl"
              />
            </div>
            <div>
              <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
                TRUSTED BY STUDENTS
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6 font-outfit">Built for Your Campus Community</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                ACCIO is designed with student safety and privacy in mind. No phone numbers shared, all communication happens securely in-app. Join hundreds of students already reuniting with their belongings.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-slate-700 font-medium">100% Secure & Private Communication</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-slate-700 font-medium">Earn Points & Badges for Helping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-outfit">Ready to Reunite?</h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">Join your campus community and help recover lost items today.</p>
          <Link to="/register">
            <Button data-testid="cta-register-btn" className="bg-secondary text-white hover:bg-secondary/90 h-14 px-10 rounded-full font-medium text-lg shadow-lg shadow-orange-500/30 transition-transform hover:scale-105">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white font-outfit">ACCIO</span>
              </div>
              <p className="text-sm">College Lost & Found platform powered by AI.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/browse-lost" className="hover:text-white transition-colors">Browse Lost Items</Link>
                <Link to="/browse-found" className="hover:text-white transition-colors">Browse Found Items</Link>
                <Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
              </div>
            </div>
          </div>
          <div className="text-center text-sm pt-8 border-t border-slate-800">
            © 2024 ACCIO. Built for college communities.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
