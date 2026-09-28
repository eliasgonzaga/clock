export interface ColorPreset {
  id: string;
  name: string;
  color: string;
  glowColor: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { id: 'blue', name: 'Azul Elétrico', color: '#007AFF', glowColor: 'rgba(0, 122, 255, 0.4)' },
  { id: 'green', name: 'Verde Esmeralda', color: '#34C759', glowColor: 'rgba(52, 199, 89, 0.4)' },
  { id: 'orange', name: 'Laranja Sunset', color: '#FF9500', glowColor: 'rgba(255, 149, 0, 0.4)' },
  { id: 'red', name: 'Coral Radiante', color: '#FF3B30', glowColor: 'rgba(255, 59, 48, 0.4)' },
  { id: 'purple', name: 'Roxo Neon', color: '#AF52DE', glowColor: 'rgba(175, 82, 222, 0.4)' },
  { id: 'pink', name: 'Rosa Magenta', color: '#FF2D55', glowColor: 'rgba(255, 45, 85, 0.4)' },
  { id: 'yellow', name: 'Âmbar Dourado', color: '#FFCC00', glowColor: 'rgba(255, 204, 0, 0.4)' },
  { id: 'cyan', name: 'Ciano Glacial', color: '#32ADE6', glowColor: 'rgba(50, 173, 230, 0.4)' },
  { id: 'slate', name: 'Grafite Escuro', color: '#0F172A', glowColor: 'rgba(15, 23, 42, 0.3)' },
];

export type ThemeMode = 'light' | 'dark';

export type TimerMode = 'clock' | 'countdown' | 'countup';

export interface ClockSettings {
  circleColor: string;
  strokeWidth: number;
  showHours: boolean;
  showMilliseconds: boolean;
  smoothSweep: boolean;
  showTickMarks: boolean;
  soundEnabled: boolean;
  enableGlow: boolean;
  showNumbers: boolean;
  showCircle: boolean;
  onlySeconds: boolean;
}
