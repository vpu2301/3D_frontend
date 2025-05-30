
import { useState, useEffect } from 'react';
import { Calculator, Users, Zap, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const PricingCalculator = () => {
  const [workers, setWorkers] = useState([1]);
  const [hours, setHours] = useState([160]); // hours per month
  const [integrations, setIntegrations] = useState([5]);
  const [supportLevel, setSupportLevel] = useState('standard');
  const [deployment, setDeployment] = useState('cloud');
  const [customFeatures, setCustomFeatures] = useState(false);

  const calculatePricing = () => {
    const workerCount = workers[0];
    const monthlyHours = hours[0];
    const integrationCount = integrations[0];

    // Base pricing per worker - starts at $0 for minimal usage
    let basePrice = 50; // Minimum base price
    
    // Scale pricing based on usage hours
    if (monthlyHours > 160) {
      basePrice += (monthlyHours - 160) * 5; // Escalating price for higher usage
    }
    
    // Cap the base price at around $800 before other factors
    basePrice = Math.min(basePrice, 800);

    // Volume discounts for multiple workers
    let volumeMultiplier = 1;
    if (workerCount >= 100) volumeMultiplier = 0.7; // 30% discount
    else if (workerCount >= 50) volumeMultiplier = 0.8; // 20% discount
    else if (workerCount >= 20) volumeMultiplier = 0.9; // 10% discount

    // Usage-based pricing for excess hours
    const baseHours = 160;
    const excessHours = Math.max(0, monthlyHours - baseHours);
    const excessCost = excessHours * 12; // $12 per excess hour

    // Integration add-ons
    const baseIntegrations = 5;
    const excessIntegrations = Math.max(0, integrationCount - baseIntegrations);
    const integrationCost = excessIntegrations * 50; // $50 per additional integration

    // Support level pricing
    const supportMultiplier = {
      basic: 0.8,
      standard: 1,
      premium: 1.3,
      enterprise: 1.6
    };

    // Deployment pricing
    const deploymentMultiplier = deployment === 'on-premise' ? 1.2 : 1;

    // Custom features
    const customFeaturesMultiplier = customFeatures ? 1.3 : 1;

    // Calculate per worker cost
    const perWorkerBaseCost = basePrice * supportMultiplier[supportLevel] * deploymentMultiplier * customFeaturesMultiplier * volumeMultiplier;
    const perWorkerTotalCost = Math.min(perWorkerBaseCost + (excessCost / workerCount) + (integrationCost / workerCount), 1000);
    
    const totalMonthlyCost = perWorkerTotalCost * workerCount;
    const annualCost = totalMonthlyCost * 12 * 0.9; // 10% annual discount

    return {
      monthlyTotal: Math.round(totalMonthlyCost),
      annualTotal: Math.round(annualCost),
      perWorkerCost: Math.round(perWorkerTotalCost),
      excessHoursCost: Math.round(excessCost),
      integrationsCost: Math.round(integrationCost),
      annualSavings: Math.round(totalMonthlyCost * 12 - annualCost)
    };
  };

  const pricing = calculatePricing();

  const getTier = () => {
    const cost = pricing.perWorkerCost;
    if (cost <= 100) return 'Starter';
    if (cost <= 500) return 'Professional';
    return 'Enterprise';
  };

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader className="text-center pb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Calculator className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-4xl font-light text-gray-900 mb-4">
          AI Worker Pricing Calculator
        </CardTitle>
        <p className="text-xl text-gray-600 font-light">
          Configure your AI workers and see transparent pricing from $0-$1000 per worker per month
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
                  Number of AI Workers
                </Label>
                <Slider
                  value={workers}
                  onValueChange={setWorkers}
                  max={200}
                  min={1}
                  step={1}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1</span>
                  <span className="font-medium text-lg text-gray-900">{workers[0]} workers</span>
                  <span>200+</span>
                </div>
              </div>

              <div>
                <Label className="block text-lg font-medium text-gray-700 mb-3">
                  Monthly Usage Hours (per worker)
                </Label>
                <Slider
                  value={hours}
                  onValueChange={setHours}
                  max={400}
                  min={40}
                  step={10}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>40h</span>
                  <span className="font-medium text-lg text-gray-900">{hours[0]}h/month</span>
                  <span>400h+</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">160 hours included in base price</p>
              </div>

              <div>
                <Label className="block text-lg font-medium text-gray-700 mb-3">
                  Required Integrations
                </Label>
                <Slider
                  value={integrations}
                  onValueChange={setIntegrations}
                  max={50}
                  min={1}
                  step={1}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1</span>
                  <span className="font-medium text-lg text-gray-900">{integrations[0]} integrations</span>
                  <span>50+</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">5 integrations included, additional at $50/month each</p>
              </div>

              <div>
                <Label className="block text-lg font-medium text-gray-700 mb-3">
                  Support Level
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'basic', label: 'Basic', price: '-20%' },
                    { value: 'standard', label: 'Standard', price: 'Base' },
                    { value: 'premium', label: 'Premium', price: '+30%' },
                    { value: 'enterprise', label: 'Enterprise', price: '+60%' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSupportLevel(option.value)}
                      className={`p-3 rounded-lg border text-center ${
                        supportLevel === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.price}</div>
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
                    className={`p-3 rounded-lg border text-center ${
                      deployment === 'on-premise'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">On-Premise</div>
                    <div className="text-sm text-gray-500">+20%</div>
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
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <Label htmlFor="customFeatures" className="text-lg font-medium text-gray-700">
                    Custom Features Development (+30%)
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-medium text-gray-900 mb-6">Your AI Worker Quote</h3>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl mb-6">
              <div className="text-sm text-gray-600 mb-1">Recommended Tier</div>
              <div className="text-2xl font-medium text-gray-900 mb-2">{getTier()}</div>
              <div className="text-sm text-gray-600">Based on your configuration</div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Cost Per AI Worker</div>
                <div className="text-4xl font-light text-gray-900">${pricing.perWorkerCost}</div>
                <div className="text-sm text-gray-600 mt-1">per month</div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Total Monthly Cost</div>
                <div className="text-3xl font-light text-gray-900">${pricing.monthlyTotal.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-1">{workers[0]} workers × ${pricing.perWorkerCost}</div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                <div className="text-sm text-gray-600 mb-1">Annual Total (10% discount)</div>
                <div className="text-3xl font-light text-gray-900">${pricing.annualTotal.toLocaleString()}</div>
                <div className="text-sm text-green-600 mt-1">Save ${pricing.annualSavings.toLocaleString()}/year</div>
              </div>
            </div>

            <div className="space-y-3 mt-8">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg py-4 rounded-full transition-all duration-300 hover:scale-105">
                Get This Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-4 rounded-full">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCalculator;
