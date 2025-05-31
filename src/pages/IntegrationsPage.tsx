import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Puzzle, Plus, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const IntegrationsPage = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    
    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
    
    if (email) {
      setUserEmail(email);
    }
  }, [navigate]);

  const categories = [
    'all', 'Communication', 'CRM', 'Productivity', 'Marketing', 'E-commerce', 
    'Analytics', 'Finance', 'HR', 'Development', 'Storage', 'Social Media'
  ];

  const integrations = [
    // Communication
    { id: 1, name: 'Slack', category: 'Communication', status: 'Connected', description: 'Team messaging platform', popularity: 98 },
    { id: 2, name: 'Microsoft Teams', category: 'Communication', status: 'Disconnected', description: 'Video conferencing and chat', popularity: 95 },
    { id: 3, name: 'Discord', category: 'Communication', status: 'Connected', description: 'Voice and text chat', popularity: 85 },
    { id: 4, name: 'Zoom', category: 'Communication', status: 'Disconnected', description: 'Video conferencing', popularity: 92 },
    { id: 5, name: 'Telegram', category: 'Communication', status: 'Disconnected', description: 'Messaging app', popularity: 78 },
    
    // CRM
    { id: 6, name: 'Salesforce', category: 'CRM', status: 'Connected', description: 'Customer relationship management', popularity: 97 },
    { id: 7, name: 'HubSpot', category: 'CRM', status: 'Connected', description: 'Marketing automation platform', popularity: 94 },
    { id: 8, name: 'Pipedrive', category: 'CRM', status: 'Disconnected', description: 'Sales pipeline management', popularity: 82 },
    { id: 9, name: 'Zoho CRM', category: 'CRM', status: 'Disconnected', description: 'Customer management suite', popularity: 76 },
    { id: 10, name: 'Freshworks', category: 'CRM', status: 'Disconnected', description: 'Customer experience software', popularity: 71 },
    
    // Productivity
    { id: 11, name: 'Google Workspace', category: 'Productivity', status: 'Disconnected', description: 'Email and document collaboration', popularity: 96 },
    { id: 12, name: 'Microsoft 365', category: 'Productivity', status: 'Connected', description: 'Office productivity suite', popularity: 94 },
    { id: 13, name: 'Notion', category: 'Productivity', status: 'Connected', description: 'All-in-one workspace', popularity: 88 },
    { id: 14, name: 'Asana', category: 'Productivity', status: 'Disconnected', description: 'Project management tool', popularity: 85 },
    { id: 15, name: 'Trello', category: 'Productivity', status: 'Connected', description: 'Visual project management', popularity: 83 },
    { id: 16, name: 'Monday.com', category: 'Productivity', status: 'Disconnected', description: 'Work management platform', popularity: 80 },
    { id: 17, name: 'Airtable', category: 'Productivity', status: 'Disconnected', description: 'Spreadsheet-database hybrid', popularity: 77 },
    { id: 18, name: 'ClickUp', category: 'Productivity', status: 'Disconnected', description: 'All-in-one productivity app', popularity: 75 },
    
    // Marketing
    { id: 19, name: 'Mailchimp', category: 'Marketing', status: 'Connected', description: 'Email marketing platform', popularity: 91 },
    { id: 20, name: 'Constant Contact', category: 'Marketing', status: 'Disconnected', description: 'Email and social marketing', popularity: 73 },
    { id: 21, name: 'Campaign Monitor', category: 'Marketing', status: 'Disconnected', description: 'Email marketing software', popularity: 68 },
    { id: 22, name: 'ConvertKit', category: 'Marketing', status: 'Disconnected', description: 'Creator marketing platform', popularity: 65 },
    { id: 23, name: 'ActiveCampaign', category: 'Marketing', status: 'Disconnected', description: 'Customer experience automation', popularity: 79 },
    
    // E-commerce
    { id: 24, name: 'Shopify', category: 'E-commerce', status: 'Connected', description: 'E-commerce platform', popularity: 93 },
    { id: 25, name: 'WooCommerce', category: 'E-commerce', status: 'Disconnected', description: 'WordPress e-commerce plugin', popularity: 87 },
    { id: 26, name: 'Magento', category: 'E-commerce', status: 'Disconnected', description: 'Open-source e-commerce', popularity: 72 },
    { id: 27, name: 'BigCommerce', category: 'E-commerce', status: 'Disconnected', description: 'E-commerce SaaS platform', popularity: 69 },
    { id: 28, name: 'Square', category: 'E-commerce', status: 'Disconnected', description: 'Point of sale system', popularity: 81 },
    
    // Analytics
    { id: 29, name: 'Google Analytics', category: 'Analytics', status: 'Connected', description: 'Web analytics service', popularity: 99 },
    { id: 30, name: 'Mixpanel', category: 'Analytics', status: 'Disconnected', description: 'Product analytics platform', popularity: 74 },
    { id: 31, name: 'Amplitude', category: 'Analytics', status: 'Disconnected', description: 'Digital optimization system', popularity: 70 },
    { id: 32, name: 'Hotjar', category: 'Analytics', status: 'Disconnected', description: 'Website heatmaps and recordings', popularity: 76 },
    
    // Finance
    { id: 33, name: 'QuickBooks', category: 'Finance', status: 'Connected', description: 'Accounting software', popularity: 89 },
    { id: 34, name: 'Xero', category: 'Finance', status: 'Disconnected', description: 'Cloud accounting software', popularity: 74 },
    { id: 35, name: 'FreshBooks', category: 'Finance', status: 'Disconnected', description: 'Cloud accounting for small business', popularity: 67 },
    { id: 36, name: 'Stripe', category: 'Finance', status: 'Connected', description: 'Online payment processing', popularity: 92 },
    { id: 37, name: 'PayPal', category: 'Finance', status: 'Disconnected', description: 'Digital payment platform', popularity: 90 },
    
    // HR
    { id: 38, name: 'BambooHR', category: 'HR', status: 'Disconnected', description: 'HR management system', popularity: 78 },
    { id: 39, name: 'Workday', category: 'HR', status: 'Disconnected', description: 'Enterprise HR software', popularity: 73 },
    { id: 40, name: 'ADP', category: 'HR', status: 'Disconnected', description: 'Payroll and HR services', popularity: 75 },
    { id: 41, name: 'Gusto', category: 'HR', status: 'Disconnected', description: 'Payroll and benefits platform', popularity: 71 },
    
    // Development
    { id: 42, name: 'GitHub', category: 'Development', status: 'Connected', description: 'Code hosting platform', popularity: 96 },
    { id: 43, name: 'GitLab', category: 'Development', status: 'Disconnected', description: 'DevOps platform', popularity: 78 },
    { id: 44, name: 'Jira', category: 'Development', status: 'Connected', description: 'Issue tracking and project management', popularity: 86 },
    { id: 45, name: 'Bitbucket', category: 'Development', status: 'Disconnected', description: 'Git repository management', popularity: 65 },
    
    // Storage
    { id: 46, name: 'Google Drive', category: 'Storage', status: 'Connected', description: 'Cloud storage service', popularity: 97 },
    { id: 47, name: 'Dropbox', category: 'Storage', status: 'Disconnected', description: 'File hosting service', popularity: 84 },
    { id: 48, name: 'OneDrive', category: 'Storage', status: 'Connected', description: 'Microsoft cloud storage', popularity: 81 },
    { id: 49, name: 'Box', category: 'Storage', status: 'Disconnected', description: 'Enterprise cloud storage', popularity: 66 },
    
    // Social Media
    { id: 50, name: 'Facebook', category: 'Social Media', status: 'Connected', description: 'Social networking platform', popularity: 95 },
    { id: 51, name: 'Twitter', category: 'Social Media', status: 'Disconnected', description: 'Microblogging platform', popularity: 88 },
    { id: 52, name: 'LinkedIn', category: 'Social Media', status: 'Connected', description: 'Professional networking', popularity: 91 },
    { id: 53, name: 'Instagram', category: 'Social Media', status: 'Disconnected', description: 'Photo and video sharing', popularity: 93 },
    { id: 54, name: 'YouTube', category: 'Social Media', status: 'Disconnected', description: 'Video sharing platform', popularity: 96 },
    { id: 55, name: 'TikTok', category: 'Social Media', status: 'Disconnected', description: 'Short-form video platform', popularity: 89 }
  ];

  const filteredIntegrations = integrations
    .filter(integration => {
      const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           integration.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => b.popularity - a.popularity);

  const connectedIntegrations = filteredIntegrations.filter(i => i.status === 'Connected');
  const availableIntegrations = filteredIntegrations.filter(i => i.status === 'Disconnected');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-light text-gray-900">Integrations</h1>
                  <p className="text-gray-600">Connect your favorite tools and services</p>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Integration
                </Button>
              </div>

              {/* Filters */}
              <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search integrations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80 border-gray-200"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48 bg-white/80 border-gray-200">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Stats */}
              <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="bg-white/80 border-gray-200/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-light text-green-600">{connectedIntegrations.length}</p>
                    <p className="text-sm text-gray-600">Connected</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 border-gray-200/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-light text-blue-600">{availableIntegrations.length}</p>
                    <p className="text-sm text-gray-600">Available</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 border-gray-200/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-light text-purple-600">{categories.length - 1}</p>
                    <p className="text-sm text-gray-600">Categories</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 border-gray-200/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-light text-orange-600">{integrations.length}</p>
                    <p className="text-sm text-gray-600">Total</p>
                  </CardContent>
                </Card>
              </div>

              {/* Connected Integrations */}
              {connectedIntegrations.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Connected Integrations ({connectedIntegrations.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {connectedIntegrations.map((integration) => (
                      <Card key={integration.id} className="bg-white/80 border-green-200/50 hover:shadow-lg transition-all duration-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100">
                                <Puzzle className="h-4 w-4 text-green-600" />
                              </div>
                              <span className="font-medium">{integration.name}</span>
                            </div>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                {integration.category}
                              </span>
                              <span className="text-xs text-gray-500">
                                {integration.popularity}% popular
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{integration.description}</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            >
                              Configure
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Integrations */}
              {availableIntegrations.length > 0 && (
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
                    <Plus className="h-5 w-5 text-blue-500 mr-2" />
                    Available Integrations ({availableIntegrations.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {availableIntegrations.map((integration) => (
                      <Card key={integration.id} className="bg-white/80 border-gray-200/50 hover:shadow-lg transition-all duration-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                                <Puzzle className="h-4 w-4 text-indigo-600" />
                              </div>
                              <span className="font-medium">{integration.name}</span>
                            </div>
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                {integration.category}
                              </span>
                              <span className="text-xs text-gray-500">
                                {integration.popularity}% popular
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{integration.description}</p>
                            <Button 
                              variant="default" 
                              size="sm"
                              className="w-full text-xs bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                            >
                              Connect
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {filteredIntegrations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No integrations found matching your criteria.</p>
                </div>
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default IntegrationsPage;
