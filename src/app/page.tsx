"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from 'next/dynamic';
import Head from "next/head";

const ProgressPopup = dynamic(
  () => import('../components/ProgressPopup'),
  { ssr: false }
);

const SpeakerIcon = dynamic(
  () => import('../components/SpeakerIcon'),
  { ssr: false }
);

const DownloadIcon = dynamic(
  () => import('../components/DownloadIcon'),
  { ssr: false }
);

const VoiceSelector = dynamic(
  () => import('../components/VoiceSelector'),
  { ssr: false }
);

const WaveformVisualizer = dynamic(
  () => import('../components/WaveformVisualizer'),
  { ssr: false }
);

interface Voice {
  Name: string;
  ShortName: string;
  Gender: string;
  Locale: string;
}

export default function Home() {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("en-US-ChristopherNeural");
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [hasAudio, setHasAudio] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const audioDataRef = useRef<string>("");
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  const sourceRef = useRef<MediaElementAudioSourceNode>();

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch('http://localhost:8000/voices');
        if (!response.ok) {
          throw new Error('Failed to fetch voices');
        }
        const data = await response.json();
        setVoices(data.voices || []); 
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching voices:', err);
        setError('Failed to load voices');
        setIsLoading(false);
      }
    };

    fetchVoices();
  }, []);

  useEffect(() => {
    if (audioRef.current && !audioContextRef.current && hasAudio) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  }, [hasAudio]);

  const startProgressSimulation = () => {
    setGenerationProgress(0);
    let progress = 0;
    progressIntervalRef.current = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) progress = 90;
      setGenerationProgress(progress);
    }, 300);
  };

  const stopProgressSimulation = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      setGenerationProgress(100);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  const handleSpeak = async () => {
    if (!text) return;

    try {
      setIsGenerating(true);
      setError("");
      startProgressSimulation();

      const response = await fetch("http://localhost:8000/synthesize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, voice: selectedVoice }),
      });

      if (!response.ok) {
        throw new Error("Failed to synthesize speech");
      }

      const data = await response.json();
      const audio = `data:audio/wav;base64,${data.audio}`;
      audioDataRef.current = audio;
      
      if (audioRef.current) {
        audioRef.current.src = audio;
        audioRef.current.play();
        setIsPlaying(true);
        setHasAudio(true);
      }
    } catch (err) {
      setError("Failed to generate speech. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
      stopProgressSimulation();
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !hasAudio) {
      handleSpeak();
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    if (!audioDataRef.current) return;

    try {
      setIsDownloading(true);
      
      // Simulate download progress
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Convert base64 to blob
      const response = await fetch(audioDataRef.current);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'synthesized_speech.wav';

      // Trigger download
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Complete progress
      setDownloadProgress(100);
      setTimeout(() => {
        setDownloadProgress(0);
        setIsDownloading(false);
      }, 1000);

      clearInterval(interval);
    } catch (err) {
      console.error('Download failed:', err);
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-500/20 to-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Head>
        <title>Alvox - Advanced AI-Powered Speech Synthesis</title>
        <meta name="description" content="Convert text to natural-sounding speech using advanced AI" />
        <link rel="icon" href="/AlvoxIcon.ico" />
      </Head>

      <main className="relative z-10 min-h-screen p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
            Alvox
          </h1>
          <p className="text-violet-200/80">Advanced AI-Powered Speech Synthesis</p>
        </div>

        <div className="flex gap-6 h-[calc(100vh-12rem)]">
          {/* Voice Selector Panel */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                <VoiceSelector
                  voices={voices}
                  selectedVoice={selectedVoice}
                  onVoiceSelect={setSelectedVoice}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 space-y-6 border border-white/10">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-[75%] resize-none p-4 bg-black/20 border border-violet-500/30 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-violet-100 placeholder-violet-400/50 transition-all duration-200 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-violet-900/20 [&::-webkit-scrollbar-thumb]:bg-violet-500/50 hover:[&::-webkit-scrollbar-thumb]:bg-violet-400/50"
            />

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 py-2 px-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4 justify-center items-center">
              {/* Left Visualizer */}
              {hasAudio && (
                <div className="w-48">
                  <WaveformVisualizer
                    audioRef={audioRef}
                    isPlaying={isPlaying}
                    analyser={analyserRef.current}
                  />
                </div>
              )}

              {/* Play Button */}
              <button
                onClick={handlePlayPause}
                disabled={!text || isGenerating}
                className="group relative w-16 h-16 flex items-center justify-center rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isGenerating ? (
                  // Loading spinner
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : isPlaying ? (
                  // Pause icon with animation
                  <div className="relative w-6 h-6">
                    <div className="absolute left-0 w-2 h-6 bg-white rounded-sm transform transition-transform duration-300 group-hover:scale-110"></div>
                    <div className="absolute right-0 w-2 h-6 bg-white rounded-sm transform transition-transform duration-300 group-hover:scale-110"></div>
                  </div>
                ) : (
                  // Play icon with animation
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[18px] border-l-white border-b-[12px] border-b-transparent ml-1 transform transition-transform duration-300 group-hover:scale-110"></div>
                  </div>
                )}
                
                {/* Ripple effect on hover */}
                <div className="absolute inset-0 rounded-full bg-violet-400/20 transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                
                {/* Pulse animation when playing */}
                {isPlaying && (
                  <div className="absolute inset-0 rounded-full animate-ping bg-violet-400/20"></div>
                )}
              </button>

              {/* Generate Button */}
              <button
                onClick={handleSpeak}
                disabled={!text || isGenerating}
                className="group relative w-16 h-16 flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden"
                title="Generate Speech"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className="w-6 h-6 text-white"
                >
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.0614 9.67972L16.4756 11.0939L17.8787 9.69083L16.4645 8.27662L15.0614 9.67972ZM16.4645 6.1553L20 9.69083L8.6863 21.0045L5.15076 17.469L16.4645 6.1553Z" fill="#1F2328"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.364 5.06066L9.59619 6.82843L8.53553 5.76777L10.3033 4L11.364 5.06066ZM6.76778 6.82842L5 5.06067L6.06066 4L7.82843 5.76776L6.76778 6.82842ZM10.3033 10.364L8.53553 8.5962L9.59619 7.53554L11.364 9.3033L10.3033 10.364ZM7.82843 8.5962L6.06066 10.364L5 9.3033L6.76777 7.53554L7.82843 8.5962Z" fill="#1F2328"/>
                </svg>
                
                {/* Hover effect */}
                <div className="absolute inset-0 rounded-full bg-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              {/* Right Visualizer */}
              {hasAudio && (
                <div className="w-48">
                  <WaveformVisualizer
                    audioRef={audioRef}
                    isPlaying={isPlaying}
                    mirror={true}
                    analyser={analyserRef.current}
                  />
                </div>
              )}
            </div>

            {hasAudio && (
              <div className="space-y-4 pt-4 border-t border-violet-500/20">
                {/* Audio Controls */}
                <div className="flex items-center gap-4">
                  {/* Time Display */}
                  <div className="text-sm text-violet-200 font-mono min-w-[80px]">
                    {formatTime(currentTime)}
                  </div>

                  {/* Seek Bar */}
                  <div className="flex-grow relative group">
                    <div className="absolute -inset-2 bg-violet-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="relative w-full h-2 bg-violet-900/50 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>

                  {/* Duration */}
                  <div className="text-sm text-violet-200 font-mono min-w-[80px] text-right">
                    {formatTime(duration)}
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading || !audioDataRef.current}
                    className="p-2 rounded-lg hover:bg-violet-500/20 transition-colors relative group/download disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Download audio"
                  >
                    <div className="w-5 h-5 text-violet-300">
                      <DownloadIcon 
                        isDownloading={isDownloading}
                        progress={downloadProgress}
                      />
                    </div>
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-lg bg-violet-500/10 opacity-0 group-hover/download:opacity-100 transition-opacity blur"></div>
                  </button>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setVolume(volume === 0 ? 1 : 0)}
                      className="p-2 rounded-lg hover:bg-violet-500/20 transition-colors relative"
                    >
                      <div className="w-5 h-5 text-violet-300">
                        <SpeakerIcon volume={volume} isMuted={volume === 0} />
                      </div>
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-lg bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                    </button>
                    <div className="relative group/slider flex-grow">
                      <div className="absolute -inset-2 bg-violet-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={volume}
                        onChange={(e) => {
                          const newVolume = parseFloat(e.target.value);
                          setVolume(newVolume);
                          if (audioRef.current) {
                            audioRef.current.volume = newVolume;
                          }
                        }}
                        className="w-24 h-2 bg-violet-900/50 rounded-lg appearance-none cursor-pointer accent-violet-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      <ProgressPopup isVisible={isGenerating} progress={generationProgress} />
    </div>
  );
}
