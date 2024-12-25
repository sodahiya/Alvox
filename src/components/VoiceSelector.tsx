import { useRef, useEffect, useState } from 'react';

interface Voice {
  Name: string;
  ShortName: string;
  Gender: string;
  Locale: string;
}

interface VoiceSelectorProps {
  voices: Voice[];
  selectedVoice: string;
  onVoiceSelect: (voice: string) => void;
  isLoading: boolean;
}

const VoiceSelector = ({ voices, selectedVoice, onVoiceSelect, isLoading }: VoiceSelectorProps) => {
  const formatVoiceName = (name: string, locale: string) => {
    const [lang, country] = locale.split('-');
    
    const languageNames: { [key: string]: string } = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'pl': 'Polish',
      'nl': 'Dutch',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'ru': 'Russian',
      'hi': 'Hindi',
      'tr': 'Turkish',
      'bn': 'Bengali',
      'pa': 'Punjabi',
      'ur': 'Urdu',
      'sw': 'Swahili',
      'vi': 'Vietnamese',
      'th': 'Thai',
      'el': 'Greek',
      'he': 'Hebrew',
      'hu': 'Hungarian',
      'sv': 'Swedish',
      'fi': 'Finnish',
      'da': 'Danish',
      'no': 'Norwegian',
      'cs': 'Czech',
      'ro': 'Romanian',
      'sk': 'Slovak',
      'sr': 'Serbian',
      'bg': 'Bulgarian',
      'uk': 'Ukrainian',
      'id': 'Indonesian',
      'ms': 'Malay',
      'ml': 'Malayalam',
      'ta': 'Tamil',
      'te': 'Telugu',
      'kn': 'Kannada',
      'mr': 'Marathi',
      'gu': 'Gujarati',
      'ne': 'Nepali',
      'si': 'Sinhalese',
      'cy': 'Welsh',
      'is': 'Icelandic',
      'lv': 'Latvian',
      'lt': 'Lithuanian',
      'et': 'Estonian',
      'ka': 'Georgian',
      'hy': 'Armenian',
      'az': 'Azerbaijani',
      'mk': 'Macedonian',
      'sq': 'Albanian',
      'bs': 'Bosnian',
      'hr': 'Croatian',
      'sl': 'Slovenian',
      'mrj': 'Mari',
      'km': 'Khmer',
      'lo': 'Lao',
      'my': 'Burmese',
      'mn': 'Mongolian',
      'swc': 'Congo Swahili',
      'xh': 'Xhosa',
      'zu': 'Zulu'
    };

    const language = languageNames[lang.toLowerCase()] || lang;
    return `${country} ${language}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-16 bg-black/20 backdrop-blur-xl rounded-xl border border-violet-500/20 p-4">
        <div className="flex items-center gap-3 text-violet-200">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading voice models...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-16rem)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-violet-900/20 [&::-webkit-scrollbar-thumb]:bg-violet-500/50 hover:[&::-webkit-scrollbar-thumb]:bg-violet-400/50">
      <div className="px-4 pb-4 space-y-2">
        {voices.map((voice) => {
          const isSelected = voice.ShortName === selectedVoice;
          return (
            <button
              key={voice.ShortName}
              onClick={() => onVoiceSelect(voice.ShortName)}
              className={`group relative w-full text-left ${
                isSelected 
                  ? 'bg-violet-600/30 border-violet-400/50' 
                  : 'bg-black/20 border-violet-500/20 hover:bg-violet-600/20'
              } backdrop-blur-xl rounded-xl border p-3 transition-all duration-200`}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute inset-0 bg-violet-400/10 rounded-xl animate-pulse" />
              )}

              {/* Content wrapper */}
              <div className="relative">
                {/* Main title and gender badge */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="font-medium text-violet-200 truncate">
                    {formatVoiceName(voice.Name, voice.Locale)}
                  </div>
                  <div className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${
                    voice.Gender === 'Female' 
                      ? 'bg-pink-500/20 text-pink-300' 
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {voice.Gender}
                  </div>
                </div>

                {/* Subtitle */}
                <div className="text-sm text-violet-300/70 truncate">
                  {voice.Name.split('Neural')[0].trim()}
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-xl bg-violet-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VoiceSelector;
