
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wifi, CheckCircle } from 'lucide-react';

interface ScanResult {
  port: number;
  status: 'open' | 'closed';
  service?: string;
}

const PortScanner = () => {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('common');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [scanLog, setScanLog] = useState<string[]>([]);

  const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 1080, 3389, 5432, 5900, 8080];
  
  const portServices: Record<number, string> = {
    21: 'FTP',
    22: 'SSH',
    23: 'Telnet',
    25: 'SMTP',
    53: 'DNS',
    80: 'HTTP',
    110: 'POP3',
    143: 'IMAP',
    443: 'HTTPS',
    993: 'IMAPS',
    995: 'POP3S',
    1080: 'SOCKS',
    3389: 'RDP',
    5432: 'PostgreSQL',
    5900: 'VNC',
    8080: 'HTTP-Alt'
  };

  const simulatePortScan = async () => {
    if (!target) return;
    
    setIsScanning(true);
    setResults([]);
    setScanLog([]);
    
    const portsToScan = scanType === 'common' ? commonPorts : Array.from({length: 100}, (_, i) => i + 1);
    
    setScanLog(prev => [...prev, `[*] Starting port scan on ${target}`]);
    setScanLog(prev => [...prev, `[*] Scanning ${portsToScan.length} ports...`]);
    
    for (const port of portsToScan) {
      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
      
      // Simulate port status (some ports randomly open)
      const isOpen = Math.random() > 0.85; // 15% chance of being open
      
      if (isOpen) {
        const result: ScanResult = {
          port,
          status: 'open',
          service: portServices[port] || 'Unknown'
        };
        setResults(prev => [...prev, result]);
        setScanLog(prev => [...prev, `[+] Port ${port} is open (${result.service})`]);
      }
    }
    
    setScanLog(prev => [...prev, `[*] Scan completed. Found ${results.length} open ports.`]);
    setIsScanning(false);
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card className="bg-gray-800 border-green-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wifi className="h-5 w-5 text-green-400" />
            Port Scanner Configuration
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure your port scanning parameters
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
              <Label htmlFor="scanType" className="text-green-400">Scan Type</Label>
              <Select value={scanType} onValueChange={setScanType}>
                <SelectTrigger className="bg-gray-900 border-green-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-green-800">
                  <SelectItem value="common">Common Ports (16 ports)</SelectItem>
                  <SelectItem value="full">Full Scan (1-100)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            onClick={simulatePortScan} 
            disabled={!target || isScanning}
            className="w-full bg-green-700 hover:bg-green-600 text-white"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              'Start Port Scan'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Open Ports */}
        <Card className="bg-gray-800 border-green-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Open Ports ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded border border-green-800">
                    <span className="text-green-400 font-mono">Port {result.port}</span>
                    <span className="text-white text-sm">{result.service}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No open ports found yet...</p>
            )}
          </CardContent>
        </Card>

        {/* Scan Log */}
        <Card className="bg-gray-800 border-green-800">
          <CardHeader>
            <CardTitle className="text-white">Scan Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 p-4 rounded border border-green-800 h-64 overflow-y-auto font-mono text-sm">
              {scanLog.length > 0 ? (
                scanLog.map((log, index) => (
                  <div key={index} className="text-green-400 mb-1">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Scan log will appear here...</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortScanner;
