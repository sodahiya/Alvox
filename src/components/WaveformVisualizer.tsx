import { useRef, useEffect } from 'react';

interface WaveformVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  mirror?: boolean;
  analyser?: AnalyserNode | null;
}

const WaveformVisualizer = ({ audioRef, isPlaying, mirror = false, analyser }: WaveformVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!audioRef.current || !analyser) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!ctx || !analyser) return;

      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      if (isPlaying) {
        analyser.getByteFrequencyData(dataArray);
        
        const barWidth = 2;
        const gap = 1;
        const totalBars = Math.floor(width / (barWidth + gap));
        const step = Math.ceil(bufferLength / totalBars);
        
        ctx.fillStyle = 'rgba(139, 92, 246, 0.5)'; // violet-500 with 50% opacity
        
        for (let i = 0; i < totalBars; i++) {
          const dataIndex = Math.floor(i * step);
          let value = dataArray[dataIndex] || 0;
          
          // Apply some smoothing
          value = Math.min(value * 1.2, 255);
          
          const barHeight = (value / 255) * height * 0.8;
          const x = i * (barWidth + gap);
          const y = (height - barHeight) / 2;
          
          if (mirror) {
            // For mirrored version, draw bars from right to left
            ctx.fillRect(width - x - barWidth, y, barWidth, barHeight);
          } else {
            ctx.fillRect(x, y, barWidth, barHeight);
          }
        }
      } else {
        // Draw idle state visualization
        const centerY = height / 2;
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
      }
      
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, mirror, analyser]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-48 h-16"
      width={192}
      height={64}
    />
  );
};

export default WaveformVisualizer;
