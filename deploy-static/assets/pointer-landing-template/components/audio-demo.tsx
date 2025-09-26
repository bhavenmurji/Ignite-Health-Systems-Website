"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Volume2, VolumeX, Music, Settings, Info } from 'lucide-react'
import { useAudioContext } from './audio-context-manager'

/**
 * Audio Demo Component - Shows the current state of the atmospheric audio system
 * This is a demo/debug component - remove from production
 */
export function AudioDemo() {
  const {
    isAudioEnabled,
    masterVolume,
    isGloballyMuted,
    enableAudio,
    disableAudio,
    setMasterVolume,
    toggleGlobalMute
  } = useAudioContext()

  const [showDetails, setShowDetails] = useState(false)

  const getStatusColor = () => {
    if (!isAudioEnabled) return 'secondary'
    if (isGloballyMuted) return 'destructive'
    return 'default'
  }

  const getStatusText = () => {
    if (!isAudioEnabled) return 'Disabled'
    if (isGloballyMuted) return 'Muted'
    return 'Active'
  }

  return (
    <Card className="fixed bottom-4 left-4 w-80 z-50 bg-background/95 backdrop-blur-sm border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            <CardTitle className="text-sm">Atmospheric Audio</CardTitle>
            <Badge variant={getStatusColor()} className="text-xs">
              {getStatusText()}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>
        <CardDescription className="text-xs">
          Section-aware ambient audio system
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Quick Controls */}
        <div className="flex items-center gap-2 mb-3">
          <Button
            size="sm"
            variant={isAudioEnabled ? "default" : "outline"}
            onClick={isAudioEnabled ? disableAudio : enableAudio}
            className="flex-1"
          >
            {isAudioEnabled ? <Volume2 className="w-3 h-3 mr-1" /> : <VolumeX className="w-3 h-3 mr-1" />}
            {isAudioEnabled ? 'Disable' : 'Enable'}
          </Button>
          
          {isAudioEnabled && (
            <Button
              size="sm"
              variant={isGloballyMuted ? "destructive" : "outline"}
              onClick={toggleGlobalMute}
            >
              {isGloballyMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </Button>
          )}
        </div>

        {/* Volume Control */}
        {isAudioEnabled && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Volume</span>
              <span>{Math.round(masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        {/* Detailed Information */}
        {showDetails && (
          <div className="border-t pt-3 space-y-2">
            <div className="text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span>{getStatusText()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Master Volume:</span>
                <span>{Math.round(masterVolume * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Muted:</span>
                <span>{isGloballyMuted ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div className="border-t pt-2">
              <div className="flex items-start gap-2">
                <Info className="w-3 h-3 mt-0.5 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">
                  Audio changes automatically as you scroll through sections. 
                  The subtle indicator in the corner shows current status.
                </div>
              </div>
            </div>

            <div className="border-t pt-2 text-xs text-muted-foreground">
              <p className="mb-1 font-medium">Features:</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs">
                <li>Section-aware track switching</li>
                <li>Smooth crossfade transitions</li>
                <li>Respects motion preferences</li>
                <li>Persistent user settings</li>
                <li>Accessibility compliant</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Production-ready minimal status indicator
export function AudioStatusIndicator() {
  const { isAudioEnabled, isGloballyMuted } = useAudioContext()

  if (!isAudioEnabled) return null

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5">
        <div className={`w-2 h-2 rounded-full ${isGloballyMuted ? 'bg-red-500' : 'bg-green-500'}`} />
        <span className="text-xs text-muted-foreground">
          {isGloballyMuted ? 'Audio Muted' : 'Audio Active'}
        </span>
      </div>
    </div>
  )
}