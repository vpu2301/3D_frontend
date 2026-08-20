
import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ROICalculator = () => {
  const [employees, setEmployees] = useState(50);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(50);

  // Placeholder calculation logic
  const calculateROI = () => {
    const weeklyTimeReclaimed = employees * hoursPerWeek;
    const monthlyCostSavings = weeklyTimeReclaimed * hourlyRate * 4.33; // 4.33 weeks per month
    const annualCostSavings = monthlyCostSavings * 12;
    const platformCost = employees * 29 * 12; // $29 per user per month
    const netSavings = annualCostSavings - platformCost;
    const roi = ((netSavings / platformCost) * 100).toFixed(0);

    return {
      weeklyTimeReclaimed,
      monthlyCostSavings: Math.round(monthlyCostSavings),
      annualCostSavings: Math.round(annualCostSavings),
      platformCost: Math.round(platformCost),
      netSavings: Math.round(netSavings),
      roi
    };
  };

  const results = calculateROI();

  return (
    <Card className="w-full max-w-4xl mx-auto bg-[color:var(--paper)] backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader className="text-center pb-8">
        <div className="w-16 h-16 bg-[color:var(--ink)] rounded-[28px] flex items-center justify-center mx-auto mb-6">
          <Calculator className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-4xl font-light text-[color:var(--ink)] mb-4">
          ROI Calculator
        </CardTitle>
        <p className="text-xl text-[color:var(--text-2)] font-light">
          Calculate your potential savings with 3days.ai
        </p>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-medium text-[color:var(--ink)] mb-6">Your Current Situation</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-[color:var(--ink)] mb-3">
                  Number of Employees
                </label>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="w-full h-3 bg-[color:var(--sand)] rounded-[16px] appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-[color:var(--text-2)] mt-2">
                  <span>1</span>
                  <span className="font-medium text-lg text-[color:var(--ink)]">{employees}</span>
                  <span>1000+</span>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-[color:var(--ink)] mb-3">
                  Hours spent on routine tasks per employee/week
                </label>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-3 bg-[color:var(--sand)] rounded-[16px] appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-[color:var(--text-2)] mt-2">
                  <span>1h</span>
                  <span className="font-medium text-lg text-[color:var(--ink)]">{hoursPerWeek}h</span>
                  <span>40h</span>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-[color:var(--ink)] mb-3">
                  Average hourly rate ($)
                </label>
                <input
                  type="range"
                  min="15"
                  max="200"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full h-3 bg-[color:var(--sand)] rounded-[16px] appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-[color:var(--text-2)] mt-2">
                  <span>$15</span>
                  <span className="font-medium text-lg text-[color:var(--ink)]">${hourlyRate}</span>
                  <span>$200</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-medium text-[color:var(--ink)] mb-6">Your Potential Savings</h3>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[color:var(--blue-100)] to-[color:var(--blue-100)] p-6 rounded-[28px]">
                <div className="text-sm text-[color:var(--text-2)] mb-1">Weekly Time Reclaimed</div>
                <div className="text-3xl font-light text-[color:var(--ink)]">{results.weeklyTimeReclaimed} hours</div>
              </div>

              <div className="bg-gradient-to-r from-[color:var(--blue-100)] to-[color:var(--blue-100)] p-6 rounded-[28px]">
                <div className="text-sm text-[color:var(--text-2)] mb-1">Monthly Cost Savings</div>
                <div className="text-3xl font-light text-[color:var(--ink)]">${results.monthlyCostSavings.toLocaleString()}</div>
              </div>

              <div className="bg-gradient-to-r from-[color:var(--blue-100)] to-[color:var(--ink)] p-6 rounded-[28px]">
                <div className="text-sm text-[color:var(--text-2)] mb-1">Annual Cost Savings</div>
                <div className="text-3xl font-light text-[color:var(--ink)]">${results.annualCostSavings.toLocaleString()}</div>
              </div>

              <div className="bg-gradient-to-r from-[color:var(--blue-100)] to-[color:var(--blue-100)] p-6 rounded-[28px] border-2 border-[color:var(--line)]">
                <div className="text-sm text-[color:var(--text-2)] mb-1">ROI After Platform Cost</div>
                <div className="text-4xl font-medium text-[color:var(--blue)]">{results.roi}%</div>
                <div className="text-sm text-[color:var(--text-2)] mt-2">
                  Net annual savings: ${results.netSavings.toLocaleString()}
                </div>
              </div>
            </div>

            <Button className="w-full bg-[color:var(--ink)] hover:from-[color:var(--blue)] hover:to-[color:var(--blue)] text-white text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105">
              Start Your Free Trial
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROICalculator;
