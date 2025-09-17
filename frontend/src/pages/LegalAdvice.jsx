import React, { useState } from 'react';

const LegalAdvice = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const legalCategories = [
    {
      id: 'family',
      title: 'Family Law',
      icon: '👨‍👩‍👧‍👦',
      description: 'Marriage, divorce, custody, adoption, and domestic relations',
      services: ['Divorce proceedings', 'Child custody', 'Alimony', 'Adoption', 'Prenuptial agreements']
    },
    {
      id: 'criminal',
      title: 'Criminal Law',
      icon: '⚖️',
      description: 'Criminal defense, bail, appeals, and legal representation',
      services: ['Criminal defense', 'Bail applications', 'Appeals', 'White collar crimes', 'Legal representation']
    },
    {
      id: 'corporate',
      title: 'Corporate Law',
      icon: '🏢',
      description: 'Business formation, contracts, compliance, and corporate governance',
      services: ['Company registration', 'Contract drafting', 'Compliance', 'Mergers & acquisitions', 'IPO assistance']
    },
    {
      id: 'property',
      title: 'Property Law',
      icon: '🏠',
      description: 'Real estate transactions, property disputes, and documentation',
      services: ['Property purchase', 'Title verification', 'Property disputes', 'Rental agreements', 'Construction law']
    },
    {
      id: 'employment',
      title: 'Employment Law',
      icon: '💼',
      description: 'Workplace rights, employment contracts, and labor disputes',
      services: ['Employment contracts', 'Workplace harassment', 'Wrongful termination', 'Labor disputes', 'HR compliance']
    },
    {
      id: 'immigration',
      title: 'Immigration Law',
      icon: '🛂',
      description: 'Visa applications, citizenship, and immigration appeals',
      services: ['Visa applications', 'Citizenship process', 'Immigration appeals', 'Work permits', 'Green card assistance']
    }
  ];

  const filteredCategories = selectedCategory === 'all' 
    ? legalCategories 
    : legalCategories.filter(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Advice & Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get expert legal advice across various practice areas. Our experienced lawyers 
            provide comprehensive legal solutions for individuals and businesses.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Categories
          </button>
          {legalCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* Legal Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-6">{category.description}</p>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Services Include:</h4>
                <ul className="space-y-2">
                  {category.services.map((service, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Get Legal Advice
              </button>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Our Legal Advisory Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose Category</h3>
              <p className="text-sm text-gray-600">Select the legal area you need assistance with</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Describe Issue</h3>
              <p className="text-sm text-gray-600">Provide details about your legal concern</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Review</h3>
              <p className="text-sm text-gray-600">Our lawyers analyze your case</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Solution</h3>
              <p className="text-sm text-gray-600">Receive detailed legal advice and next steps</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-100 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How quickly can I get legal advice?</h3>
              <p className="text-gray-600 text-sm mb-4">Most legal queries are reviewed within 24 hours. Urgent matters can be expedited.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is my information confidential?</h3>
              <p className="text-gray-600 text-sm mb-4">Yes, all communications are protected by attorney-client privilege and strict confidentiality.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What if I need ongoing legal support?</h3>
              <p className="text-gray-600 text-sm mb-4">We can connect you with specialized lawyers for continued representation and support.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Are consultations available in multiple languages?</h3>
              <p className="text-gray-600 text-sm mb-4">Yes, we have lawyers who can provide advice in Hindi, English, and other regional languages.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalAdvice;
