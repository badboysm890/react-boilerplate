import { Link } from 'react-router-dom';
import {
  Sparkles,
  Brain,
  AlertTriangle,
  Lock,
  LineChart,
  UserPlus,
  Building2,
  ArrowRight,
  CheckCircle2,
  // Additional Icons
  Clock,
  DollarSign,
  ThumbsUp
} from 'lucide-react';

// Comparison data with other ATS systems
const comparisons = [
  {
    metric: 'Resume Parsing Accuracy',
    hyretrack: '98%',
    others: '75%',
    description: 'Advanced AI model trained on millions of resumes'
  },
  {
    metric: 'Skills Matching Precision',
    hyretrack: '95%',
    others: '70%',
    description: 'Context-aware skill extraction and matching'
  },
  {
    metric: 'Processing Time per Resume',
    hyretrack: '< 10 sec',
    others: '30-60 sec',
    description: 'Real-time analysis and instant results'
  },
  {
    metric: 'False Positive Rate',
    hyretrack: '< 2%',
    others: '15-20%',
    description: 'Reduced irrelevant candidate matches'
  }
];

// Use cases
const useCases = [
  {
    icon: Building2,
    title: 'Enterprise Hiring',
    description: 'Streamline high-volume recruitment with automated screening and ranking of candidates.',
    benefits: [
      'Process hundreds of resumes simultaneously',
      'Standardized evaluation criteria',
      'Bias-free candidate assessment'
    ]
  },
  {
    icon: UserPlus,
    title: 'Internal Mobility',
    description: 'Match existing employees with new internal opportunities based on skills and experience.',
    benefits: [
      'Retain top talent',
      'Promote career growth',
      'Reduce hiring costs'
    ]
  },
  {
    icon: LineChart,
    title: 'Talent Analytics',
    description: 'Gain insights into your candidate pool and make data-driven hiring decisions.',
    benefits: [
      'Skill gap analysis',
      'Market trends insights',
      'Hiring funnel optimization'
    ]
  }
];

// Pain points and solutions
const painPoints = [
  {
    icon: AlertTriangle,
    title: 'Traditional ATS Limitations',
    problems: [
      'Poor handling of PDF and image-based resumes',
      'Keyword matching without context',
      'High false rejection rates'
    ],
    solution: 'Advanced OCR and NLP for accurate parsing regardless of format'
  },
  {
    icon: Lock,
    title: 'Data Silos',
    problems: [
      'Disconnected talent pools across departments',
      'Duplicate candidate profiles',
      'Inconsistent evaluation criteria'
    ],
    solution: 'Unified talent database with cross-departmental visibility'
  },
  {
    icon: Brain,
    title: 'Manual Screening Burden',
    problems: [
      'Time-consuming resume review process',
      'Subjective evaluation bias',
      'Missed qualified candidates'
    ],
    solution: 'AI-powered screening with objective scoring and ranking'
  }
];

// ROI stats for the "Proven ROI" section
const roiStats = [
  {
    icon: Clock,
    value: '50%',
    label: 'Reduction in Time-to-Hire',
    description: 'Fill positions faster with automated workflows and streamlined screening.'
  },
  {
    icon: DollarSign,
    value: '30%',
    label: 'Lower Cost-per-Hire',
    description: 'Optimize budgets and resources with end-to-end automation.'
  },
  {
    icon: ThumbsUp,
    value: '90%',
    label: 'Candidate Satisfaction',
    description: 'Deliver a seamless and engaging candidate experience.'
  }
];

export default function CorporatesLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              HyreTrack
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900"
            >
              Sign In
            </Link>
            {/*
              Clear localStorage on click, then navigate to /corporates
            */}
            <Link
              to="/corporates"
              onClick={() => {
                localStorage.clear();
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-full text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all duration-200"
            >
              Try Now
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-8">
              Transform Your Hiring with
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mt-2">
                AI-Powered Talent Matching
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12">
              Stop struggling with outdated ATS systems. HyreTrack uses state-of-the-art AI 
              to match the right candidates with your roles, saving time and reducing hiring costs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* 
                "Get Started Free" in Hero -> Clear localStorage onClick
              */}
              <Link
                to="/corporates"
                onClick={() => {
                  localStorage.clear();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all duration-200"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#compare"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Comparison */}
      <div id="compare" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Industry-Leading Performance
            </h2>
            <p className="text-xl text-gray-600">
              See how HyreTrack compares to traditional ATS systems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {comparisons.map((comparison, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {comparison.metric}
                </h3>
                <div className="flex justify-between items-baseline mb-4">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      {comparison.hyretrack}
                    </div>
                    <div className="text-sm text-gray-500">HyreTrack</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-400">
                      {comparison.others}
                    </div>
                    <div className="text-sm text-gray-500">Others</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {comparison.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pain Points */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Common Challenges, Solved
            </h2>
            <p className="text-xl text-gray-600">
              We understand your hiring pain points and have built solutions to address them
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {painPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-6">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {point.title}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-red-600 mb-2">Problems:</h4>
                      <ul className="space-y-2">
                        {point.problems.map((problem, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-600">
                            <AlertTriangle className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                            {problem}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-green-600 mb-2">Our Solution:</h4>
                      <div className="flex items-start text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        {point.solution}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Every Hiring Need
            </h2>
            <p className="text-xl text-gray-600">
              Discover how HyreTrack can transform your recruitment process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-6">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {useCase.description}
                  </p>
                  <ul className="space-y-3">
                    {useCase.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Proven ROI Section (Impactful Design) */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Proven ROI & Seamless Integration
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              HyreTrack helps you reduce time-to-hire by up to 50% while significantly cutting your cost-per-hire.
              Our advanced analytics deliver unprecedented insights into your talent pipeline,
              so you can make data-driven decisions with total confidence.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {roiStats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-500 transition-colors text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-6 mx-auto">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold text-blue-600">
                    {item.value}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mt-2">
                    {item.label}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-16">
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enjoy a smooth transition with our dedicated customer success team, ensuring you get the most out of HyreTrack from day one.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to Transform Your Hiring Process?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/*
              "Get Started Free" in Final CTA -> Clear localStorage onClick
            */}
            <Link
              to="/corporates"
              onClick={() => {
                localStorage.clear();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-blue-600 bg-white hover:bg-blue-50 transition-all duration-200"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-full text-white hover:bg-white/10 transition-all duration-200"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
