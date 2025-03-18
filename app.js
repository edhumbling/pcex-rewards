import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Award, TrendingUp } from 'lucide-react';

const RewardsDashboard = () => {
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [numInvites, setNumInvites] = useState(5);
  const [accountBalance, setAccountBalance] = useState(2000);
  
  // Cash Rewards Data
  const cashRewardTiers = [
    { min: 500, reward: 15, newMemberReward: 5 },
    { min: 1000, reward: 40, newMemberReward: 20 },
    { min: 3000, reward: 120, newMemberReward: 60 }
  ];
  
  const getCurrentTier = (amount) => {
    for (let i = cashRewardTiers.length - 1; i >= 0; i--) {
      if (amount >= cashRewardTiers[i].min) {
        return cashRewardTiers[i];
      }
    }
    return null;
  };
  
  const currentTier = getCurrentTier(investmentAmount);
  const totalCashReward = currentTier ? currentTier.reward * numInvites : 0;
  
  // Additional Signal Rewards Data
  const meetsSignalThreshold = investmentAmount >= 500 && (investmentAmount >= accountBalance * 0.3);
  const signalProfitProjection = meetsSignalThreshold ? (accountBalance * 0.12) : 0;
  
  // Manager Bonus Data
  const managerLevels = [
    { level: 1, perPayment: 25, monthly: 75, yearly: 900, requiredInvites: 5 },
    { level: 2, perPayment: 80, monthly: 240, yearly: 2880, requiredInvites: 10 },
    { level: 3, perPayment: 150, monthly: 450, yearly: 5400, requiredInvites: 20 }
  ];
  
  const getManagerLevel = (invites) => {
    if (invites >= 20) return managerLevels[2];
    if (invites >= 10) return managerLevels[1];
    if (invites >= 5) return managerLevels[0];
    return null;
  };
  
  const currentManagerLevel = getManagerLevel(numInvites);
  const qualifiesForManager = numInvites >= 5 && investmentAmount >= 500;
  
  // Chart Data
  const rewardComparisonData = [
    {
      name: 'Cash Rewards',
      amount: totalCashReward
    },
    {
      name: 'Signal Profits',
      amount: signalProfitProjection
    },
    {
      name: 'Monthly Manager Bonus',
      amount: currentManagerLevel ? currentManagerLevel.monthly : 0
    }
  ];
  
  const tierComparisonData = cashRewardTiers.map(tier => ({
    name: `$${tier.min}+`,
    'Your Reward': tier.reward,
    'Friend Reward': tier.newMemberReward
  }));

  return (
    <div className="w-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-xl backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-2 mb-6">
        <Award className="h-8 w-8 text-amber-400" />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Global Investment Group Rewards Dashboard
        </h1>
      </div>

      <Tabs defaultValue="cash">
        <TabsList className="grid grid-cols-3 mb-4 bg-black/30 backdrop-blur-sm">
          <TabsTrigger value="cash" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Cash Rewards
          </TabsTrigger>
          <TabsTrigger value="signal" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Signal Rewards
          </TabsTrigger>
          <TabsTrigger value="manager" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Manager Bonus
          </TabsTrigger>
        </TabsList>
        
        <div className="grid gap-4 mb-4">
          <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Simulation Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm mb-1 block">Friend's Investment: ${investmentAmount}</label>
                  <Slider 
                    value={[investmentAmount]} 
                    min={100} 
                    max={5000} 
                    step={100}
                    onValueChange={(value) => setInvestmentAmount(value[0])}
                    className="my-2"
                  />
                </div>
                <div>
                  <label className="text-sm mb-1 block">Number of Friends Invited: {numInvites}</label>
                  <Slider 
                    value={[numInvites]} 
                    min={1} 
                    max={25} 
                    step={1}
                    onValueChange={(value) => setNumInvites(value[0])}
                    className="my-2"
                  />
                </div>
                <div>
                  <label className="text-sm mb-1 block">Your PCEX Account Balance: ${accountBalance}</label>
                  <Slider 
                    value={[accountBalance]} 
                    min={500} 
                    max={10000} 
                    step={500}
                    onValueChange={(value) => setAccountBalance(value[0])}
                    className="my-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <TabsContent value="cash" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10 h-full">
              <CardHeader>
                <CardTitle>Cash Reward Tiers</CardTitle>
                <CardDescription>Rewards based on investment amount</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tierComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Your Reward" fill="#8884d8" />
                    <Bar dataKey="Friend Reward" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle>Your Cash Rewards Summary</CardTitle>
                <CardDescription>Based on your simulation settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                      <div className="text-sm text-blue-300">Current Tier</div>
                      <div className="text-2xl font-bold">{currentTier ? `$${currentTier.min}+` : 'N/A'}</div>
                    </div>
                    <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                      <div className="text-sm text-green-300">Reward Per Friend</div>
                      <div className="text-2xl font-bold">${currentTier ? currentTier.reward : 0}</div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                    <div className="text-sm text-purple-300">Total Cash Rewards</div>
                    <div className="text-3xl font-bold">${totalCashReward}</div>
                    <div className="text-xs mt-1 text-gray-400">For inviting {numInvites} friend(s) who each invest ${investmentAmount}</div>
                    
                  </div>
                  
                  <div className="bg-amber-500/20 p-4 rounded-lg border border-amber-500/30">
                    <div className="text-sm text-amber-300">Multi-level Rewards</div>
                    <div className="text-md mt-1">
                      If your invited friends also invite others who invest $1,000+, you'll receive additional rewards from their invitations!
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="signal" className="mt-0">
          <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle>Additional Signal Rewards</CardTitle>
              <CardDescription>Trading signals provide extra profit opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${meetsSignalThreshold ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                    <div className={`text-sm ${meetsSignalThreshold ? 'text-green-300' : 'text-red-300'}`}>Signal Eligibility</div>
                    <div className="text-xl font-bold">{meetsSignalThreshold ? 'Eligible' : 'Not Eligible'}</div>
                    <div className="text-xs mt-2">
                      Requirements:
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li className={investmentAmount >= 500 ? 'text-green-400' : 'text-red-400'}>
                          Friend's investment ≥ $500 {investmentAmount >= 500 ? '✓' : '✗'}
                        </li>
                        <li className={investmentAmount >= accountBalance * 0.3 ? 'text-green-400' : 'text-red-400'}>
                          Friend's investment ≥ 30% of your balance {investmentAmount >= accountBalance * 0.3 ? '✓' : '✗'}
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                    <div className="text-sm text-blue-300">Signal Benefits</div>
                    <div className="space-y-2 mt-2">
                      <div>• 20 additional trading signals over 5 days</div>
                      <div>• 4 signals per day at 21:00</div>
                      <div>• Both you and your friend receive signals</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                    <div className="text-sm text-purple-300">Projected Signal Profits</div>
                    <div className="text-3xl font-bold">${signalProfitProjection.toFixed(2)}</div>
                    <div className="text-xs mt-1 text-gray-400">Based on your current account balance of ${accountBalance}</div>
                  </div>
                  
                  <div className="bg-amber-500/20 p-4 rounded-lg border border-amber-500/30">
                    <div className="text-sm text-amber-300">Signal Profit Potential</div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-xs">$1,000 account</div>
                      <div className="text-right">≈ $120 profit</div>
                      <div className="text-xs">$2,000 account</div>
                      <div className="text-right">≈ $240 profit</div>
                      <div className="text-xs">Your account (${accountBalance})</div>
                      <div className="text-right">≈ ${(accountBalance * 0.12).toFixed(2)} profit</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manager" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle>Manager Bonus Levels</CardTitle>
                <CardDescription>Regular bonuses based on your manager level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {managerLevels.map((level, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border ${numInvites >= level.requiredInvites && investmentAmount >= 500 ? 'bg-green-500/20 border-green-500/30' : 'bg-gray-500/20 border-gray-500/30'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-md font-medium">Level {level.level} Manager</div>
                        <div className="text-sm">{level.requiredInvites}+ invites required</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <div>
                          <div className="text-xs text-gray-400">Per Payment</div>
                          <div className="text-md font-bold">${level.perPayment}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Monthly</div>
                          <div className="text-md font-bold">${level.monthly}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Yearly</div>
                          <div className="text-md font-bold">${level.yearly}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle>Your Manager Status</CardTitle>
                <CardDescription>Based on your simulation settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${qualifiesForManager ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                    <div className={`text-sm ${qualifiesForManager ? 'text-green-300' : 'text-red-300'}`}>Manager Eligibility</div>
                    <div className="text-xl font-bold">{qualifiesForManager ? 'Eligible' : 'Not Eligible'}</div>
                    <div className="text-xs mt-2">
                      Requirements:
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li className={numInvites >= 5 ? 'text-green-400' : 'text-red-400'}>
                          At least 5 invited members {numInvites >= 5 ? '✓' : '✗'}
                        </li>
                        <li className={investmentAmount >= 500 ? 'text-green-400' : 'text-red-400'}>
                          Each member invests ≥ $500 {investmentAmount >= 500 ? '✓' : '✗'}
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                    <div className="text-sm text-purple-300">Your Current Level</div>
                    <div className="text-3xl font-bold">
                      {currentManagerLevel ? `Level ${currentManagerLevel.level}` : 'Not a Manager Yet'}
                    </div>
                    <div className="text-xs mt-1 text-gray-400">
                      {currentManagerLevel 
                        ? `With ${numInvites} invited members at $${investmentAmount} each` 
                        : 'Invite more members to qualify'}
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                    <div className="text-sm text-blue-300">Payment Schedule</div>
                    <div className="mt-2">
                      <div>• 1st of each month</div>
                      <div>• 11th of each month</div>
                      <div>• 21st of each month</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-4 bg-black/30 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle>Total Rewards Comparison</CardTitle>
          <CardDescription>Based on your current simulation settings</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rewardComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

ReactDOM.render(<RewardsDashboard />, document.getElementById('root'));
