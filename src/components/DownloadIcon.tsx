interface DownloadIconProps {
  className?: string;
  isDownloading?: boolean;
  progress?: number;
}

const DownloadIcon = ({ className = "", isDownloading = false, progress = 0 }: DownloadIconProps) => {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`w-full h-full transition-transform duration-300 ${
          isDownloading ? "scale-90" : "hover:scale-110"
        }`}
      >
        {/* Progress circle */}
        {isDownloading && (
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="opacity-30 transition-all duration-300"
            transform="rotate(-90 12 12)"
          />
        )}

        {/* Download icon */}
        <g
          className={`transform transition-transform duration-300 ${
            isDownloading ? "scale-75" : "scale-100"
          }`}
          style={{ transformOrigin: "center" }}
        >
          {!isDownloading ? (
            <>
              {/* Arrow and line */}
              <path
                d="M12 7v7m0 0l-3-3m3 3l3-3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform transition-transform duration-300"
              />
              <path
                d="M7 17h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="transform transition-transform duration-300"
              />
            </>
          ) : (
            // Checkmark for completion
            progress === 100 && (
              <path
                d="M8 12l3 3 5-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw-check"
              />
            )
          )}
        </g>
      </svg>
    </div>
  );
};

export default DownloadIcon;
