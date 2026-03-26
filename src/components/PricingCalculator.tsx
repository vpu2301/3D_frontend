import { useState, useEffect } from 'react';
import { Calculator, Users, Zap, Building2, ArrowRight, Info, Bot, User, UserCheck, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PricingCalculator = () => {
  const [workers, setWorkers] = useState([1]);
  const [hours, setHours] = useState([160]); // hours per month
  const [integrations, setIntegrations] = useState([5]);
  const [tier, setTier] = useState('standard');
  const [deployment, setDeployment] = useState('cloud');
  const [assignmentType, setAssignmentType] = useState('personal');
  const [teamSize, setTeamSize] = useState([50]); // for team/department assignments
  const [customFeatures, setCustomFeatures] = useState(false);

  // Force re-render when tier changes to ensure UI updates
  useEffect(() => {
    // This will trigger a re-calculation whenever tier changes
    console.log('Tier changed to:', tier);
  }, [tier]);

  const tiers = {
    free: {
      label: 'Free',
      price: '$0',
      description: 'Perfect for trying out AI workers',
      aiSupport: 'Community support only',
      features: [
        'Community forum access',
        'Basic documentation',
        'Up to 2 AI workers maximum',
        'Up to 20 hours per month per worker',
        '1 basic integration only',
        'Cloud deployment only'
      ],
      limitations: {
        maxWorkers: 2,
        maxHours: 20,
        maxIntegrations: 1
      }
    },
    basic: {
      label: 'Basic',
      price: 'Base',
      description: 'Perfect for getting started with AI workers',
      aiSupport: 'AI Employee support via email',
      features: [
        'AI Employee email support (48h response)',
        'Basic documentation access',
        'Community forum access',
        'Standard integrations only',
        'Basic AI worker management'
      ]
    },
    standard: {
      label: 'Standard',
      price: '+20%',
      description: 'Ideal for growing teams and businesses',
      aiSupport: 'Dedicated AI Employee team',
      features: [
        'Priority AI Employee support (24h response)',
        'Live chat with AI Employees (business hours)',
        'Full documentation and tutorials',
        'All standard integrations',
        'Advanced AI worker analytics',
        'AI Employee training assistance'
      ]
    },
    premium: {
      label: 'Premium',
      price: '+50%',
      description: 'Advanced support for mission-critical operations',
      aiSupport: 'Senior AI Employee specialist',
      features: [
        'Priority AI Employee support (12h response)',
        'Phone support with AI Employee specialists',
        'Dedicated AI Employee customer success manager',
        'Custom integration assistance from AI team',
        'Advanced analytics and AI insights',
        'Personalized training by AI Employees',
        'AI worker optimization recommendations'
      ]
    },
    enterprise: {
      label: 'Enterprise',
      price: '+80%',
      description: 'White-glove AI Employee service for large organizations',
      aiSupport: 'Dedicated AI Employee account team',
      features: [
        'SLA-backed AI Employee support (4h response)',
        '24/7 AI Employee phone and chat support',
        'Dedicated AI Employee technical account manager',
        'Custom AI worker development support',
        'On-site training by AI Employee specialists',
        'Custom SLAs with AI Employee guarantees',
        'Priority AI worker feature requests',
        'AI Employee strategic consultation'
      ]
    }
  };

  const assignmentTypes = {
    personal: {
      label: 'Personal Assistant',
      icon: User,
      description: 'Dedicated AI workers assigned to individual users',
      baseMultiplier: 1,
      supportDescription: 'Individual AI Employee support with personal account management',
      features: [
        'Personal AI Employee account manager',
        'Individual user training and onboarding',
        'Personalized AI worker configuration',
        'Direct access to AI Employee specialists',
        'Custom workflow optimization for individual needs'
      ],
      allowsFree: true,
      minimumCost: undefined
    },
    team: {
      label: 'Team/Department Pro (10-100 employees)',
      icon: Users,
      description: 'AI workers shared across teams or departments with 10-100 employees',
      baseMultiplier: 1.2, // Increased to cover computational costs
      supportDescription: 'Professional team-based AI Employee support with department coordination',
      features: [
        'Department-level AI Employee coordination',
        'Team training sessions with AI Employees',
        'Shared AI worker management dashboard',
        'Department-specific integration support',
        'Collaborative workflow optimization',
        'Multi-user access controls'
      ],
      allowsFree: false,
      minimumCost: 299
    },
    enterprise: {
      label: 'Enterprise (100+ employees)',
      icon: Building2,
      description: 'AI workers for large organizations with 100+ employees',
      baseMultiplier: 1.8, // Higher multiplier for enterprise computational load
      supportDescription: 'Enterprise-grade AI Employee support with dedicated account management',
      features: [
        'Enterprise-wide AI Employee coordination',
        'Organization-level training programs',
        'Advanced enterprise dashboard',
        'Custom enterprise integrations',
        'Enterprise workflow optimization',
        'Advanced security and compliance',
        'Dedicated enterprise account team'
      ],
      allowsFree: false,
      requiresContactSales: true,
      minimumCost: undefined
    }
  };

  const getTeamSizeTier = () => {
    if (assignmentType === 'personal') return 'personal';
    if (assignmentType === 'team') return teamSize[0] <= 100 ? 'team-pro' : 'enterprise';
    return 'enterprise';
  };

  // Check if current configuration is free tier eligible
  const isFreeEligible = () => {
    return assignmentType === 'personal' && 
           tier === 'free' && 
           workers[0] <= 2 && 
           hours[0] <= 20 && 
           integrations[0] <= 1 &&
           deployment === 'cloud' &&
           !customFeatures;
  };

  const featureMatrix = [
    {
      category: 'AI Employee Support Response Time',
      free: 'Community only',
      basic: '48 hours',
      standard: '24 hours',
      premium: '12 hours',
      enterprise: '4 hours (SLA-backed)'
    },
    {
      category: 'AI Employee Support Channels',
      free: 'Forum only',
      basic: 'Email only',
      standard: 'Email + Live chat',
      premium: 'Email + Chat + Phone',
      enterprise: '24/7 Phone + Chat + Email'
    },
    {
      category: 'AI Employee Management Style',
      free: 'Self-service only',
      basic: 'Self-service portal',
      standard: assignmentType === 'personal' ? 'Personal AI Employee team' : getTeamSizeTier() === 'team-pro' ? 'Department AI Employee team' : 'Enterprise AI Employee team',
      premium: assignmentType === 'personal' ? 'Personal AI Employee manager' : getTeamSizeTier() === 'team-pro' ? 'Department AI Employee coordinator' : 'Enterprise AI Employee coordinator',
      enterprise: assignmentType === 'personal' ? 'Dedicated personal AI account team' : getTeamSizeTier() === 'team-pro' ? 'Dedicated department AI account team' : 'Dedicated enterprise AI account team'
    },
    {
      category: 'AI Worker Assignment Model',
      free: 'Basic assignment (max 2 workers)',
      basic: 'Standard assignment',
      standard: assignmentType === 'personal' ? 'Personal AI worker assignment' : getTeamSizeTier() === 'team-pro' ? 'Team/department AI worker pools' : 'Enterprise AI worker coordination',
      premium: assignmentType === 'personal' ? 'Optimized personal AI assignment' : getTeamSizeTier() === 'team-pro' ? 'Advanced team AI coordination' : 'Advanced enterprise AI coordination',
      enterprise: assignmentType === 'personal' ? 'Custom personal AI development' : getTeamSizeTier() === 'team-pro' ? 'Custom department AI solutions' : 'Custom enterprise AI solutions'
    },
    {
      category: 'Training & Onboarding',
      free: 'Self-service documentation only',
      basic: 'Self-service documentation',
      standard: assignmentType === 'personal' ? 'Personal AI Employee tutorials' : getTeamSizeTier() === 'team-pro' ? 'Team AI Employee sessions' : 'Enterprise AI Employee programs',
      premium: assignmentType === 'personal' ? 'One-on-one AI Employee training' : getTeamSizeTier() === 'team-pro' ? 'Department-wide AI Employee training' : 'Organization-wide AI Employee training',
      enterprise: assignmentType === 'personal' ? 'Personal AI Employee specialist' : getTeamSizeTier() === 'team-pro' ? 'On-site department AI training' : 'On-site enterprise AI training'
    },
    {
      category: 'AI Worker Integrations',
      free: '1 basic integration only',
      basic: 'Standard only (5 included)',
      standard: 'All standard integrations',
      premium: 'Standard + Custom with AI assistance',
      enterprise: 'Custom development by AI team'
    },
    {
      category: 'Analytics & Insights',
      free: 'Basic usage stats only',
      basic: 'Basic dashboard',
      standard: assignmentType === 'personal' ? 'Personal AI analytics' : getTeamSizeTier() === 'team-pro' ? 'Team AI analytics dashboard' : 'Enterprise AI analytics dashboard',
      premium: assignmentType === 'personal' ? 'Personal AI insights + recommendations' : getTeamSizeTier() === 'team-pro' ? 'Department AI insights + coordination' : 'Enterprise AI insights + coordination',
      enterprise: assignmentType === 'personal' ? 'Custom personal AI analytics' : getTeamSizeTier() === 'team-pro' ? 'Enterprise department AI reporting' : 'Custom enterprise AI reporting'
    },
    {
      category: 'Workflow Optimization',
      free: 'None',
      basic: 'Basic performance metrics',
      standard: assignmentType === 'personal' ? 'Personal workflow recommendations' : getTeamSizeTier() === 'team-pro' ? 'Team workflow optimization' : 'Enterprise workflow optimization',
      premium: assignmentType === 'personal' ? 'Personal AI Employee optimization' : getTeamSizeTier() === 'team-pro' ? 'Department AI Employee coordination' : 'Enterprise AI Employee coordination',
      enterprise: assignmentType === 'personal' ? 'Dedicated personal optimization team' : getTeamSizeTier() === 'team-pro' ? 'Dedicated department optimization team' : 'Dedicated enterprise optimization team'
    },
    {
      category: 'Computational Resources',
      free: 'Shared basic resources (20h limit)',
      basic: 'Standard allocation',
      standard: assignmentType === 'personal' ? 'Personal resource allocation' : getTeamSizeTier() === 'team-pro' ? 'Team resource pool' : 'Enterprise resource pool',
      premium: assignmentType === 'personal' ? 'Enhanced personal resources' : getTeamSizeTier() === 'team-pro' ? 'Enhanced team resources' : 'Enhanced enterprise resources',
      enterprise: assignmentType === 'personal' ? 'Dedicated personal infrastructure' : getTeamSizeTier() === 'team-pro' ? 'Dedicated team infrastructure' : 'Dedicated enterprise infrastructure'
    },
    {
      category: 'Compliance & SLAs',
      free: 'Basic terms only',
      basic: 'Standard terms',
      standard: 'Enhanced compliance',
      premium: 'AI Employee compliance support',
      enterprise: 'Custom SLAs with AI guarantees'
    }
  ];

  const calculatePricing = () => {
    const workerCount = workers[0];
    const monthlyHours = hours[0];
    const integrationCount = integrations[0];
    const currentTeamSize = assignmentType !== 'personal' ? teamSize[0] : 1;

    console.log('Calculating pricing with tier:', tier, 'workers:', workerCount, 'hours:', monthlyHours);

    // Check if this is a free tier configuration
    if (isFreeEligible()) {
      return {
        monthlyTotal: 0,
        annualTotal: 0,
        perWorkerCost: 0,
        excessHoursCost: 0,
        integrationsCost: 0,
        annualSavings: 0,
        assignmentDiscount: 0,
        teamSize: currentTeamSize,
        isFree: true
      };
    }

    // Base pricing per worker - adjusted for computational costs
    let basePrice = 50;
    
    // Scale pricing based on usage hours
    if (monthlyHours > 160) {
      basePrice += (monthlyHours - 160) * 5;
    }
    
    // Set maximum price cap based on assignment type
    if (assignmentType === 'personal') {
      basePrice = Math.min(basePrice, 599); // $599 max for personal workers
    } else {
      basePrice = Math.min(basePrice, 800); // Higher cap for team/enterprise
    }

    // Assignment type multiplier with computational cost adjustments
    let assignmentMultiplier = assignmentTypes[assignmentType].baseMultiplier;
    
    // Additional computational cost for team size
    if (assignmentType === 'team') {
      const teamComputationalMultiplier = Math.min(1 + (currentTeamSize - 10) * 0.01, 1.5); // Max 50% increase, starting from 10
      assignmentMultiplier *= teamComputationalMultiplier;
    } else if (assignmentType === 'enterprise') {
      const enterpriseComputationalMultiplier = Math.min(1 + (currentTeamSize - 100) * 0.005, 2); // Scale with enterprise size, starting from 100
      assignmentMultiplier *= enterpriseComputationalMultiplier;
    }

    // Volume discounts adjusted for team/enterprise tiers
    let volumeMultiplier = 1;
    if (assignmentType === 'team') {
      if (workerCount >= 50) volumeMultiplier = 0.85; // 15% discount
      else if (workerCount >= 20) volumeMultiplier = 0.9; // 10% discount
      else if (workerCount >= 10) volumeMultiplier = 0.95; // 5% discount
    } else if (assignmentType === 'enterprise') {
      if (workerCount >= 100) volumeMultiplier = 0.7; // 30% discount
      else if (workerCount >= 50) volumeMultiplier = 0.8; // 20% discount
      else if (workerCount >= 20) volumeMultiplier = 0.9; // 10% discount
    } else {
      // Personal assignment volume discounts
      if (workerCount >= 100) volumeMultiplier = 0.7;
      else if (workerCount >= 50) volumeMultiplier = 0.8;
      else if (workerCount >= 20) volumeMultiplier = 0.9;
    }

    // Usage-based pricing for excess hours
    const baseHours = 160;
    const excessHours = Math.max(0, monthlyHours - baseHours);
    const hourlyRate = assignmentType === 'personal' ? 12 : assignmentType === 'team' ? 15 : 18;
    const excessCost = excessHours * hourlyRate;

    // Integration add-ons
    const baseIntegrations = 5;
    const excessIntegrations = Math.max(0, integrationCount - baseIntegrations);
    const integrationRate = assignmentType === 'personal' ? 50 : assignmentType === 'team' ? 75 : 100;
    const integrationCost = excessIntegrations * integrationRate;

    // FIXED: Updated tier pricing multipliers
    const tierMultiplier = {
      free: 0,
      basic: 1,        // Base price (no discount)
      standard: 1.2,   // 20% increase
      premium: 1.5,    // 50% increase
      enterprise: 1.8  // 80% increase
    };

    console.log('Tier multiplier for', tier, ':', tierMultiplier[tier]);

    // Deployment pricing
    const deploymentMultiplier = deployment === 'on-premise' ? 1.2 : 1;

    // Custom features
    const customFeaturesMultiplier = customFeatures ? 1.3 : 1;

    // Calculate per worker cost with proper tier multiplier application
    const perWorkerBaseCost = basePrice * assignmentMultiplier * tierMultiplier[tier] * deploymentMultiplier * customFeaturesMultiplier * volumeMultiplier;
    
    console.log('Per worker base cost before adding extras:', perWorkerBaseCost);
    
    // Apply max price cap per worker based on assignment type
    const maxPerWorkerPrice = assignmentType === 'personal' ? 599 : 1500;
    const perWorkerTotalCost = Math.min(perWorkerBaseCost + (excessCost / workerCount) + (integrationCost / workerCount), maxPerWorkerPrice);
    
    let totalMonthlyCost = perWorkerTotalCost * workerCount;

    // Apply minimum cost for team assignments
    if (assignmentType === 'team' && totalMonthlyCost < 299) {
      totalMonthlyCost = 299;
    }

    const annualCost = totalMonthlyCost * 12 * 0.9; // 10% annual discount

    console.log('Final monthly cost:', totalMonthlyCost);

    return {
      monthlyTotal: Math.round(totalMonthlyCost),
      annualTotal: Math.round(annualCost),
      perWorkerCost: Math.round(perWorkerTotalCost),
      excessHoursCost: Math.round(excessCost),
      integrationsCost: Math.round(integrationCost),
      annualSavings: Math.round(totalMonthlyCost * 12 - annualCost),
      assignmentDiscount: Math.round((1 - volumeMultiplier) * 100),
      teamSize: currentTeamSize,
      isFree: false
    };
  };

  const pricing = calculatePricing();
  const selectedAssignment = assignmentTypes[assignmentType];

  const getTierName = () => {
    if (pricing.isFree) return 'Free';
    const cost = pricing.perWorkerCost;
    if (cost <= 100) return 'Starter';
    if (cost <= 500) return 'Professional';
    return 'Enterprise';
  };

  // Filter available tiers based on assignment type
  const getAvailableTiers = () => {
    if (!selectedAssignment.allowsFree) {
      const { free, ...tiersWithoutFree } = tiers;
      return tiersWithoutFree;
    }
    return tiers;
  };

  const shouldShowContactSales = () => {
    return assignmentType === 'enterprise' || (assignmentType === 'team' && tier === 'enterprise');
  };

  const shouldHidePricing = () => {
    return assignmentType === 'enterprise';
  };

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader className="text-center pb-8">
        <div className="w-16 h-16 bg-[#111111] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Calculator className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-4xl font-light text-gray-900 mb-4">
          AI Worker Pricing Calculator
        </CardTitle>
        <p className="text-xl text-gray-600 font-light">
          Configure your AI workers with AI Employee support from $0-$599 per worker per month
        </p>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Configuration Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-medium text-gray-900 mb-6">Configure Your AI Workers</h3>
            
            <div className="space-y-6">
              <div>
                <Label className="block text-lg font-medium text-gray-700 mb-3">
                  <UserCheck className="inline-block w-5 h-5 mr-2" />
                  AI Worker Assignment Type
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(assignmentTypes).map(([value, assignment]) => {
                    const IconComponent = assignment.icon;
                    return (
                      <button
                        key={value}
                        onClick={() => setAssignmentType(value)}
                        className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                          assignmentType === value
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <IconComponent className="w-5 h-5 mr-2" />
                            <div className="font-medium">{assignment.label}</div>
                          </div>
                          <div className="flex gap-2">
                            {assignment.allowsFree && (
                              <div className="text-sm text-green-600 font-medium">
                                Free option
                              </div>
                            )}
                            {assignment.minimumCost && (
                              <div className="text-sm text-blue-600 font-medium">
                                Starting from ${assignment.minimumCost}
                              </div>
                            )}
                            {value !== 'personal' && (
                              <div className="text-sm text-[#111111] font-medium">
                                Higher computational cost
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{assignment.description}</div>
                        <div className="text-xs text-gray-500">
                          <div className="font-medium mb-1 text-blue-600">
                            <Bot className="inline-block w-3 h-3 mr-1" />
                            {assignment.supportDescription}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {(assignmentType === 'team' || assignmentType === 'enterprise') && (
                <div>
                  <Label className="block text-lg font-medium text-gray-700 mb-3">
                    Team/Organization Size
                  </Label>
                  <Slider
                    value={teamSize}
                    onValueChange={setTeamSize}
                    max={assignmentType === 'team' ? 100 : 1000}
                    min={assignmentType === 'team' ? 10 : 100}
                    step={1}
                    className="mb-3"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{assignmentType === 'team' ? '10' : '100'}</span>
                    <span className="font-medium text-lg text-gray-900">{teamSize[0]} employees</span>
                    <span>{assignmentType === 'team' ? '100' : '1000+'}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {assignmentType === 'team' 
                      ? 'Team/Department Pro is for 10-100 employees (minimum $299/month)' 
                      : 'Enterprise tier is for 100+ employees with enhanced computational resources'
                    }
                  </p>
                </div>
              )}

              <div>
                <Label className="block text-lg font-medium text-gray-700 mb-3">
                  Number of AI Workers
                </Label>
                <Slider
                  value={workers}
                  onValueChange={setWorkers}
                  max={tier === 'free' ? 2 : 200}
                  min={1}
                  step={1}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1</span>
                  <span className="font-medium text-lg text-gray-900">
                    {workers[0]} workers
                    {tier === 'free' && workers[0] > 2 && (
                      <span className="text-red-500 ml-2">(Free tier: max 2)</span>
                    )}
                  </span>
                  <span>{tier === 'free' ? '2 (free limit)' : '200+'}</span>
                </div>
              </div>

              <div>
                <Label className="block text-lg font-medium text-gray-700 mb-3">
                  Monthly Usage Hours (per worker)
                </Label>
                <Slider
                  value={hours}
                  onValueChange={setHours}
                  max={tier === 'free' ? 20 : 400}
                  min={tier === 'free' ? 1 : 40}
                  step={tier === 'free' ? 1 : 10}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{tier === 'free' ? '1h' : '40h'}</span>
                  <span className="font-medium text-lg text-gray-900">
                    {hours[0]}h/month
                    {tier === 'free' && hours[0] > 20 && (
                      <span className="text-red-500 ml-2">(Free tier: max 20h)</span>
                    )}
                  </span>
                  <span>{tier === 'free' ? '20h (free limit)' : '400h+'}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {tier === 'free' 
                    ? '20 hours maximum in free tier'
                    : `160 hours included in base price. Excess: $${assignmentType === 'personal' ? '12' : assignmentType === 'team' ? '15' : '18'}/hour`
                  }
                </p>
              </div>

              <div>
                <Label className="block text-lg font-medium text-gray-700 mb-3">
                  Required Integrations
                </Label>
                <Slider
                  value={integrations}
                  onValueChange={setIntegrations}
                  max={tier === 'free' ? 1 : 50}
                  min={1}
                  step={1}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1</span>
                  <span className="font-medium text-lg text-gray-900">
                    {integrations[0]} integrations
                    {tier === 'free' && integrations[0] > 1 && (
                      <span className="text-red-500 ml-2">(Free tier: 1 only)</span>
                    )}
                  </span>
                  <span>{tier === 'free' ? '1 (free limit)' : '50+'}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {tier === 'free'
                    ? '1 basic integration included in free tier'
                    : `5 integrations included, additional at $${assignmentType === 'personal' ? '50' : assignmentType === 'team' ? '75' : '100'}/month each`
                  }
                </p>
              </div>

              <div>
                <Label className="block text-lg font-medium text-gray-700 mb-3">
                  <Bot className="inline-block w-5 h-5 mr-2" />
                  AI Employee Support Tier
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(getAvailableTiers()).map(([value, tierData]) => (
                    <button
                      key={value}
                      onClick={() => {
                        console.log('Setting tier to:', value);
                        setTier(value);
                      }}
                      className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                        tier === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{tierData.label}</div>
                        <div className={`text-sm font-semibold ${
                          tier === value ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {tierData.price}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{tierData.description}</div>
                      <div className="text-xs text-gray-500">
                        <div className="font-medium mb-1 text-blue-600">
                          <Bot className="inline-block w-3 h-3 mr-1" />
                          {tierData.aiSupport}
                        </div>
                        {tierData.features.slice(0, 2).map((feature, idx) => (
                          <div key={idx}>• {feature}</div>
                        ))}
                        {tierData.features.length > 2 && (
                          <div className="text-blue-600 font-medium mt-1">
                            +{tierData.features.length - 2} more features
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="block text-lg font-medium text-gray-700 mb-3">
                  Deployment Option
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDeployment('cloud')}
                    className={`p-3 rounded-lg border text-center ${
                      deployment === 'cloud'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">Cloud</div>
                    <div className="text-sm text-gray-500">Standard</div>
                  </button>
                  <button
                    onClick={() => setDeployment('on-premise')}
                    disabled={tier === 'free'}
                    className={`p-3 rounded-lg border text-center ${
                      deployment === 'on-premise'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : tier === 'free'
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">On-Premise</div>
                    <div className="text-sm text-gray-500">
                      {tier === 'free' ? 'Not available' : '+20%'}
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="customFeatures"
                    checked={customFeatures}
                    onChange={(e) => setCustomFeatures(e.target.checked)}
                    disabled={tier === 'free'}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded disabled:opacity-50"
                  />
                  <Label htmlFor="customFeatures" className={`text-lg font-medium ${tier === 'free' ? 'text-gray-400' : 'text-gray-700'}`}>
                    Custom AI Worker Development (+30%)
                    {tier === 'free' && <span className="text-sm text-gray-400 ml-2">(Not available in free tier)</span>}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-medium text-gray-900 mb-6">Your AI Worker Quote</h3>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl mb-6">
              <div className="text-sm text-gray-600 mb-1">Configuration Summary</div>
              <div className="text-2xl font-medium text-gray-900 mb-2">{selectedAssignment.label}</div>
              <div className="text-lg font-medium text-blue-600 mb-2">
                Support Tier: {tiers[tier].label} ({tiers[tier].price})
              </div>
              {(assignmentType === 'team' || assignmentType === 'enterprise') && (
                <div className="text-sm text-gray-600 mb-2">
                  Team Size: {pricing.teamSize} employees
                </div>
              )}
              <div className="text-sm text-gray-600">
                <Bot className="inline-block w-4 h-4 mr-1" />
                {selectedAssignment.supportDescription}
              </div>
              {pricing.assignmentDiscount > 0 && !shouldHidePricing() && (
                <div className="text-sm text-green-600 font-medium mt-2">
                  {pricing.assignmentDiscount}% volume discount applied
                </div>
              )}
              {pricing.isFree && (
                <div className="text-sm text-green-600 font-medium mt-2">
                  🎉 Free tier - Limited functionality
                </div>
              )}
            </div>

            {shouldHidePricing() ? (
              <div className="bg-white p-8 rounded-2xl text-[#111111] text-center border border-black/8">
                <h4 className="text-2xl font-medium mb-4">Enterprise Pricing</h4>
                <p className="text-black/60 mb-6">
                  Custom pricing tailored to your organization's specific needs and scale.
                </p>
                <div className="text-lg text-black/70 mb-6">
                  Get a personalized quote with:
                </div>
                <ul className="text-left text-black/60 mb-8 space-y-2 max-w-md mx-auto">
                  <li>• Custom volume discounts</li>
                  <li>• Dedicated infrastructure</li>
                  <li>• White-glove AI Employee service</li>
                  <li>• Flexible billing terms</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                  <div className="text-sm text-gray-600 mb-1">Cost Per AI Worker</div>
                  <div className="text-4xl font-light text-gray-900">
                    {pricing.isFree ? 'FREE' : `$${pricing.perWorkerCost}`}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">per month</div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="text-sm text-gray-600 mb-1">Total Monthly Cost</div>
                  <div className="text-3xl font-light text-gray-900">
                    {pricing.isFree ? 'FREE' : `$${pricing.monthlyTotal.toLocaleString()}`}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {pricing.isFree ? 'Limited to 2 workers, 20h each' : `${workers[0]} workers × $${pricing.perWorkerCost}`}
                  </div>
                  {assignmentType === 'team' && !pricing.isFree && pricing.monthlyTotal === 299 && (
                    <div className="text-sm text-blue-600 mt-1">Minimum team pricing applied</div>
                  )}
                </div>

                {!pricing.isFree && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                    <div className="text-sm text-gray-600 mb-1">Annual Total (10% discount)</div>
                    <div className="text-3xl font-light text-gray-900">${pricing.annualTotal.toLocaleString()}</div>
                    <div className="text-sm text-green-600 mt-1">Save ${pricing.annualSavings.toLocaleString()}/year</div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3 mt-8">
              {shouldShowContactSales() ? (
                <Button className="w-full bg-[#111111] hover:bg-[#222222] text-white text-lg py-4 rounded-full transition-all duration-300 hover:scale-105">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Sales for Enterprise Quote
                </Button>
              ) : (
                <Button className="w-full bg-[#111111] hover:from-blue-600 hover:to-purple-600 text-white text-lg py-4 rounded-full transition-all duration-300 hover:scale-105">
                  {pricing.isFree ? 'Start Free Trial' : 'Get This Quote'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {!shouldHidePricing() && (
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-4 rounded-full">
                  Schedule AI Employee Consultation
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* AI Employee Support Features Comparison Table */}
        <div className="mt-16">
          <h3 className="text-2xl font-medium text-gray-900 mb-6 text-center">
            <Bot className="inline-block w-6 h-6 mr-2" />
            Complete AI Employee Support Comparison
            <span className="block text-lg font-normal text-gray-600 mt-2">
              {selectedAssignment.label}
              {(assignmentType === 'team' || assignmentType === 'enterprise') && ` - ${pricing.teamSize} employees`}
            </span>
          </h3>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium text-gray-900">AI Employee Features</TableHead>
                  {selectedAssignment.allowsFree && (
                    <TableHead className="font-medium text-gray-900 text-center">Free ($0)</TableHead>
                  )}
                  <TableHead className="font-medium text-gray-900 text-center">Basic (Base)</TableHead>
                  <TableHead className="font-medium text-gray-900 text-center">Standard (+20%)</TableHead>
                  <TableHead className="font-medium text-gray-900 text-center">Premium (+50%)</TableHead>
                  <TableHead className="font-medium text-gray-900 text-center">Enterprise (+80%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {featureMatrix.map((feature, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">{feature.category}</TableCell>
                    {selectedAssignment.allowsFree && (
                      <TableCell className="text-center text-gray-700">{feature.free}</TableCell>
                    )}
                    <TableCell className="text-center text-gray-700">{feature.basic}</TableCell>
                    <TableCell className="text-center text-gray-700">{feature.standard}</TableCell>
                    <TableCell className="text-center text-gray-700">{feature.premium}</TableCell>
                    <TableCell className="text-center text-gray-700">{feature.enterprise}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-gray-500 text-center mt-4">
            <Bot className="inline-block w-4 h-4 mr-1" />
            All tiers include access to our AI worker platform and AI Employee support
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCalculator;
