interface ProgressPopupProps {
  isVisible: boolean;
  progress: number;
}

const ProgressPopup = ({ isVisible, progress }: ProgressPopupProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 w-80 bg-black/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 transform transition-all duration-300 ease-out">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-violet-200 font-medium">Generating Audio</span>
          <span className="text-violet-300 text-sm">{Math.round(progress)}%</span>
        </div>
        
        <div className="relative h-2 bg-violet-900/50 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
          {/* Animated shine effect */}
          <div 
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shine"
            style={{ left: `${progress - 20}%` }}
          />
        </div>

        <p className="text-violet-200/80 text-sm">
          Please wait while we process your text...
        </p>
      </div>
    </div>
  );
};

export default ProgressPopup;
