import React, { useEffect, useState, useRef } from 'react';
import { ClockSettings, ThemeMode, TimerMode } from '../types/clock';
import { playTickSound } from '../utils/audio';
import { Play, Pause, TrendingUp } from 'lucide-react';

interface ClockFaceProps {
  theme: ThemeMode;
  settings: ClockSettings;
  timerMode?: TimerMode;
  // Contagem Regressiva
  countdownRemainingSeconds?: number;
  countdownTotalSeconds?: number;
  isCountdownRunning?: boolean;
  isCountdownFinished?: boolean;
  // Contagem Progressiva
  countupSeconds?: number;
  countupTargetSeconds?: number;
  isCountupRunning?: boolean;
  onCenterClick?: () => void;
}

export const ClockFace: React.FC<ClockFaceProps> = ({
  theme,
  settings,
  timerMode = 'clock',
  countdownRemainingSeconds = 0,
  countdownTotalSeconds = 0,
  isCountdownRunning = false,
  isCountdownFinished = false,
  countupSeconds = 0,
  countupTargetSeconds = 0,
  isCountupRunning = false,
  onCenterClick,
}) => {
  const [time, setTime] = useState(() => new Date());
  const [fractionalSecond, setFractionalSecond] = useState(0);
  const lastSecondRef = useRef(new Date().getSeconds());

  const isTimerActive = timerMode !== 'clock';
  const isCountdown = timerMode === 'countdown';
  const isCountup = timerMode === 'countup';

  useEffect(() => {
    if (isTimerActive) return;

    let animId: number;

    const updateClock = () => {
      const now = new Date();
      setTime(now);

      const sec = now.getSeconds();
      const ms = now.getMilliseconds();
      const progress = (sec + ms / 1000) / 60;
      setFractionalSecond(progress);

      if (sec !== lastSecondRef.current) {
        lastSecondRef.current = sec;
        if (settings.soundEnabled) {
          playTickSound(sec === 0);
        }
      }

      animId = requestAnimationFrame(updateClock);
    };

    animId = requestAnimationFrame(updateClock);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [settings.soundEnabled, isTimerActive]);

  // Tempo do relógio comum
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  // Tempo da contagem regressiva
  const cdHours = Math.floor(countdownRemainingSeconds / 3600);
  const cdMinutes = Math.floor((countdownRemainingSeconds % 3600) / 60);
  const cdSeconds = countdownRemainingSeconds % 60;

  // Tempo da contagem progressiva
  const cuHours = Math.floor(countupSeconds / 3600);
  const cuMinutes = Math.floor((countupSeconds % 3600) / 60);
  const cuSeconds = countupSeconds % 60;

  // Formatações dependendo do modo
  let displayHours = hours;
  let displayMinutes = minutes;
  let displaySeconds = seconds;

  if (isCountdown) {
    displayHours = cdHours;
    displayMinutes = cdMinutes;
    displaySeconds = cdSeconds;
  } else if (isCountup) {
    displayHours = cuHours;
    displayMinutes = cuMinutes;
    displaySeconds = cuSeconds;
  }

  const formattedHours = String(displayHours).padStart(2, '0');
  const formattedMinutes = String(displayMinutes).padStart(2, '0');
  const formattedSeconds = String(displaySeconds).padStart(2, '0');
  const formattedMs = String(Math.floor(milliseconds / 10)).padStart(2, '0');

  // Cálculo da proporção do círculo
  let progressRatio: number;
  if (isCountdown) {
    progressRatio =
      countdownTotalSeconds > 0
        ? countdownRemainingSeconds / countdownTotalSeconds
        : 0;
  } else if (isCountup) {
    if (countupTargetSeconds > 0) {
      progressRatio = Math.min(1, countupSeconds / countupTargetSeconds);
    } else {
      progressRatio = (countupSeconds % 60) / 60;
    }
  } else {
    progressRatio = settings.smoothSweep ? fractionalSecond : seconds / 60;
  }

  // SVG Geometry
  const size = 360;
  const strokeWidth = settings.strokeWidth;
  const radius = (size - strokeWidth - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const isDark = theme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const trackColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.07)';

  // Decisão de exibir horas: ou ativo nas configurações ou se a contagem tem mais de 1 hora
  const shouldShowHours = isCountdown
    ? cdHours > 0 || settings.showHours
    : isCountup
    ? cuHours > 0 || settings.showHours
    : settings.showHours;

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Outer Glow Halo if enabled and circle is visible */}
      {settings.showCircle && settings.enableGlow && (
        <div
          className={`absolute inset-0 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            isCountdownFinished ? 'opacity-60 scale-105 animate-pulse' : 'opacity-25'
          }`}
          style={{
            backgroundColor: settings.circleColor,
            transform: 'scale(0.85)',
          }}
        />
      )}

      {/* SVG Canvas for Track, Progress Ring and Ticks */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 origin-center overflow-visible"
        >
          <defs>
            {settings.enableGlow && (
              <filter id="ring-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )}
          </defs>

          {/* Optional 60-Second Tick Marks */}
          {settings.showTickMarks &&
            Array.from({ length: 60 }).map((_, i) => {
              const angle = (i * 360) / 60;
              const isMajor = i % 5 === 0;
              const tickLength = isMajor ? 8 : 4;
              const tickRadius = radius - strokeWidth / 2 - 8;
              const rad = (angle * Math.PI) / 180;
              const x1 = size / 2 + (tickRadius - tickLength) * Math.cos(rad);
              const y1 = size / 2 + (tickRadius - tickLength) * Math.sin(rad);
              const x2 = size / 2 + tickRadius * Math.cos(rad);
              const y2 = size / 2 + tickRadius * Math.sin(rad);

              const isActive = i / 60 <= progressRatio;

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={
                    isActive
                      ? settings.circleColor
                      : isDark
                      ? 'rgba(255,255,255,0.15)'
                      : 'rgba(0,0,0,0.12)'
                  }
                  strokeWidth={isMajor ? 2 : 1}
                  strokeLinecap="round"
                  className="transition-colors duration-150"
                />
              );
            })}

          {/* Background Ring Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            className="transition-colors duration-300"
          />

          {/* Active Seconds Progress Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={settings.circleColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            filter={settings.enableGlow ? 'url(#ring-glow)' : undefined}
            style={{
              transition: isTimerActive
                ? 'stroke-dashoffset 0.25s linear'
                : settings.smoothSweep
                ? 'none'
                : 'stroke-dashoffset 0.15s ease-out',
            }}
          />

          {/* Leading Indicator Dot at tip */}
          {progressRatio > 0.005 && progressRatio < 0.995 && (
            <circle
              cx={size / 2 + radius * Math.cos((progressRatio * 360 * Math.PI) / 180)}
              cy={size / 2 + radius * Math.sin((progressRatio * 360 * Math.PI) / 180)}
              r={strokeWidth / 2 + 1}
              fill={settings.circleColor}
              className="drop-shadow-sm"
            />
          )}
        </svg>

        {/* Central Clickable Display: Clique no centro para configurar */}
        <button
          type="button"
          onClick={onCenterClick}
          aria-label="Toque no centro para configurar"
          className={`group absolute inset-6 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-200 outline-hidden ${
            isDark ? 'hover:bg-white/5 active:scale-95' : 'hover:bg-black/5 active:scale-95'
          }`}
        >
          {/* Time digits: Minutos e Segundos no Centro */}
          <div
            className={`flex flex-col items-center justify-center transition-opacity duration-300 ${
              settings.showNumbers ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex items-baseline justify-center tabular-clock">
              {settings.onlySeconds && !isTimerActive ? (
                /* Somente Segundos */
                <span className="text-7xl md:text-8xl font-light" style={{ color: textColor }}>
                  {formattedSeconds}
                </span>
              ) : shouldShowHours ? (
                /* Horas, Minutos e Segundos */
                <div className="flex items-baseline">
                  <span className="text-4xl md:text-5xl font-light" style={{ color: textColor }}>
                    {formattedHours}
                  </span>
                  <span
                    className="text-4xl md:text-5xl font-light mx-1 transition-opacity duration-300"
                    style={{ color: textColor }}
                  >
                    :
                  </span>
                  <span className="text-4xl md:text-5xl font-light" style={{ color: textColor }}>
                    {formattedMinutes}
                  </span>
                  <span
                    className="text-4xl md:text-5xl font-light mx-1 transition-opacity duration-300"
                    style={{ color: textColor }}
                  >
                    :
                  </span>
                  <span className="text-4xl md:text-5xl font-light" style={{ color: textColor }}>
                    {formattedSeconds}
                  </span>
                </div>
              ) : (
                /* Minutos e Segundos com ":" */
                <div className="flex items-baseline">
                  <span className="text-6xl md:text-7xl font-light" style={{ color: textColor }}>
                    {formattedMinutes}
                  </span>
                  <span
                    className="text-6xl md:text-7xl font-light mx-1 select-none transition-opacity duration-300"
                    style={{ color: textColor }}
                  >
                    :
                  </span>
                  <span className="text-6xl md:text-7xl font-light" style={{ color: textColor }}>
                    {formattedSeconds}
                  </span>
                </div>
              )}

              {/* Optional Milliseconds Sub-display (somente no relógio normal) */}
              {!isTimerActive && settings.showMilliseconds && (
                <span
                  className="text-lg md:text-xl font-normal ml-2 opacity-60 tabular-clock"
                  style={{ color: settings.circleColor }}
                >
                  .{formattedMs}
                </span>
              )}
            </div>

            {/* Dica interativa sutil ou status da contagem */}
            {isCountdown && (
              <div
                className="mt-2 flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border transition-all"
                style={{
                  color: settings.circleColor,
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                {isCountdownFinished ? (
                  <span className="font-semibold animate-pulse">Tempo Concluído!</span>
                ) : isCountdownRunning ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Contagem Regressiva</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Pausado</span>
                  </>
                )}
              </div>
            )}

            {isCountup && (
              <div
                className="mt-2 flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border transition-all"
                style={{
                  color: settings.circleColor,
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                }}
              >
                {isCountupRunning ? (
                  <>
                    <TrendingUp className="w-3 h-3" />
                    <span>Contagem Progressiva</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Pausado</span>
                  </>
                )}
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
