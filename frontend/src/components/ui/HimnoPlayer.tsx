import React, { useState, useRef } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaMusic } from 'react-icons/fa';

export const HimnoPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Auto-play blocked or audio load error:', err);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <audio
        ref={audioRef}
        src="https://dpmchile.cl/wp-content/uploads/2024/03/Himno-Deportes-Puerto-Montt.mp3"
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />

      <div className={`flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-azul-dpm-light/30 rounded-full px-4 py-2.5 shadow-2xl shadow-azul-dpm/30 transition-all duration-300 ${expanded ? 'scale-100' : 'hover:border-amarillo-dpm/50'}`}>
        {/* Botón Principal de Reproducción */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-azul-dpm-light to-azul-dpm hover:from-azul-dpm hover:to-slate-800 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
          title={isPlaying ? "Pausar Himno" : "Escuchar Himno Oficial"}
          aria-label={isPlaying ? "Pausar Himno" : "Escuchar Himno Oficial"}
        >
          {isPlaying ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        {/* Información y Animación de Ecualizador */}
        <div 
          className="cursor-pointer select-none"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-amarillo-dpm flex items-center gap-1">
              <FaMusic className="w-3 h-3 animate-pulse" /> Himno Oficial
            </span>
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-1 bg-amarillo-dpm h-full animate-bounce" style={{ animationDuration: '0.6s' }}></span>
                <span className="w-1 bg-amarillo-dpm h-2/3 animate-bounce" style={{ animationDuration: '0.4s' }}></span>
                <span className="w-1 bg-amarillo-dpm h-full animate-bounce" style={{ animationDuration: '0.8s' }}></span>
              </div>
            )}
          </div>
          <p className="text-[11px] text-gray-300 font-medium">Club Deportes Puerto Montt</p>
        </div>

        {/* Control de Silencio */}
        <button
          onClick={toggleMute}
          className="text-gray-400 hover:text-white p-1 rounded-full transition-colors ml-1"
          title={isMuted ? "Activar sonido" : "Silenciar"}
        >
          {isMuted ? <FaVolumeMute className="w-4 h-4 text-red-400" /> : <FaVolumeUp className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
