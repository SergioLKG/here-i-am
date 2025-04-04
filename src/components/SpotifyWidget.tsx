"use client"

import { useState, useEffect } from "react"
import { Music, Play, Pause } from "lucide-react"

interface SpotifyWidgetProps {
  lang: "es" | "en"
  clientId: string
  clientSecret: string
  redirectUri: string
  fallbackPlaylistId?: string // ID de la playlist de respaldo
}

interface SpotifyTrack {
  id: string
  title: string
  artist: string
  albumArt: string
  duration: number
  progress: number
  isPlaying: boolean
  previewUrl?: string
  spotifyUrl: string
}

interface PlaylistTrack {
  id: string
  name: string
  artists: string
  image: string
  previewUrl?: string
  spotifyUrl: string
}

export default function SpotifyWidget({ 
  lang, 
  clientId, 
  clientSecret, 
  redirectUri,
  fallbackPlaylistId 
}: SpotifyWidgetProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState("")
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null)
  const [fallbackTracks, setFallbackTracks] = useState<PlaylistTrack[]>([])
  const [isPlayingPreview, setIsPlayingPreview] = useState(false)
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  const translations = {
    en: {
      title: "Now Playing",
      notPlaying: "Not playing",
      recommendations: "Recommended Tracks",
      play: "Play",
      pause: "Pause",
      connect: "Connect Spotify",
      playPreview: "Play Preview",
      pausePreview: "Pause Preview"
    },
    es: {
      title: "Reproduciendo",
      notPlaying: "No reproduciendo",
      recommendations: "Canciones Recomendadas",
      play: "Reproducir",
      pause: "Pausar",
      connect: "Conectar Spotify",
      playPreview: "Reproducir Vista Previa",
      pausePreview: "Pausar Vista Previa"
    },
  }

  const t = translations[lang]

  // Obtener código de autorización
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')

    const exchangeCodeForToken = async (authCode: string) => {
      const tokenEndpoint = 'https://accounts.spotify.com/api/token'
      const authString = btoa(`${clientId}:${clientSecret}`)

      try {
        const response = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: redirectUri
          })
        })

        if (!response.ok) {
          throw new Error('Token exchange failed')
        }

        const tokenData = await response.json()
        setAccessToken(tokenData.access_token)
        setIsAuthenticated(true)
        
        // Si hay playlist de respaldo, cargarla
        if (fallbackPlaylistId) {
          fetchPlaylistTracks(tokenData.access_token, fallbackPlaylistId)
        }
        
        window.history.replaceState({}, document.title, window.location.pathname)
      } catch (error) {
        console.error('Error exchanging code for token:', error)
        setAuthError(String(error))
      }
    }

    if (code) {
      exchangeCodeForToken(code)
    }
  }, [clientId, clientSecret, redirectUri, fallbackPlaylistId])

  // Obtener canción actual
  useEffect(() => {
    const fetchCurrentTrack = async () => {
      if (!accessToken) return

      try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })

        if (response.status === 204) {
          setCurrentTrack(null)
          return
        }

        const data = await response.json()
        
        if (data.item) {
          setCurrentTrack({
            id: data.item.id,
            title: data.item.name,
            artist: data.item.artists.map((a: any) => a.name).join(', '),
            albumArt: data.item.album.images[0]?.url || "/placeholder.svg?height=300&width=300",
            duration: Math.floor(data.item.duration_ms / 1000),
            progress: Math.floor(data.progress_ms / 1000),
            isPlaying: data.is_playing,
            previewUrl: data.item.preview_url,
            spotifyUrl: data.item.external_urls.spotify
          })
        }
      } catch (error) {
        console.error('Error fetching current track:', error)
      }
    }

    const intervalId = setInterval(fetchCurrentTrack, 10000)
    fetchCurrentTrack() // Llamada inicial inmediata

    return () => clearInterval(intervalId)
  }, [accessToken])

  // Cargar tracks de playlist de respaldo
  const fetchPlaylistTracks = async (token: string, playlistId: string) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      const tracks = data.items.map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map((a: any) => a.name).join(', '),
        image: item.track.album.images[0]?.url || "/placeholder.svg?height=300&width=300",
        previewUrl: item.track.preview_url,
        spotifyUrl: item.track.external_urls.spotify
      }))

      setFallbackTracks(tracks)
    } catch (error) {
      console.error('Error fetching playlist tracks:', error)
    }
  }

  // Reproducir/pausar preview
  const togglePreview = (track: SpotifyTrack | PlaylistTrack) => {
    if (previewAudio) {
      previewAudio.pause()
      setIsPlayingPreview(false)
      setPreviewAudio(null)
      return
    }

    if (!track.previewUrl) {
      // Abrir en Spotify si no hay preview
      window.open(track.spotifyUrl, '_blank')
      return
    }

    const audio = new Audio(track.previewUrl)
    audio.play()
    setPreviewAudio(audio)
    setIsPlayingPreview(true)

    audio.addEventListener('ended', () => {
      setIsPlayingPreview(false)
      setPreviewAudio(null)
    })
  }

  // Iniciar flujo de autorización
  const initiateSpotifyAuth = () => {
    const scopes = [
      'user-read-currently-playing', 
      'user-read-playback-state',
      'playlist-read-private'
    ].join(' ')

    const authUrl = new URL('https://accounts.spotify.com/authorize')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', scopes)

    window.location.href = authUrl.toString()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Error de autenticación
  if (authError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="text-red-600">Error de autenticación: {authError}</p>
        <button 
          onClick={initiateSpotifyAuth}
          className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          {t.connect}
        </button>
      </div>
    )
  }

  // No autenticado
  if (!isAuthenticated) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <button 
          onClick={initiateSpotifyAuth}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          {t.connect}
        </button>
      </div>
    )
  }

  // Renderizado principal
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      {currentTrack ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{t.title}</h3>
            <Music className="h-5 w-5" />
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full max-w-[200px] aspect-square rounded-md overflow-hidden mb-4">
              <img
                src={currentTrack.albumArt}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="w-full text-center mb-4">
              <h4 className="font-bold truncate">{currentTrack.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {currentTrack.artist}
              </p>
            </div>

            <div className="w-full mb-2">
              <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ 
                    width: `${(currentTrack.progress / currentTrack.duration) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="w-full flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
              <span>{formatTime(currentTrack.progress)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>

            {currentTrack.previewUrl && (
              <button 
                onClick={() => togglePreview(currentTrack)}
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center"
              >
                {isPlayingPreview ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                {isPlayingPreview ? t.pausePreview : t.playPreview}
              </button>
            )}
          </div>
        </>
      ) : (
        // Sección de recomendaciones si no hay canción
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{t.recommendations}</h3>
            <Music className="h-5 w-5" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {fallbackTracks.slice(0, 4).map((track) => (
              <div 
                key={track.id} 
                className="flex flex-col items-center cursor-pointer hover:opacity-80"
                onClick={() => togglePreview(track)}
              >
                <img 
                  src={track.image} 
                  alt={track.name} 
                  className="w-full aspect-square rounded-md mb-2 object-cover"
                />
                <h4 className="text-sm font-bold truncate w-full text-center">{track.name}</h4>
                <p className="text-xs text-gray-500 truncate w-full text-center">{track.artists}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}