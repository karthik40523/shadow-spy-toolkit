
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FolderSearch, Loader2, Folder, File } from 'lucide-react';

interface DirectoryResult {
  path: string;
  status: number;
  size?: string;
  type: 'directory' | 'file';
}

const DirectoryScanner = () => {
  const [targetUrl, setTargetUrl] = useState('');
  const [wordlist, setWordlist] = useState('admin\nlogin\ntest\nbackup\nconfig\napi\nupload\nimages\njs\ncss\ndocs\ndownload\nphpmyadmin\nadmin.php\nlogin.php\nconfig.php\nbackup.zip\nrobots.txt\nsitemap.xml');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<DirectoryResult[]>([]);
  const [scanLog, setScanLog] = useState<string[]>([]);

  const simulateDirectoryScan = async () => {
    if (!targetUrl || !wordlist) return;
    
    setIsScanning(true);
    setResults([]);
    setScanLog([]);
    
    const paths = wordlist.split('\n').filter(p => p.trim());
    
    setScanLog(prev => [...prev, `[*] Starting directory scan on ${targetUrl}`]);
    setScanLog(prev => [...prev, `[*] Testing ${paths.length} paths...`]);
    
    for (const path of paths) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
      
      const fullUrl = `${targetUrl.replace(/\/$/, '')}/${path.trim()}`;
      
      // Simulate HTTP response (20% chance of finding something)
      const statusCodes = [200, 301, 302, 403, 404];
      const randomStatus = statusCodes[Math.floor(Math.random() * statusCodes.length)];
      
      // Higher chance for common paths to exist
      const commonPaths = ['admin', 'login', 'images', 'css', 'js', 'api', 'docs'];
      const isCommonPath = commonPaths.some(common => path.toLowerCase().includes(common));
      const foundSomething = isCommonPath ? Math.random() > 0.4 : Math.random() > 0.8;
      
      if (foundSomething && randomStatus !== 404) {
        const isDirectory = !path.includes('.') || path.endsWith('/');
        const result: DirectoryResult = {
          path: fullUrl,
          status: randomStatus,
          size: isDirectory ? undefined : `${Math.floor(Math.random() * 50000) + 1000}B`,
          type: isDirectory ? 'directory' : 'file'
        };
        
        setResults(prev => [...prev, result]);
        
        const statusColor = randomStatus === 200 ? '[+]' : 
                           randomStatus === 301 || randomStatus === 302 ? '[~]' :
                           randomStatus === 403 ? '[!]' : '[+]';
        
        setScanLog(prev => [...prev, `${statusColor} ${randomStatus} - ${fullUrl}`]);
      } else {
        setScanLog(prev => [...prev, `[-] 404 - ${fullUrl}`]);
      }
    }
    
    setScanLog(prev => [...prev, `[*] Directory scan completed. Found ${results.length} accessible paths.`]);
    setIsScanning(false);
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 200: return 'text-green-400';
      case 301:
      case 302: return 'text-yellow-400';
      case 403: return 'text-orange-400';
      default: return 'text-blue-400';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 200: return 'OK';
      case 301: return 'Moved Permanently';
      case 302: return 'Found';
      case 403: return 'Forbidden';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card className="bg-gray-800 border-green-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FolderSearch className="h-5 w-5 text-green-400" />
            Directory Scanner Configuration
          </CardTitle>
          <CardDescription className="text-gray-400">
            Discover hidden directories and files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target-url" className="text-green-400">Target URL</Label>
            <Input
              id="target-url"
              placeholder="http://example.com"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="bg-gray-900 border-green-800 text-white placeholder-gray-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wordlist" className="text-green-400">Directory/File Wordlist</Label>
            <Textarea
              id="wordlist"
              placeholder="One path per line (e.g., admin, login.php, backup/)"
              value={wordlist}
              onChange={(e) => setWordlist(e.target.value)}
              className="bg-gray-900 border-green-800 text-white placeholder-gray-500 h-32 font-mono text-sm"
            />
          </div>
          
          <Button 
            onClick={simulateDirectoryScan} 
            disabled={!targetUrl || !wordlist || isScanning}
            className="w-full bg-purple-700 hover:bg-purple-600 text-white"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning Directories...
              </>
            ) : (
              'Start Directory Scan'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Found Directories */}
        <Card className="bg-gray-800 border-green-800">
          <CardHeader>
            <CardTitle className="text-white">Found Paths ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="p-3 bg-gray-900 rounded border border-green-800">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {result.type === 'directory' ? 
                          <Folder className="h-4 w-4 text-blue-400" /> : 
                          <File className="h-4 w-4 text-green-400" />
                        }
                        <span className="text-white text-sm font-mono break-all">
                          {result.path}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={`font-mono ${getStatusColor(result.status)}`}>
                        {result.status} {getStatusText(result.status)}
                      </span>
                      {result.size && (
                        <span className="text-gray-400">{result.size}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No accessible paths found yet...</p>
            )}
          </CardContent>
        </Card>

        {/* Scan Log */}
        <Card className="bg-gray-800 border-green-800">
          <CardHeader>
            <CardTitle className="text-white">Scan Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 p-4 rounded border border-green-800 h-80 overflow-y-auto font-mono text-sm">
              {scanLog.length > 0 ? (
                scanLog.map((log, index) => (
                  <div key={index} className={`mb-1 ${
                    log.includes('[+]') ? 'text-green-400' : 
                    log.includes('[~]') ? 'text-yellow-400' :
                    log.includes('[!]') ? 'text-orange-400' :
                    log.includes('[-]') ? 'text-red-400' : 
                    'text-green-400'
                  }`}>
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Directory scan log will appear here...</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DirectoryScanner;
