import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  FileText, 
  Share2, 
  Palette, 
  Download, 
  Star, 
  Shield, 
  Layout, 
  Menu, 
  X, 
  Github,
  Linkedin,
  Wand2,
  Brain,
  Zap,
  ScrollText
} from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: Brain,
    name: 'AI-Powered Resume Builder',
    description: 'Our intelligent AI analyzes job descriptions and your professional profiles to create perfectly tailored resumes.'
  },
  {
    icon: Wand2,
    name: 'Auto-Fill Magic',
    description: 'Seamlessly import your LinkedIn and GitHub profiles to automatically populate your resume with your latest achievements.'
  },
  {
    icon: Layout,
    name: 'Premium Templates',
    description: 'Choose from our collection of ATS-friendly, professionally designed templates that make your resume stand out.'
  },
  {
    icon: Zap,
    name: 'Real-time Optimization',
    description: 'Get instant suggestions and improvements as you build your resume, ensuring it matches job requirements perfectly.'
  },
  {
    icon: Share2,
    name: 'Smart Sharing',
    description: 'Share your resume with a custom link or make it public on your profile. Control who sees what with granular privacy settings.'
  },
  {
    icon: ScrollText,
    name: 'Multiple Versions',
    description: 'Create and manage multiple versions of your resume for different job applications, all in one place.'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer at Google',
    image: 'https://source.unsplash.com/random/100x100?woman,professional&1',
    content: 'The AI-powered resume builder is incredible! It analyzed my GitHub profile and created a perfect tech resume that helped me land my dream job at Google.'
  },
  {
    name: 'Michael Chen',
    role: 'Product Manager at Meta',
    image: 'https://source.unsplash.com/random/100x100?man,asian&2',
    content: 'The LinkedIn integration and auto-fill feature saved me hours. The smart suggestions helped me highlight achievements I would have otherwise missed.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'UX Designer at Apple',
    image: 'https://source.unsplash.com/random/100x100?woman,latina&3',
    content: 'The modern templates and real-time optimization features are game-changers. I love how it tailors my resume for each job application automatically!'
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              RizzumeIt!
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 transform -skew-y-12"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Create AI-Powered Resumes
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mt-2">
                That Get You Hired
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-gray-600">
              Let AI analyze your experience and job requirements to create the perfect resume. Import from LinkedIn & GitHub, customize with modern templates, and land your dream job faster.
            </p>
            <div className="mt-10 space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
              <Link
                to="/builder"
                className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                Build Your Resume Now
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-3 border border-gray-300 text-lg font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                Try For Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Powered by AI, Built for Success
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600">
              Everything you need to create professional, ATS-friendly resumes that stand out
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                    <div className="relative bg-white p-8 sm:p-10 rounded-lg">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-gray-900">
                        {feature.name}
                      </h3>
                      <p className="mt-4 text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Social Integration Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Import Your Professional Profile
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600">
              Connect your LinkedIn and GitHub profiles to automatically create a comprehensive resume
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-blue-500 transition-colors">
              <div className="flex items-center mb-6">
                <Linkedin className="h-8 w-8 text-blue-600" />
                <h3 className="ml-3 text-xl font-semibold">LinkedIn Integration</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <span>Import work experience and skills automatically</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <span>Extract professional achievements and recommendations</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <span>Keep your resume in sync with your LinkedIn profile</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-blue-500 transition-colors">
              <div className="flex items-center mb-6">
                <Github className="h-8 w-8 text-gray-900" />
                <h3 className="ml-3 text-xl font-semibold">GitHub Integration</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <span>Showcase your best projects and contributions</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <span>Highlight your technical skills and expertise</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <span>Display your open source contributions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Loved by Job Seekers
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600">
              Join thousands of professionals who landed their dream jobs using RizzumeIt
            </p>
          </div>
          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={testimonial.image}
                        alt={testimonial.name}
                      />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Land Your Dream Job?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Create your AI-powered resume in minutes
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-full text-blue-600 bg-white hover:bg-blue-50 transition-all duration-200"
            >
              Get Started Free
              <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                RizzumeIt!
              </span>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-600 transition-colors">
                About
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-600 transition-colors">
                Contact
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-600 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-600 transition-colors">
                Terms
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-100 pt-8">
            <p className="text-center text-gray-500">
              © {new Date().getFullYear()} RizzumeIt! All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Mobile Menu Component
function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <Link
            to="/login"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            Get Started
          </Link>
          <Link
            to="/builder"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            Create Resume
          </Link>
        </div>
      )}
    </div>
  );
}