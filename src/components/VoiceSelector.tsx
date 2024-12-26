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
      'af': 'Afrikaans',
      'ar': 'Arabic',
      'az': 'Azeri (Latin)',
      'be': 'Belarusian',
      'bg': 'Bulgarian',
      'bs': 'Bosnian',
      'ca': 'Catalan',
      'cs': 'Czech',
      'cy': 'Welsh',
      'da': 'Danish',
      'de': 'German',
      'dv': 'Divehi',
      'el': 'Greek',
      'en': 'English',
      'eo': 'Esperanto',
      'es': 'Spanish',
      'et': 'Estonian',
      'eu': 'Basque',
      'fa': 'Farsi',
      'fi': 'Finnish',
      'fo': 'Faroese',
      'fr': 'French',
      'gl': 'Galician',
      'gu': 'Gujarati',
      'he': 'Hebrew',
      'hi': 'Hindi',
      'hr': 'Croatian',
      'hu': 'Hungarian',
      'hy': 'Armenian',
      'id': 'Indonesian',
      'is': 'Icelandic',
      'it': 'Italian',
      'ja': 'Japanese',
      'ka': 'Georgian',
      'kk': 'Kazakh',
      'kn': 'Kannada',
      'ko': 'Korean',
      'kok': 'Konkani',
      'ky': 'Kyrgyz',
      'lt': 'Lithuanian',
      'lv': 'Latvian',
      'mi': 'Maori',
      'mk': 'FYRO Macedonian',
      'mn': 'Mongolian',
      'mr': 'Marathi',
      'ms': 'Malay',
      'mt': 'Maltese',
      'nb': 'Norwegian (Bokmål)',
      'nl': 'Dutch',
      'nn': 'Norwegian (Nynorsk)',
      'ns': 'Northern Sotho',
      'pa': 'Punjabi',
      'pl': 'Polish',
      'ps': 'Pashto',
      'pt': 'Portuguese',
      'qu': 'Quechua',
      'ro': 'Romanian',
      'ru': 'Russian',
      'sa': 'Sanskrit',
      'se': 'Sami (Northern)',
      'sk': 'Slovak',
      'sl': 'Slovenian',
      'sq': 'Albanian',
      'sr': 'Serbian',
      'sv': 'Swedish',
      'sw': 'Swahili',
      'syr': 'Syriac',
      'ta': 'Tamil',
      'te': 'Telugu',
      'th': 'Thai',
      'tl': 'Tagalog',
      'tn': 'Tswana',
      'tr': 'Turkish',
      'tt': 'Tatar',
      'ts': 'Tsonga',
      'uk': 'Ukrainian',
      'ur': 'Urdu',
      'uz': 'Uzbek (Latin)',
      'vi': 'Vietnamese',
      'xh': 'Xhosa',
      'zh': 'Chinese',
      'zu': 'Zulu'
    };

    const countryNames: { [key: string]: string } = {
      'ZA': 'South Africa',
      'AE': 'U.A.E.',
      'BH': 'Bahrain',
      'DZ': 'Algeria',
      'EG': 'Egypt',
      'IQ': 'Iraq',
      'JO': 'Jordan',
      'KW': 'Kuwait',
      'LB': 'Lebanon',
      'LY': 'Libya',
      'MA': 'Morocco',
      'OM': 'Oman',
      'QA': 'Qatar',
      'SA': 'Saudi Arabia',
      'SY': 'Syria',
      'TN': 'Tunisia',
      'YE': 'Yemen',
      'AU': 'Australia',
      'BZ': 'Belize',
      'CA': 'Canada',
      'CB': 'Caribbean',
      'GB': 'United Kingdom',
      'IE': 'Ireland',
      'JM': 'Jamaica',
      'NZ': 'New Zealand',
      'PH': 'Philippines',
      'TT': 'Trinidad and Tobago',
      'US': 'United States',
      'ZW': 'Zimbabwe',
      'AR': 'Argentina',
      'BO': 'Bolivia',
      'CL': 'Chile',
      'CO': 'Colombia',
      'CR': 'Costa Rica',
      'DO': 'Dominican Republic',
      'EC': 'Ecuador',
      'ES': 'Spain',
      'GT': 'Guatemala',
      'HN': 'Honduras',
      'MX': 'Mexico',
      'NI': 'Nicaragua',
      'PA': 'Panama',
      'PE': 'Peru',
      'PR': 'Puerto Rico',
      'PY': 'Paraguay',
      'SV': 'El Salvador',
      'UY': 'Uruguay',
      'VE': 'Venezuela',
      'IN': 'India',
      'BA': 'Bosnia and Herzegovina',
      'HR': 'Croatia',
      'IL': 'Israel',
      'CN': 'China (Simplified)',
      'HK': 'Hong Kong',
      'MO': 'Macau',
      'SG': 'Singapore',
      'TW': 'China (Traditional)',
      'BR': 'Brazil',
      'PT': 'Portugal',
      'FR': 'France',
      'BE': 'Belgium',
      'CH': 'Switzerland',
      'LU': 'Luxembourg',
      'MC': 'Monaco',
      'JP': 'Japan',
      'KR': 'Korea',
      'TR': 'Turkey',
      'RU': 'Russia',
      'PK': 'Pakistan',
      'VN': 'Viet Nam'
    };

    const baseLangName = languageNames[lang.toLowerCase()] || lang;
    const countryName = country ? countryNames[country.toUpperCase()] || country : '';

    return countryName ? `${countryName} ${baseLangName}` : baseLangName;
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
                  {voice.Name.replace('Microsoft Server Speech Text to Speech Voice', '').trim()}
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
