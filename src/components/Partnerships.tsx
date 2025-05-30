
import React from 'react';

const Partnerships = () => {
  const partners = [
    {
      name: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png'
    },
    {
      name: 'Oracle',
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/Oracle-Logo.png'
    },
    {
      name: 'Salesforce',
      logo: 'https://logoeps.com/wp-content/uploads/2013/03/salesforce-vector-logo.png'
    },
    {
      name: 'SAP',
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/SAP-Logo.png'
    },
    {
      name: 'Slack',
      logo: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png'
    },
    {
      name: 'Adobe',
      logo: 'https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg'
    },
    {
      name: 'IBM',
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/IBM-Logo.png'
    },
    {
      name: 'Google',
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 px-4 section-with-shapes">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight pricing-title">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light pricing-text">
            Join thousands of companies that trust our AI workers to transform their operations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover-lift animate-fade-in floating-shape"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="h-8 w-auto max-w-[120px] object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'h-8 w-24 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 font-medium';
                  fallback.textContent = partner.name;
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-600">Uptime SLA</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">SOC 2</div>
                <div className="text-sm text-gray-600">Compliant</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">GDPR</div>
                <div className="text-sm text-gray-600">Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partnerships;
