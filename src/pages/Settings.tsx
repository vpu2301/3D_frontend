import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Key, Copy, Plus, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Production API Key',
      key: 'sk-abc123def456ghi789jkl012mno345pqr678stu901',
      type: 'API Key',
      created: '2024-01-15',
      lastUsed: '2024-01-30',
      status: 'active'
    },
    {
      id: 2,
      name: 'Development Token',
      key: 'dev-token-xyz789abc123def456ghi789jkl012',
      type: 'Access Token',
      created: '2024-01-20',
      lastUsed: '2024-01-29',
      status: 'active'
    }
  ]);
  const [showKeys, setShowKeys] = useState<{[key: number]: boolean}>({});
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState('API Key');
  const { toast } = useToast();

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

  const generateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Missing Name",
        description: "Please enter a name for your API key.",
        variant: "destructive",
      });
      return;
    }

    const keyPrefix = newKeyType === 'API Key' ? 'sk-' : 'at-';
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newKey = keyPrefix + randomString + Math.random().toString(36).substring(2, 15);

    const newApiKey = {
      id: Date.now(),
      name: newKeyName,
      key: newKey,
      type: newKeyType,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'active'
    };

    setApiKeys(prev => [...prev, newApiKey]);
    setNewKeyName('');
    
    toast({
      title: "API Key Generated",
      description: `${newKeyType} "${newKeyName}" has been created successfully.`,
    });
  };

  const copyToClipboard = (key: string, name: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied!",
      description: `${name} has been copied to clipboard.`,
    });
  };

  const toggleKeyVisibility = (keyId: number) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const deleteKey = (keyId: number, keyName: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
    toast({
      title: "API Key Deleted",
      description: `${keyName} has been permanently deleted.`,
      variant: "destructive",
    });
  };

  const regenerateKey = (keyId: number) => {
    const key = apiKeys.find(k => k.id === keyId);
    if (!key) return;

    const keyPrefix = key.type === 'API Key' ? 'sk-' : 'at-';
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newKeyValue = keyPrefix + randomString + Math.random().toString(36).substring(2, 15);

    setApiKeys(prev => prev.map(k => 
      k.id === keyId 
        ? { ...k, key: newKeyValue, created: new Date().toISOString().split('T')[0], lastUsed: 'Never' }
        : k
    ));

    toast({
      title: "API Key Regenerated",
      description: `${key.name} has been regenerated with a new value.`,
    });
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 8) + '•'.repeat(key.length - 12) + key.substring(key.length - 4);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-light text-gray-900">Settings</h1>
                  <p className="text-gray-600">Manage your account and platform preferences</p>
                </div>
              </div>

              <div className="max-w-4xl space-y-6">
                {/* Profile Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Profile Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Enter your first name" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Enter your last name" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={userEmail} disabled />
                    </div>
                    <Button>Save Profile</Button>
                  </CardContent>
                </Card>

                {/* API Keys & Tokens */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Key className="h-5 w-5 mr-2" />
                      API Keys & Tokens
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Generate New Key */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-4">Generate New API Key or Token</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="keyName">Name</Label>
                          <Input 
                            id="keyName" 
                            placeholder="e.g., Production API Key"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="keyType">Type</Label>
                          <select 
                            id="keyType" 
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                            value={newKeyType}
                            onChange={(e) => setNewKeyType(e.target.value)}
                          >
                            <option value="API Key">API Key</option>
                            <option value="Access Token">Access Token</option>
                            <option value="Webhook Token">Webhook Token</option>
                            <option value="Integration Key">Integration Key</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <Button onClick={generateKey} className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Generate
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Existing Keys */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Your API Keys & Tokens</h4>
                      {apiKeys.map((apiKey) => (
                        <div key={apiKey.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h5 className="font-medium">{apiKey.name}</h5>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <Badge variant="outline">{apiKey.type}</Badge>
                                <span>Created: {apiKey.created}</span>
                                <span>Last used: {apiKey.lastUsed}</span>
                                <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                                  {apiKey.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleKeyVisibility(apiKey.id)}
                              >
                                {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(apiKey.key, apiKey.name)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => regenerateKey(apiKey.id)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteKey(apiKey.id, apiKey.name)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                            {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2">Security Notice</h5>
                      <p className="text-sm text-blue-800">
                        Keep your API keys secure and never share them publicly. 
                        If you suspect a key has been compromised, regenerate it immediately.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notification Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive email notifications for important updates</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Task Completion Alerts</Label>
                        <p className="text-sm text-gray-600">Get notified when AI tasks are completed</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>System Maintenance</Label>
                        <p className="text-sm text-gray-600">Receive alerts about scheduled maintenance</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" placeholder="Enter current password" />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" placeholder="Enter new password" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <Switch />
                    </div>
                    <Button>Update Security Settings</Button>
                  </CardContent>
                </Card>

                {/* Appearance Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="h-5 w-5 mr-2" />
                      Appearance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Dark Mode</Label>
                        <p className="text-sm text-gray-600">Switch to dark theme</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Compact Layout</Label>
                        <p className="text-sm text-gray-600">Use a more compact interface layout</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Settings;
