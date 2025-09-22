// Audio Assets Configuration
// This file manages all audio assets for the atmospheric audio system

export interface AudioAsset {
  id: string
  name: string
  url: string
  description: string
  duration?: number // in seconds
  loop: boolean
  volume: number // default volume (0-1)
  tags: string[]
}

// Default audio assets
// Note: These are placeholder URLs. Replace with your actual audio files.
export const audioAssets: AudioAsset[] = [
  {
    id: 'ambient-welcome',
    name: 'Welcome Ambient',
    url: '/audio/ambient-welcome.mp3',
    description: 'Soft, welcoming ambient sound for hero sections',
    duration: 180,
    loop: true,
    volume: 0.3,
    tags: ['ambient', 'welcome', 'soft', 'hero']
  },
  {
    id: 'ambient-focus',
    name: 'Focus Ambient',
    url: '/audio/ambient-focus.mp3',
    description: 'Concentration-enhancing ambient for platform/feature sections',
    duration: 240,
    loop: true,
    volume: 0.25,
    tags: ['ambient', 'focus', 'professional', 'platform']
  },
  {
    id: 'ambient-calm',
    name: 'Calm Ambient',
    url: '/audio/ambient-calm.mp3',
    description: 'Calming ambient for approach/methodology sections',
    duration: 200,
    loop: true,
    volume: 0.2,
    tags: ['ambient', 'calm', 'peaceful', 'approach']
  },
  {
    id: 'ambient-personal',
    name: 'Personal Ambient',
    url: '/audio/ambient-personal.mp3',
    description: 'Warm, personal ambient for founder/team sections',
    duration: 160,
    loop: true,
    volume: 0.22,
    tags: ['ambient', 'personal', 'warm', 'founder']
  },
  {
    id: 'ambient-inspiring',
    name: 'Inspiring Ambient',
    url: '/audio/ambient-inspiring.mp3',
    description: 'Uplifting ambient for CTA/action sections',
    duration: 120,
    loop: true,
    volume: 0.35,
    tags: ['ambient', 'inspiring', 'uplifting', 'cta']
  },
  {
    id: 'ambient-minimal',
    name: 'Minimal Ambient',
    url: '/audio/ambient-minimal.mp3',
    description: 'Ultra-subtle ambient for minimal implementations',
    duration: 300,
    loop: true,
    volume: 0.15,
    tags: ['ambient', 'minimal', 'subtle', 'background']
  }
]

// Audio collections for different themes
export const audioCollections = {
  healthcare: [
    'ambient-welcome',
    'ambient-focus',
    'ambient-calm',
    'ambient-personal',
    'ambient-inspiring'
  ],
  minimal: [
    'ambient-minimal'
  ],
  professional: [
    'ambient-focus',
    'ambient-calm',
    'ambient-inspiring'
  ]
}

// Utility functions
export function getAudioAsset(id: string): AudioAsset | undefined {
  return audioAssets.find(asset => asset.id === id)
}

export function getAudioCollection(theme: keyof typeof audioCollections): AudioAsset[] {
  const assetIds = audioCollections[theme] || []
  return assetIds.map(id => getAudioAsset(id)).filter(Boolean) as AudioAsset[]
}

export function getAudioAssetsByTag(tag: string): AudioAsset[] {
  return audioAssets.filter(asset => asset.tags.includes(tag))
}

// Section-to-audio mapping for different presets
export const sectionAudioMappings = {
  healthcare: {
    hero: 'ambient-welcome',
    platform: 'ambient-focus',
    approach: 'ambient-calm',
    founder: 'ambient-personal',
    join: 'ambient-inspiring'
  },
  minimal: {
    hero: 'ambient-minimal'
  },
  progressive: {
    hero: 'ambient-calm',
    platform: 'ambient-focus',
    join: 'ambient-inspiring'
  }
}

// Generate section configuration from mapping
export function generateSectionConfig(preset: keyof typeof sectionAudioMappings) {
  const mapping = sectionAudioMappings[preset]
  
  return Object.entries(mapping).map(([sectionId, assetId]) => {
    const asset = getAudioAsset(assetId)
    if (!asset) {
      console.warn(`Audio asset '${assetId}' not found for section '${sectionId}'`)
      return null
    }
    
    return {
      sectionId,
      trackUrl: asset.url,
      volume: asset.volume,
      delay: 500 // Default delay
    }
  }).filter(Boolean)
}

// Audio loading utilities
export async function preloadAudioAsset(asset: AudioAsset): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = new Audio()
    
    audio.addEventListener('canplaythrough', () => {
      resolve(true)
    })
    
    audio.addEventListener('error', () => {
      console.warn(`Failed to preload audio asset: ${asset.id}`)
      resolve(false)
    })
    
    audio.src = asset.url
    audio.load()
  })
}

export async function preloadAudioCollection(theme: keyof typeof audioCollections): Promise<boolean[]> {
  const assets = getAudioCollection(theme)
  return Promise.all(assets.map(preloadAudioAsset))
}

// Audio format detection and fallbacks
export function getAudioFormat(): 'mp3' | 'ogg' | 'wav' | 'unsupported' {
  const audio = new Audio()
  
  if (audio.canPlayType('audio/mpeg').replace(/no/, '')) {
    return 'mp3'
  } else if (audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, '')) {
    return 'ogg'
  } else if (audio.canPlayType('audio/wav; codecs="1"').replace(/no/, '')) {
    return 'wav'
  }
  
  return 'unsupported'
}

// Check if audio is supported in the browser
export function isAudioSupported(): boolean {
  return typeof Audio !== 'undefined' && getAudioFormat() !== 'unsupported'
}

// Volume level recommendations
export const volumeLevels = {
  silent: 0,
  whisper: 0.1,
  subtle: 0.2,
  ambient: 0.3,
  present: 0.4,
  prominent: 0.5
} as const

export type VolumeLevel = keyof typeof volumeLevels

export function getVolumeLevel(level: VolumeLevel): number {
  return volumeLevels[level]
}

// Audio accessibility utilities
export function createAudioDescription(asset: AudioAsset): string {
  return `Background ambient audio: ${asset.description}. Volume level: ${Math.round(asset.volume * 100)}%.`
}

export function announceAudioState(isPlaying: boolean, currentAsset?: AudioAsset): string {
  if (!isPlaying) {
    return "Background audio paused"
  }
  
  if (currentAsset) {
    return `Playing ambient audio: ${currentAsset.name}`
  }
  
  return "Background audio playing"
}