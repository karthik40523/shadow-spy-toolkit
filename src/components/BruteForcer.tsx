
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Lock, Loader2, AlertTriangle } from 'lucide-react';

interface BruteResult {
  username: string;
  password: string;
  status: 'success' | 'failed';
  timestamp: string;
}

const BruteForcer = () => {
  const [targetUrl, setTargetUrl] = useState('');
  const [usernames, setUsernames] = useState('admin\nuser\ntest\nroot\nadministrator');
  const [passwords, setPasswords] = useState('admin\npassword\n123456\ntest\nroot');
  const [isBruteForcing, setIsBruteForcing] = useState(false);
  const [results, setResults] = useState<BruteResult[]>([]);
  const [bruteLog, setBruteLog] = useState<string[]>([]);
  const [successfulLogins, setSuccessfulLogins] = useState<BruteResult[]>([]);

  const simulateBruteForce = async () => {
    if (!targetUrl) return;
    
    setIsBruteForcing(true);
    setResults([]);
    setBruteLog([]);
    setSuccessfulLogins([]);
    
    const usernameList = usernames.split('\n').filter(u => u.trim());
    const passwordList = passwords.split('\n').filter(p => p.trim());
    
    setBruteLog(prev => [...prev, `[*] Starting brute force on ${targetUrl}`]);
    setBruteLog(prev => [...prev, `[*] Testing ${usernameList.length} usernames with ${passwordList.length} passwords`]);
    setBruteLog(prev => [...prev, `[*] Total combinations: ${usernameList.length * passwordList.length}`]);
    
    for (const username of usernameList) {
      for (const password of passwordList) {
        // Simulate attempt delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
        
        const timestamp = new Date().toLocaleTimeString();
        
        // Simulate login attempt (very low success rate for demo)
        const isSuccess = Math.random() > 0.95 && (username === 'admin' && password === 'admin');
        
        const result: BruteResult = {
          username,
          password,
          status: isSuccess ? 'success' : 'failed',
          timestamp
        };
        
        setResults(prev => [...prev, result]);
        
        if (isSuccess) {
          setSuccessfulLogins(prev => [...prev, result]);
          setBruteLog(prev => [...prev, `[+] SUCCESS! ${username}:${password} - Login successful!`]);
        } else {
          setBruteLog(prev => [...prev, `[-] FAILED: ${username}:${password}`]);
        }
      }
    }
    
    setBruteLog(prev => [...prev, `[*] Brute force completed. Found ${successfulLogins.length} valid credentials.`]);
    setIsBruteForcing(false);
  };

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <Card className="bg-red-900/20 border-red-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Ethical Use Warning</p>
              <p className="text-sm text-red-300">Only use this tool against systems you own or have explicit permission to test.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card className="bg-gray-800 border-green-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-green-400" />
            Brute Force Configuration
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure login brute force parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target-url" className="text-green-400">Target Login URL</Label>
            <Input
              id="target-url"
              placeholder="http://example.com/login"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="bg-gray-900 border-green-800 text-white placeholder-gray-500"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usernames" className="text-green-400">Username Wordlist</Label>
              <Textarea
                id="usernames"
                placeholder="One username per line"
                value={usernames}
                onChange={(e) => setUsernames(e.target.value)}
                className="bg-gray-900 border-green-800 text-white placeholder-gray-500 h-32 font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwords" className="text-green-400">Password Wordlist</Label>
              <Textarea
                id="passwords"
                placeholder="One password per line"
                value={passwords}
                onChange={(e) => setPasswords(e.target.value)}
                className="bg-gray-900 border-green-800 text-white placeholder-gray-500 h-32 font-mono text-sm"
              />
            </div>
          </div>
          
          <Button 
            onClick={simulateBruteForce} 
            disabled={!targetUrl || isBruteForcing}
            className="w-full bg-red-700 hover:bg-red-600 text-white"
          >
            {isBruteForcing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Brute Forcing...
              </>
            ) : (
              'Start Brute Force Attack'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Successful Logins */}
        <Card className="bg-gray-800 border-green-800">
          <CardHeader>
            <CardTitle className="text-white">Successful Logins ({successfulLogins.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {successfulLogins.length > 0 ? (
              <div className="space-y-2">
                {successfulLogins.map((result, index) => (
                  <div key={index} className="p-3 bg-green-900/20 rounded border border-green-700">
                    <div className="font-mono text-green-400">
                      {result.username}:{result.password}
                    </div>
                    <div className="text-xs text-green-300">
                      {result.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No successful logins found yet...</p>
            )}
          </CardContent>
        </Card>

        {/* Attack Log */}
        <Card className="bg-gray-800 border-green-800">
          <CardHeader>
            <CardTitle className="text-white">Attack Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 p-4 rounded border border-green-800 h-64 overflow-y-auto font-mono text-sm">
              {bruteLog.length > 0 ? (
                bruteLog.map((log, index) => (
                  <div key={index} className={`mb-1 ${log.includes('SUCCESS') ? 'text-green-400' : log.includes('FAILED') ? 'text-red-400' : 'text-green-400'}`}>
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Attack log will appear here...</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BruteForcer;
