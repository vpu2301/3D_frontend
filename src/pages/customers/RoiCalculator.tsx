
import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const RoiCalculator = () => {
  const [employees, setEmployees] = useState(10);
  const [hourlyWage, setHourlyWage] = useState(25);
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [automationPercentage, setAutomationPercentage] = useState(70);

  // Calculations
  const weeklyLaborCost = employees * hourlyWage * hoursPerWeek;
  const annualLaborCost = weeklyLaborCost * 52;
  const automatedHours = (hoursPerWeek * automationPercentage) / 100;
  const weeklyTimeSavings = employees * automatedHours;
  const weeklyCostSavings = weeklyTimeSavings * hourlyWage;
  const annualCostSavings = weeklyCostSavings * 52;
  const monthlySubscription = employees * 99; // $99 per employee per month
  const annualSubscription = monthlySubscription * 12;
  const netAnnualSavings = annualCostSavings - annualSubscription;
  const roi = ((netAnnualSavings / annualSubscription) * 100);
  const paybackMonths = annualSubscription / (weeklyCostSavings * 4.33);

  return (
    <div className="min-h-screen dark:bg-[#181512]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-600 p-4 rounded-2xl">
                <Calculator className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              ROI
              <span className="text-green-600 block">Calculator</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Calculate your return on investment with AI automation. See how much time and money you can save.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Input Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Employees
                  </label>
                  <input
                    type="number"
                    value={employees}
                    onChange={(e) => setEmployees(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average Hourly Wage ($)
                  </label>
                  <input
                    type="number"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours Spent on Automatable Tasks (per week)
                  </label>
                  <input
                    type="number"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Automation Efficiency (%)
                  </label>
                  <input
                    type="range"
                    value={automationPercentage}
                    onChange={(e) => setAutomationPercentage(Number(e.target.value))}
                    className="w-full"
                    min="10"
                    max="90"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">
                    {automationPercentage}%
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Annual Cost Savings</h3>
                      <p className="text-3xl font-bold text-green-600">
                        ${annualCostSavings.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">ROI</h3>
                      <p className="text-3xl font-bold text-blue-600">
                        {roi.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="h-8 w-8 text-purple-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Payback Period</h3>
                      <p className="text-3xl font-bold text-purple-600">
                        {paybackMonths.toFixed(1)} months
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weekly time savings:</span>
                      <span className="font-medium">{weeklyTimeSavings.toFixed(1)} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual subscription cost:</span>
                      <span className="font-medium">${annualSubscription.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Net annual savings:</span>
                      <span className="font-medium text-green-600">${netAnnualSavings.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Realize These Savings?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your AI automation journey and see these results in your business.
          </p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
            <Link to="/get-started">Start Saving Today <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default RoiCalculator;
