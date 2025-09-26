'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Play, 
  Volume2, 
  Wifi, 
  Smartphone,
  Monitor,
  RefreshCw,
  Info,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { audioManager } from '@/lib/audio-manager';

interface AudioTroubleshooterProps {
  onResolutionFound?: (resolution: string) => void;
  className?: string;
}

interface DiagnosticTest {
  id: string;
  name: string;
  description: string;
  test: () => Promise<boolean>;
  fix?: () => Promise<void>;
  fixDescription?: string;
  severity: 'low' | 'medium' | 'high';
}

export const AudioTroubleshooter: React.FC<AudioTroubleshooterProps> = ({
  onResolutionFound,
  className
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { passed: boolean; error?: string }>>({});
  const [progress, setProgress] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const diagnosticTests: DiagnosticTest[] = [
    {
      id: 'audio-support',
      name: 'Audio Support',
      description: 'Check if browser supports audio playback',
      severity: 'high',
      test: async () => {
        return audioManager.isAudioSupported();
      }
    },
    {
      id: 'autoplay-policy',
      name: 'Autoplay Policy',
      description: 'Test browser autoplay restrictions',
      severity: 'medium',
      test: async () => {
        return await audioManager.checkAutoplaySupport();
      },
      fix: async () => {
        await audioManager.unlockAudioContext();
      },
      fixDescription: 'Click to unlock audio context'
    },
    {
      id: 'network-connectivity',
      name: 'Network Connection',
      description: 'Verify internet connectivity',
      severity: 'high',
      test: async () => {
        return navigator.onLine;
      }
    },
    {
      id: 'audio-format',
      name: 'Audio Format Support',
      description: 'Check MP3 format compatibility',
      severity: 'medium',
      test: async () => {
        const audio = document.createElement('audio');
        return !!(audio.canPlayType && audio.canPlayType('audio/mpeg').replace(/no/, ''));
      }
    },
    {
      id: 'audio-context',
      name: 'Web Audio Context',
      description: 'Test Web Audio API availability',
      severity: 'low',
      test: async () => {
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContext) return false;
          const context = new AudioContext();
          const result = context.state !== 'suspended';
          context.close();
          return result;
        } catch {
          return false;
        }
      },
      fix: async () => {
        await audioManager.unlockAudioContext();
      },
      fixDescription: 'Initialize audio context'
    },
    {
      id: 'cors-policy',
      name: 'CORS Policy',
      description: 'Test cross-origin audio loading',
      severity: 'medium',
      test: async () => {
        try {
          const audio = new Audio();
          audio.crossOrigin = 'anonymous';
          return true;
        } catch {
          return false;
        }
      }
    },
    {
      id: 'volume-settings',
      name: 'System Volume',
      description: 'Check if system audio is muted',
      severity: 'medium',
      test: async () => {
        // This is a basic check - browsers don't expose system volume
        return !audioManager.isGloballyMuted();
      },
      fix: async () => {
        audioManager.setGlobalMute(false);
      },
      fixDescription: 'Unmute audio globally'
    },
    {
      id: 'audio-file',
      name: 'Audio File Access',
      description: 'Test loading of audio files',
      severity: 'high',
      test: async () => {
        try {
          const audio = new Audio();
          return new Promise<boolean>((resolve) => {
            const timeout = setTimeout(() => {
              resolve(false);
            }, 5000);

            audio.addEventListener('loadstart', () => {
              clearTimeout(timeout);
              resolve(true);
            });

            audio.addEventListener('error', () => {
              clearTimeout(timeout);
              resolve(false);
            });

            audio.src = '/assets/audio/backing-music-compressed.mp3';
            audio.load();
          });
        } catch {
          return false;
        }
      }
    }
  ];

  const runDiagnostics = useCallback(async () => {
    setIsRunning(true);
    setResults({});
    setProgress(0);
    setSuggestions([]);

    const newResults: Record<string, { passed: boolean; error?: string }> = {};
    const newSuggestions: string[] = [];

    for (let i = 0; i < diagnosticTests.length; i++) {
      const test = diagnosticTests[i];
      setCurrentTest(test.id);
      setProgress(((i + 1) / diagnosticTests.length) * 100);

      try {
        const passed = await test.test();
        newResults[test.id] = { passed };

        if (!passed) {
          switch (test.severity) {
            case 'high':
              newSuggestions.push(`Critical: ${test.name} failed - this may prevent audio playback entirely`);
              break;
            case 'medium':
              newSuggestions.push(`Warning: ${test.name} failed - audio may work but with limitations`);
              break;
            case 'low':
              newSuggestions.push(`Info: ${test.name} failed - consider alternative audio methods`);
              break;
          }

          if (test.fixDescription) {
            newSuggestions.push(`Suggested fix: ${test.fixDescription}`);
          }
        }
      } catch (error) {
        newResults[test.id] = { 
          passed: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        newSuggestions.push(`Error testing ${test.name}: ${error}`);
      }
    }

    setResults(newResults);
    setSuggestions(newSuggestions);
    setCurrentTest(null);
    setIsRunning(false);

    // Generate resolution summary
    const failedCritical = diagnosticTests.filter(test => 
      test.severity === 'high' && !newResults[test.id]?.passed
    );

    if (failedCritical.length === 0) {
      onResolutionFound?.('Audio system appears functional. If issues persist, try refreshing the page or clearing browser cache.');
    } else {
      onResolutionFound?.(`Critical issues found: ${failedCritical.map(t => t.name).join(', ')}. Please address these before attempting audio playback.`);
    }
  }, [diagnosticTests, onResolutionFound]);

  const applyFix = useCallback(async (testId: string) => {
    const test = diagnosticTests.find(t => t.id === testId);
    if (test?.fix) {
      try {
        await test.fix();
        // Re-run this specific test
        const result = await test.test();
        setResults(prev => ({
          ...prev,
          [testId]: { passed: result }
        }));
      } catch (error) {
        console.error(`Failed to apply fix for ${testId}:`, error);
      }
    }
  }, [diagnosticTests]);

  const getTestIcon = (testId: string) => {
    const result = results[testId];
    if (!result) {
      return currentTest === testId ? 
        <RefreshCw className="h-4 w-4 animate-spin text-blue-500" /> :
        <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
    
    return result.passed ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> :
      <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getSeverityColor = (severity: DiagnosticTest['severity']) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className={cn('w-full max-w-2xl', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Audio Troubleshooter
        </CardTitle>
        <CardDescription>
          Diagnose and fix common audio playback issues
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Running diagnostics...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Run Diagnostics Button */}
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Audio Diagnostics
            </>
          )}
        </Button>

        {/* Test Results */}
        {Object.keys(results).length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Diagnostic Results</h3>
            {diagnosticTests.map(test => (
              <div key={test.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="mt-0.5">
                  {getTestIcon(test.id)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{test.name}</h4>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', getSeverityColor(test.severity))}>
                      {test.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{test.description}</p>
                  {results[test.id]?.error && (
                    <p className="text-xs text-red-600 mt-1">Error: {results[test.id].error}</p>
                  )}
                </div>
                {test.fix && !results[test.id]?.passed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyFix(test.id)}
                    className="text-xs"
                  >
                    Fix
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Info className="h-4 w-4" />
              Suggestions
            </h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 text-sm p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                  <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Solutions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Common Solutions</h3>
          <div className="grid gap-3 text-sm">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 font-medium mb-2">
                <Smartphone className="h-4 w-4" />
                Mobile Devices
              </div>
              <ul className="space-y-1 text-muted-foreground text-xs">
                <li>• Tap anywhere on the screen to enable audio</li>
                <li>• Check if device is on silent/vibrate mode</li>
                <li>• Increase volume using device buttons</li>
                <li>• Close other audio apps that might interfere</li>
              </ul>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 font-medium mb-2">
                <Monitor className="h-4 w-4" />
                Desktop Browsers
              </div>
              <ul className="space-y-1 text-muted-foreground text-xs">
                <li>• Click anywhere to satisfy autoplay policy</li>
                <li>• Check browser audio settings</li>
                <li>• Ensure site is not muted in browser tab</li>
                <li>• Try refreshing the page</li>
              </ul>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 font-medium mb-2">
                <Wifi className="h-4 w-4" />
                Network Issues
              </div>
              <ul className="space-y-1 text-muted-foreground text-xs">
                <li>• Check internet connection</li>
                <li>• Try compressed audio version</li>
                <li>• Wait for full buffering before playing</li>
                <li>• Clear browser cache and cookies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* External Help */}
        <div className="pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href="https://support.google.com/chrome/answer/2693767" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Browser Audio Help
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioTroubleshooter;