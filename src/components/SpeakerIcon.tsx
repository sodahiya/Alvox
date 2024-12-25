interface SpeakerIconProps {
  volume: number;
  isMuted: boolean;
  className?: string;
}

const SpeakerIcon = ({ volume, isMuted, className = "" }: SpeakerIconProps) => {
  // Calculate which sound waves to show based on volume
  const showSecondWave = volume > 0.3;
  const showThirdWave = volume > 0.7;

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-full h-full"
      >
        {/* Base speaker icon */}
        <path
          className="transform transition-transform duration-300"
          d="M8.5 14.5l-3-2.5H3c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h2.5l3-2.5c.78-.65 2-.15 2 .85v7.3c0 1-.22 1.5-1 .85z"
          fill="currentColor"
        />

        {/* Sound waves with individual animations */}
        {!isMuted && (
          <>
            {/* First wave (always visible when not muted) */}
            <path
              className="transform origin-left transition-opacity duration-300 animate-pulse"
              d="M12 8.5c.75-.75 2-1 2.5.5-.75.75-2 1-2.5-.5z"
              fill="currentColor"
              style={{ 
                opacity: 0.9,
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
              }}
            />

            {/* Second wave */}
            {showSecondWave && (
              <path
                className="transform origin-left transition-opacity duration-300 animate-pulse"
                d="M14 7c1.5-1.5 3-1.5 4 0-1.5 1.5-3 1.5-4 0z"
                fill="currentColor"
                style={{ 
                  opacity: 0.7,
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.15s"
                }}
              />
            )}

            {/* Third wave */}
            {showThirdWave && (
              <path
                className="transform origin-left transition-opacity duration-300 animate-pulse"
                d="M16 5.5c2.25-2.25 4.5-2.25 6 0-2.25 2.25-4.5 2.25-6 0z"
                fill="currentColor"
                style={{ 
                  opacity: 0.5,
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.3s"
                }}
              />
            )}
          </>
        )}

        {/* Mute indicator */}
        {isMuted && (
          <g className="transform transition-opacity duration-300">
            <line
              x1="2"
              y1="2"
              x2="22"
              y2="22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-draw"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export default SpeakerIcon;
