
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Partnerships = () => {
  const partners = [
    {
      name: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'
    },
    {
      name: 'Oracle',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg'
    },
    {
      name: 'Salesforce',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg'
    },
    {
      name: 'SAP',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg'
    },
    {
      name: 'Slack',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg'
    },
    {
      name: 'Adobe',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg'
    },
    {
      name: 'IBM',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg'
    },
    {
      name: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
    },
    {
      name: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
    },
    {
      name: 'Meta',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg'
    },
    {
      name: 'Netflix',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg'
    },
    {
      name: 'Tesla',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg'
    },
    {
      name: 'Spotify',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg'
    },
    {
      name: 'Airbnb',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg'
    },
    {
      name: 'Uber',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
    },
    {
      name: 'LinkedIn',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png'
    }
  ];

  const getLogoClassName = (partnerName: string) => {
    const baseClasses = "object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100";
    
    switch(partnerName) {
      case 'Microsoft':
        return `h-12 w-auto max-w-[180px] ${baseClasses}`;
      case 'Oracle':
        return `h-14 w-auto max-w-[160px] ${baseClasses}`;
      case 'Tesla':
      case 'Spotify':
      case 'Airbnb':
        return `h-14 w-14 ${baseClasses}`;
      case 'LinkedIn':
        return `h-14 w-14 ${baseClasses}`;
      default:
        return `h-16 w-auto max-w-[200px] ${baseClasses}`;
    }
  };

  return (
    <section className="py-32 bg-gradient-to-b from-[color:var(--paper)] to-[color:var(--sand)] px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-6xl font-light text-[color:var(--ink)] mb-8 tracking-tight pricing-title">
            Trusted by Industry Leaders
          </h2>
          <p className="text-2xl text-[color:var(--text-2)] max-w-4xl mx-auto font-light pricing-text">
            Join thousands of companies that trust our AI workers to transform their operations.
          </p>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {partners.map((partner, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                  <div className="flex items-center justify-center p-8 bg-[color:var(--paper)] backdrop-blur-sm rounded-[28px] shadow-sm hover:shadow-md transition-all duration-300 hover-lift animate-fade-in h-32">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className={getLogoClassName(partner.name)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'h-16 w-40 bg-[color:var(--sand)] rounded flex items-center justify-center text-lg text-[color:var(--text-2)] font-medium';
                        fallback.textContent = partner.name;
                        target.parentNode?.appendChild(fallback);
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="text-center mt-20">
          <div className="flex flex-col sm:flex-row gap-12 justify-center items-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[color:var(--blue-100)] rounded-[28px] flex items-center justify-center">
                <svg className="w-8 h-8 text-[color:var(--blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-semibold text-[color:var(--ink)]">99.9%</div>
                <div className="text-lg text-[color:var(--text-2)]">Uptime SLA</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[color:var(--blue-100)] rounded-[28px] flex items-center justify-center">
                <svg className="w-8 h-8 text-[color:var(--blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-semibold text-[color:var(--ink)]">SOC 2</div>
                <div className="text-lg text-[color:var(--text-2)]">Compliant</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[color:var(--blue-100)] rounded-[28px] flex items-center justify-center">
                <svg className="w-8 h-8 text-[color:var(--blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-semibold text-[color:var(--ink)]">GDPR</div>
                <div className="text-lg text-[color:var(--text-2)]">Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partnerships;
