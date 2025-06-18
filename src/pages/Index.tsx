
import { useState } from 'react';
import { Shield, Wifi, Lock, Eye, FolderSearch, Terminal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PortScanner from '@/components/PortScanner';
import BruteForcer from '@/components/BruteForcer';
import BannerGrabber from '@/components/BannerGrabber';
import DirectoryScanner from '@/components/DirectoryScanner';

const Index = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const modules = [
    {
      id: 'port-scanner',
      title: 'Port Scanner',
      description: 'Scan TCP ports with multi-threading support',
      icon: Wifi,
      component: PortScanner
    },
    {
      id: 'brute-forcer',
      title: 'Brute Forcer',
      description: 'Login brute-force with wordlist support',
      icon: Lock,
      component: BruteForcer
    },
    {
      id: 'banner-grabber',
      title: 'Banner Grabber',
      description: 'Fetch service banners from open ports',
      icon: Eye,
      component: BannerGrabber
    },
    {
      id: 'directory-scanner',
      title: 'Directory Scanner',
      description: 'Discover hidden directories and files',
      icon: FolderSearch,
      component: DirectoryScanner
    }
  ];

  const ActiveComponent = activeModule ? modules.find(m => m.id === activeModule)?.component : null;

  return (
    <div className="min-h-screen bg-gray-900 text-green-400">
      {/* Header */}
      <header className="border-b border-green-800 bg-gray-950">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-green-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">PenTest Toolkit</h1>
              <p className="text-green-300">Modular Penetration Testing Suite</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!activeModule ? (
          <>
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-900/20 px-4 py-2 rounded-full border border-green-800 mb-6">
                <Terminal className="h-4 w-4" />
                <span className="text-sm font-mono">v1.0.0 - Ethical Use Only</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Professional Security Testing Tools
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                A comprehensive suite of penetration testing modules designed for security professionals 
                and ethical hackers. Choose a module below to begin your security assessment.
              </p>
            </div>

            {/* Modules Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {modules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <Card 
                    key={module.id} 
                    className="bg-gray-800 border-green-800 hover:border-green-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20 cursor-pointer group"
                    onClick={() => setActiveModule(module.id)}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-green-900/20 rounded-full w-fit group-hover:bg-green-900/30 transition-colors">
                        <IconComponent className="h-8 w-8 text-green-400" />
                      </div>
                      <CardTitle className="text-white text-lg">{module.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {module.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="p-6">
                <div className="text-2xl font-bold text-green-400 mb-2">Fast</div>
                <div className="text-gray-300">Multi-threaded scanning for optimal performance</div>
              </div>
              <div className="p-6">
                <div className="text-2xl font-bold text-green-400 mb-2">Modular</div>
                <div className="text-gray-300">Extensible architecture for custom modules</div>
              </div>
              <div className="p-6">
                <div className="text-2xl font-bold text-green-400 mb-2">Secure</div>
                <div className="text-gray-300">Built with security best practices in mind</div>
              </div>
              <div className="p-6">
                <div className="text-2xl font-bold text-green-400 mb-2">Professional</div>
                <div className="text-gray-300">Enterprise-grade penetration testing tools</div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                onClick={() => setActiveModule(null)}
                className="border-green-800 text-green-400 hover:bg-green-900/20"
              >
                ← Back to Menu
              </Button>
              <h2 className="text-2xl font-bold text-white">
                {modules.find(m => m.id === activeModule)?.title}
              </h2>
            </div>
            {ActiveComponent && <ActiveComponent />}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-green-800 bg-gray-950 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-400 mb-2">
            ⚠️ For educational and authorized penetration testing purposes only
          </p>
          <p className="text-sm text-gray-500">
            Always ensure you have proper authorization before testing any systems
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
