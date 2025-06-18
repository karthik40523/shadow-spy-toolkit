
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, Loader2, Server } from 'lucide-react';

interface BannerResult {
  port: number;
  service: string;
  banner: string;
  version?: string;
}

const BannerGrabber = () => {
  const [target, setTarget] = useState('');
  const [ports, setPorts] = useState('21,22,25,53,80,110,143,443,993,995');
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [results, setResults] = useState<BannerResult[]>([]);
  const [bannerLog, setBannerLog] = useState<string[]>([]);

  const serviceBanners: Record<number, { service: string; banner: string; version?: string }> = {
    21: { service: 'FTP', banner: '220 ProFTPD 1.3.5 Server ready', version: 'ProFTPD 1.3.5' },
    22: { service: 'SSH', banner: 'SSH-2.0-OpenSSH_7.4', version: 'OpenSSH 7.4' },
    25: { service: 'SMTP', banner: '220 mail.example.com ESMTP Postfix', version: 'Postfix' },
    53: { service: 'DNS', banner: 'DNS response', version: 'BIND 9.11' },
    80: { service: 'HTTP', banner: 'HTTP/1.1 200 OK\nServer: Apache/2.4.41', version: 'Apache 2.4.41' },
    110: { service: 'POP3', banner: '+OK Dovecot ready', version: 'Dovecot' },
    143: { service: 'IMAP', banner: '* OK [CAPABILITY IMAP4rev1] Dovecot ready', version: 'Dovecot' },
    443: { service: 'HTTPS', banner: 'HTTP/1.1 200 OK\nServer: nginx/1.18.0', version: 'nginx 1.18.0' },
    993: { service: 'IMAPS', banner: '* OK [CAPABILITY IMAP4rev1] Dovecot ready (SSL)', version: 'Dovecot SSL' },
    995: { service: 'POP3S', banner: '+OK Dovecot ready (SSL)', version: 'Dovecot SSL' }
  };

  const simulateBannerGrab = async () => {
    if (!target || !ports) return;
    
    setIsGrabbing(true);
    setResults([]);
    setBannerLog([]);
    
    const portList = ports.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
    
    setBannerLog(prev => [...prev, `[*] Starting banner grabbing on ${target}`]);
    setBannerLog(prev => [...prev, `[*] Checking ${portList.length} ports for banners...`]);
    
    for (const port of portList) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
      
      // Simulate connection attempt
      setBannerLog(prev => [...prev, `[*] Connecting to ${target}:${port}...`]);
      
      // Simulate banner response (70% chance of getting a banner)
      if (Math.random() > 0.3) {
        const bannerInfo = serviceBanners[port] || {
          service: 'Unknown',
          banner: `Service running on port ${port}`,
          version: 'Unknown version'
        };
        
        const result: BannerResult = {
          port,
          service: bannerInfo.service,
          banner: bannerInfo.banner,
          version: bannerInfo.version
        };
        
        setResults(prev => [...prev, result]);
        setBannerLog(prev => [...prev, `[+] Banner grabbed from port ${port} (${bannerInfo.service})`]);
        setBannerLog(prev => [...prev, `    ${bannerInfo.banner}`]);
      } else {
        setBannerLog(prev => [...prev, `[-] No banner received from port ${port}`]);
      }
    }
    
    setBannerLog(prev => [...prev, `[*] Banner grabbing completed. Retrieved ${results.length} banners.`]);
    setIsGrabbing(false);
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card className="bg-gray-800 border-green-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-400" />
            Banner Grabber Configuration
          </CardTitle>
          <CardDescription className="text-gray-400">
            Grab service banners from open ports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target" className="text-green-400">Target IP/Domain</Label>
              <Input
                id="target"
                placeholder="192.168.1.1 or example.com"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="bg-gray-900 border-green-800 text-white placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ports" className="text-green-400">Ports (comma-separated)</Label>
              <Input
                id="ports"
                placeholder="21,22,25,80,443"
                value={ports}
                onChange={(e) => setPorts(e.target.value)}
                className="bg-gray-900 border-green-800 text-white placeholder-gray-500"
              />
            </div>
          </div>
          <Button 
            onClick={simulateBannerGrab} 
            disabled={!target || !ports || isGrabbing}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white"
          >
            {isGrabbing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Grabbing Banners...
              </>
            ) : (
              'Start Banner Grabbing'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Banner Results */}
        <Card className="bg-gray-800 border-green-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-green-400" />
              Captured Banners ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="p-4 bg-gray-900 rounded border border-green-800">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-green-400 font-mono text-lg">Port {result.port}</span>
                      <span className="text-blue-400 text-sm">{result.service}</span>
                    </div>
                    <div className="bg-gray-800 p-3 rounded border border-gray-700">
                      <pre className="text-green-300 text-sm font-mono whitespace-pre-wrap">
                        {result.banner}
                      </pre>
                    </div>
                    {result.version && (
                      <div className="mt-2 text-yellow-400 text-sm">
                        Version: {result.version}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No banners captured yet...</p>
            )}
          </CardContent>
        </Card>

        {/* Banner Log */}
        <Card className="bg-gray-800 border-green-800">
          <CardHeader>
            <CardTitle className="text-white">Banner Grabbing Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 p-4 rounded border border-green-800 h-80 overflow-y-auto font-mono text-sm">
              {bannerLog.length > 0 ? (
                bannerLog.map((log, index) => (
                  <div key={index} className={`mb-1 ${
                    log.includes('[+]') ? 'text-green-400' : 
                    log.includes('[-]') ? 'text-red-400' : 
                    log.startsWith('    ') ? 'text-blue-300' :
                    'text-green-400'
                  }`}>
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Banner grabbing log will appear here...</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BannerGrabber;
