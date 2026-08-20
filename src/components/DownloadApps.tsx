
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Download, Apple, Zap } from 'lucide-react';

const DownloadApps = () => {
  return (
    <section className="py-20 bg-[color:var(--sand)] text-[color:var(--ink)]">
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
              <div className="w-64 h-96 bg-gradient-to-b from-[color:var(--ink)] to-[color:var(--ink)] rounded-[28px] mx-auto lg:mx-0 p-4 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-b from-[color:var(--blue-100)] to-[color:var(--paper)] rounded-[28px] p-4 flex flex-col">
                  <div className="text-center mb-4">
                    <div className="w-8 h-8 bg-[color:var(--ink)] rounded-[16px] mx-auto mb-2 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[color:var(--paper)] rounded-sm"></div>
                    </div>
                    <h3 className="text-sm font-medium text-[color:var(--ink)]">3days.ai</h3>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="h-8 bg-[color:var(--blue-100)] rounded-[16px] flex items-center px-3">
                      <div className="w-3 h-3 bg-[color:var(--blue)] rounded-full mr-2"></div>
                      <div className="text-xs text-[color:var(--ink)]">AI Chat Active</div>
                    </div>
                    <div className="h-6 bg-[color:var(--sand)] rounded"></div>
                    <div className="h-6 bg-[color:var(--sand)] rounded w-3/4"></div>
                    <div className="h-8 bg-[color:var(--blue-100)] rounded-[16px] flex items-center px-3">
                      <Zap className="w-3 h-3 text-[color:var(--blue)] mr-2" />
                      <div className="text-xs text-[color:var(--ink)]">Task Approved</div>
                    </div>
                    <div className="h-6 bg-[color:var(--sand)] rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-[color:var(--blue)] rounded-full flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Right side - Download buttons and features */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-[color:var(--paper)] border-[color:var(--line)] hover:bg-[color:var(--sand)] transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <Apple className="h-12 w-12 mx-auto mb-4 text-[color:var(--ink)]" />
                  <h3 className="text-lg font-medium mb-2">iOS App</h3>
                  <p className="text-sm opacity-80 mb-4">Download for iPhone and iPad</p>
                  <Button className="w-full bg-[color:var(--ink)] text-white hover:bg-[color:var(--text-2)] rounded-full">
                    App Store
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-[color:var(--paper)] border-[color:var(--line)] hover:bg-[color:var(--sand)] transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <Smartphone className="h-12 w-12 mx-auto mb-4 text-[color:var(--ink)]" />
                  <h3 className="text-lg font-medium mb-2">Android App</h3>
                  <p className="text-sm opacity-80 mb-4">Download for Android devices</p>
                  <Button className="w-full bg-[color:var(--ink)] text-white hover:bg-[color:var(--text-2)] rounded-full">
                    Google Play
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="bg-black/4 rounded-[28px] p-6">
              <h4 className="text-lg font-medium mb-4">Mobile Features</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[color:var(--blue)] rounded-full mr-3"></div>
                  <span className="text-sm">Real-time task notifications</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[color:var(--blue)] rounded-full mr-3"></div>
                  <span className="text-sm">Voice commands for AI assistants</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[color:var(--blue)] rounded-full mr-3"></div>
                  <span className="text-sm">Quick approval workflows</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[color:var(--ink)] rounded-full mr-3"></div>
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
