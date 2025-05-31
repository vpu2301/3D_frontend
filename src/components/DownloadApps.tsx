
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Download, Apple, Zap } from 'lucide-react';

const DownloadApps = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light mb-6">Get 3days.ai on Mobile</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Take your AI workforce with you. Manage tasks, chat with assistants, and approve workflows from anywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - App preview mockup */}
          <div className="text-center lg:text-left">
            <div className="relative inline-block">
              <div className="w-64 h-96 bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl mx-auto lg:mx-0 p-4 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-b from-blue-50 to-white rounded-2xl p-4 flex flex-col">
                  <div className="text-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-sm"></div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">3days.ai</h3>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="h-8 bg-blue-100 rounded-lg flex items-center px-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <div className="text-xs text-gray-700">AI Chat Active</div>
                    </div>
                    <div className="h-6 bg-gray-100 rounded"></div>
                    <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-8 bg-green-100 rounded-lg flex items-center px-3">
                      <Zap className="w-3 h-3 text-green-600 mr-2" />
                      <div className="text-xs text-gray-700">Task Approved</div>
                    </div>
                    <div className="h-6 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Right side - Download buttons and features */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <Apple className="h-12 w-12 mx-auto mb-4 text-white" />
                  <h3 className="text-lg font-medium mb-2">iOS App</h3>
                  <p className="text-sm opacity-80 mb-4">Download for iPhone and iPad</p>
                  <Button className="w-full bg-white text-gray-900 hover:bg-gray-100">
                    App Store
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <Smartphone className="h-12 w-12 mx-auto mb-4 text-white" />
                  <h3 className="text-lg font-medium mb-2">Android App</h3>
                  <p className="text-sm opacity-80 mb-4">Download for Android devices</p>
                  <Button className="w-full bg-white text-gray-900 hover:bg-gray-100">
                    Google Play
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white/5 rounded-2xl p-6">
              <h4 className="text-lg font-medium mb-4">Mobile Features</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-sm">Real-time task notifications</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-sm">Voice commands for AI assistants</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-sm">Quick approval workflows</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  <span className="text-sm">Offline sync capabilities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApps;
