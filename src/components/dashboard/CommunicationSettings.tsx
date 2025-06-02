
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Network, 
  Plus, 
  Trash2, 
  Edit, 
  Globe, 
  Shield, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Settings as SettingsIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NetworkConnection {
  id: number;
  name: string;
  networkName: string;
  status: 'connected' | 'disconnected' | 'pending';
  type: 'internal' | 'external' | 'partner';
  lastSync: string;
  agentsConnected: number;
}

const CommunicationSettings = () => {
  const { toast } = useToast();
  const [networks, setNetworks] = useState<NetworkConnection[]>([
    {
      id: 1,
      name: 'Internal Network',
      networkName: 'corp-internal-net',
      status: 'connected',
      type: 'internal',
      lastSync: '2024-01-30 14:32',
      agentsConnected: 12
    },
    {
      id: 2,
      name: 'Partner Supply Chain',
      networkName: 'supply-chain-partners',
      status: 'connected',
      type: 'partner',
      lastSync: '2024-01-30 14:28',
      agentsConnected: 8
    },
    {
      id: 3,
      name: 'Financial Services Hub',
      networkName: 'finserv-hub-network',
      status: 'pending',
      type: 'external',
      lastSync: '2024-01-29 16:45',
      agentsConnected: 0
    }
  ]);

  const [newNetworkName, setNewNetworkName] = useState('');
  const [newNetworkDisplayName, setNewNetworkDisplayName] = useState('');
  const [newNetworkType, setNewNetworkType] = useState<'internal' | 'external' | 'partner'>('internal');

  const addNetwork = () => {
    if (!newNetworkName.trim() || !newNetworkDisplayName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both network name and display name.",
        variant: "destructive",
      });
      return;
    }

    const newNetwork: NetworkConnection = {
      id: Date.now(),
      name: newNetworkDisplayName,
      networkName: newNetworkName,
      status: 'pending',
      type: newNetworkType,
      lastSync: 'Never',
      agentsConnected: 0
    };

    setNetworks(prev => [...prev, newNetwork]);
    setNewNetworkName('');
    setNewNetworkDisplayName('');
    
    toast({
      title: "Network Added",
      description: `Network "${newNetworkDisplayName}" has been added and is pending connection.`,
    });
  };

  const removeNetwork = (networkId: number, networkName: string) => {
    setNetworks(prev => prev.filter(network => network.id !== networkId));
    toast({
      title: "Network Removed",
      description: `${networkName} has been disconnected and removed.`,
      variant: "destructive",
    });
  };

  const toggleNetworkStatus = (networkId: number) => {
    setNetworks(prev => prev.map(network => 
      network.id === networkId 
        ? { 
            ...network, 
            status: network.status === 'connected' ? 'disconnected' : 'connected',
            lastSync: network.status === 'disconnected' ? new Date().toLocaleString() : network.lastSync
          }
        : network
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internal':
        return 'bg-blue-100 text-blue-700';
      case 'external':
        return 'bg-purple-100 text-purple-700';
      case 'partner':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Network className="h-5 w-5 mr-2" />
          Communication Networks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global Communication Settings */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-4 flex items-center">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Global Communication Settings
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Cross-Network Communication</Label>
                <p className="text-sm text-gray-600">Allow AI employees to communicate across networks</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Automatic Network Discovery</Label>
                <p className="text-sm text-gray-600">Automatically discover compatible networks</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>End-to-End Encryption</Label>
                <p className="text-sm text-gray-600">Encrypt all cross-network communications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Protocol Translation</Label>
                <p className="text-sm text-gray-600">Automatically translate between protocols</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Add New Network */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-4">Add New Communication Network</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input 
                id="displayName" 
                placeholder="e.g., Partner Network"
                value={newNetworkDisplayName}
                onChange={(e) => setNewNetworkDisplayName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="networkName">Network Name</Label>
              <Input 
                id="networkName" 
                placeholder="e.g., partner-network-001"
                value={newNetworkName}
                onChange={(e) => setNewNetworkName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="networkType">Network Type</Label>
              <select 
                id="networkType" 
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={newNetworkType}
                onChange={(e) => setNewNetworkType(e.target.value as 'internal' | 'external' | 'partner')}
              >
                <option value="internal">Internal</option>
                <option value="external">External</option>
                <option value="partner">Partner</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={addNetwork} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Network
              </Button>
            </div>
          </div>
        </div>

        {/* Network List */}
        <div className="space-y-4">
          <h4 className="font-medium">Active Communication Networks</h4>
          {networks.map((network) => (
            <div key={network.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(network.status)}
                    <h5 className="font-medium">{network.name}</h5>
                  </div>
                  <Badge variant="outline" className={getTypeColor(network.type)}>
                    {network.type}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(network.status)}>
                    {network.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleNetworkStatus(network.id)}
                    disabled={network.status === 'pending'}
                  >
                    {network.status === 'connected' ? 'Disconnect' : 'Connect'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeNetwork(network.id, network.name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Network Name:</span>
                  <div className="font-mono bg-gray-100 p-2 rounded text-xs mt-1">
                    {network.networkName}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Agents Connected:</span>
                  <div className="mt-1">{network.agentsConnected}</div>
                </div>
                <div>
                  <span className="font-medium">Last Sync:</span>
                  <div className="mt-1">{network.lastSync}</div>
                </div>
                <div>
                  <span className="font-medium">Type:</span>
                  <div className="mt-1 capitalize">{network.type}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Network Security Notice */}
        <div className="bg-amber-50 p-4 rounded-lg">
          <h5 className="font-medium text-amber-900 mb-2 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Network Security Notice
          </h5>
          <p className="text-sm text-amber-800">
            All network communications are encrypted end-to-end. Only authorized AI employees can access cross-network communication channels. 
            Monitor network activity regularly and remove unused connections to maintain security.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunicationSettings;
