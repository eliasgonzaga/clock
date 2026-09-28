export function generateSwiftUICode(options: {
  currentColorHex: string;
  isDarkMode: boolean;
  strokeWidth: number;
  showHours: boolean;
  smoothSweep: boolean;
  showCircle?: boolean;
  showNumbers?: boolean;
  onlySeconds?: boolean;
  soundEnabled?: boolean;
}): string {
  const {
    currentColorHex,
    isDarkMode,
    strokeWidth,
    showHours,
    smoothSweep,
    showCircle = true,
    showNumbers = true,
    onlySeconds = false,
    soundEnabled = false,
  } = options;

  return `//
//  ContentView.swift
//  RelogioCirculo
//
//  Criado para iOS 16+ / iOS 17+ / iOS 18+ com SwiftUI nativo
//  Relógio com anel de segundos dinâmico.
//  - Botão redondo no canto superior direito com 3 pontos (Configurações)
//  - Toque no centro do círculo para configurar Contagem Progressiva ou Regressiva
//  - Sem botões inferiores, mantendo a tela limpa
//

import SwiftUI
import AudioToolbox

enum TimerMode {
    case clock
    case countdown
    case countup
}

struct ContentView: View {
    // MARK: - Estados da Aplicação
    @State private var isDarkMode: Bool = ${isDarkMode}
    @State private var circleColor: Color = Color(hex: "${currentColorHex}")
    @State private var showCircle: Bool = ${showCircle}
    @State private var showNumbers: Bool = ${showNumbers}
    @State private var onlySeconds: Bool = ${onlySeconds}
    @State private var showHours: Bool = ${showHours}
    @State private var soundEnabled: Bool = ${soundEnabled}
    @State private var smoothAnimation: Bool = ${smoothSweep}
    @State private var strokeWidth: CGFloat = ${strokeWidth}
    @State private var isSettingsOpen: Bool = false
    @State private var isTimerModalOpen: Bool = false

    // Dica de Primeira Execução
    @AppStorage("hasSeenCenterConfigHint") private var hasSeenCenterConfigHint: Bool = false
    @State private var showFirstTimeHint: Bool = false

    // MARK: - Modo de Temporizador
    @State private var timerMode: TimerMode = .clock

    // Contagem Regressiva
    @State private var isCountdownRunning: Bool = false
    @State private var countdownRemainingSeconds: Int = 300
    @State private var countdownTotalSeconds: Int = 300

    // Contagem Progressiva
    @State private var isCountupRunning: Bool = false
    @State private var countupSeconds: Int = 0
    @State private var countupTargetSeconds: Int = 0

    @State private var lastSecond: Int = -1

    // Timer secundário para contagem progressiva e regressiva
    let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    // MARK: - Cores Dinâmicas
    private var backgroundColor: Color {
        isDarkMode ? Color.black : Color.white
    }
    
    private var textColor: Color {
        isDarkMode ? Color.white : Color.black
    }
    
    private var ringTrackColor: Color {
        isDarkMode ? Color.white.opacity(0.12) : Color.black.opacity(0.08)
    }

    var body: some View {
        TimelineView(.animation(minimumInterval: smoothAnimation && timerMode == .clock ? 1.0 / 60.0 : 1.0)) { timeline in
            let date = timeline.date
            let calendar = Calendar.current
            let second = calendar.component(.second, from: date)
            let nanosecond = calendar.component(.nanosecond, from: date)
            
            // Progresso do anel circular (0.0 até 1.0)
            let progress: Double = {
                switch timerMode {
                case .countdown:
                    return countdownTotalSeconds > 0 ? Double(countdownRemainingSeconds) / Double(countdownTotalSeconds) : 0.0
                case .countup:
                    if countupTargetSeconds > 0 {
                        return min(1.0, Double(countupSeconds) / Double(countupTargetSeconds))
                    } else {
                        return Double(countupSeconds % 60) / 60.0
                    }
                case .clock:
                    return smoothAnimation
                        ? (Double(second) + Double(nanosecond) / 1_000_000_000.0) / 60.0
                        : Double(second) / 60.0
                }
            }()

            ZStack {
                // Fundo adaptativo
                backgroundColor
                    .ignoresSafeArea()
                    .animation(.easeInOut(duration: 0.3), value: isDarkMode)

                VStack {
                    // Barra Superior: Botão Redondo com 3 Pontos no Canto Superior Direito
                    HStack {
                        if timerMode != .clock {
                            HStack(spacing: 6) {
                                Image(systemName: timerMode == .countdown ? "hourglass" : "chart.line.uptrend.xyaxis")
                                Text(timerMode == .countdown ? "Contagem Regressiva" : "Contagem Progressiva")
                            }
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(circleColor)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(
                                Capsule().fill(isDarkMode ? Color.white.opacity(0.08) : Color.black.opacity(0.05))
                            )
                        }

                        Spacer()
                        
                        Button(action: {
                            isSettingsOpen = true
                        }) {
                            Image(systemName: "ellipsis")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(textColor)
                                .frame(width: 44, height: 44)
                                .background(
                                    Circle()
                                        .fill(isDarkMode ? Color.white.opacity(0.12) : Color.black.opacity(0.06))
                                )
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 16)

                    Spacer()

                    // Relógio Central e Anel de Segundos
                    ZStack {
                        // Anel Circular
                        if showCircle {
                            Circle()
                                .stroke(
                                    ringTrackColor,
                                    style: StrokeStyle(lineWidth: strokeWidth, lineCap: .round)
                                )
                                .frame(width: 290, height: 290)

                            Circle()
                                .trim(from: 0.0, to: CGFloat(progress))
                                .stroke(
                                    circleColor,
                                    style: StrokeStyle(lineWidth: strokeWidth, lineCap: .round)
                                )
                                .rotationEffect(.degrees(-90))
                                .frame(width: 290, height: 290)
                                .shadow(color: circleColor.opacity(isDarkMode ? 0.4 : 0.2), radius: 8, x: 0, y: 0)
                        }

                        // Mostrador Digital no Centro (CLICÁVEL PARA CONFIGURAR PROGRESSIVA OU REGRESSIVA)
                        if showNumbers {
                            VStack(spacing: 6) {
                                switch timerMode {
                                case .countdown:
                                    Text(formattedSeconds(seconds: countdownRemainingSeconds))
                                        .font(.system(size: 64, weight: .light, design: .rounded))
                                        .monospacedDigit()
                                        .foregroundColor(textColor)
                                case .countup:
                                    Text(formattedSeconds(seconds: countupSeconds))
                                        .font(.system(size: 64, weight: .light, design: .rounded))
                                        .monospacedDigit()
                                        .foregroundColor(textColor)
                                case .clock:
                                    if onlySeconds {
                                        Text(String(format: "%02d", second))
                                            .font(.system(size: 78, weight: .light, design: .rounded))
                                            .monospacedDigit()
                                            .foregroundColor(textColor)
                                    } else if showHours {
                                        Text(formattedTime(date: date, includeHours: true))
                                            .font(.system(size: 46, weight: .light, design: .rounded))
                                            .monospacedDigit()
                                            .foregroundColor(textColor)
                                    } else {
                                        Text(formattedTime(date: date, includeHours: false))
                                            .font(.system(size: 64, weight: .light, design: .rounded))
                                            .monospacedDigit()
                                            .foregroundColor(textColor)
                                    }
                                }
                            }
                            .contentShape(Rectangle())
                            .onTapGesture {
                                // Toque no centro abre a configuração de tempo
                                isTimerModalOpen = true
                            }
                        }
                    }
                    .frame(width: 290, height: 290)

                    // Dica de Primeira Abertura (desaparece após 10s e não volta)
                    if showFirstTimeHint && timerMode == .clock {
                        HStack(spacing: 6) {
                            Image(systemName: "timer")
                            Text("Toque no centro para configurar")
                        }
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(textColor.opacity(0.7))
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(
                            Capsule().fill(isDarkMode ? Color.white.opacity(0.08) : Color.black.opacity(0.04))
                        )
                        .padding(.top, 24)
                        .transition(.opacity)
                    }

                    Spacer()
                }
            }
            .onReceive(timer) { _ in
                if timerMode == .countdown && isCountdownRunning {
                    if countdownRemainingSeconds > 0 {
                        countdownRemainingSeconds -= 1
                        if soundEnabled {
                            AudioServicesPlaySystemSound(1104)
                        }
                    } else {
                        isCountdownRunning = false
                        AudioServicesPlaySystemSound(1005)
                    }
                } else if timerMode == .countup && isCountupRunning {
                    countupSeconds += 1
                    if soundEnabled {
                        AudioServicesPlaySystemSound(1104)
                    }
                    if countupTargetSeconds > 0 && countupSeconds >= countupTargetSeconds {
                        isCountupRunning = false
                        AudioServicesPlaySystemSound(1005)
                    }
                } else if timerMode == .clock && soundEnabled {
                    let sec = Calendar.current.component(.second, from: Date())
                    if sec != lastSecond {
                        lastSecond = sec
                        AudioServicesPlaySystemSound(1104)
                    }
                }
            }
            .onAppear {
                if !hasSeenCenterConfigHint {
                    showFirstTimeHint = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 10) {
                        withAnimation(.easeInOut(duration: 1.0)) {
                            showFirstTimeHint = false
                            hasSeenCenterConfigHint = true
                        }
                    }
                }
            }
        }
        // Modal de Configurações Gerais
        .sheet(isPresented: $isSettingsOpen) {
            SettingsSheetView(
                isDarkMode: $isDarkMode,
                circleColor: $circleColor,
                showCircle: $showCircle,
                showNumbers: $showNumbers,
                onlySeconds: $onlySeconds,
                showHours: $showHours,
                soundEnabled: $soundEnabled
            )
        }
        // Modal de Configuração de Tempo (Progressiva ou Regressiva) ao Clicar no Centro
        .sheet(isPresented: $isTimerModalOpen) {
            TimerSheetView(
                circleColor: circleColor,
                timerMode: $timerMode,
                isCountdownRunning: $isCountdownRunning,
                countdownRemaining: $countdownRemainingSeconds,
                countdownTotal: $countdownTotalSeconds,
                isCountupRunning: $isCountupRunning,
                countupSeconds: $countupSeconds,
                countupTarget: $countupTargetSeconds
            )
        }
    }

    private func formattedTime(date: Date, includeHours: Bool) -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "pt_BR")
        formatter.dateFormat = includeHours ? "HH:mm:ss" : "mm:ss"
        return formatter.string(from: date)
    }

    private func formattedSeconds(seconds: Int) -> String {
        let h = seconds / 3600
        let m = (seconds % 3600) / 60
        let s = seconds % 60
        if h > 0 {
            return String(format: "%02d:%02d:%02d", h, m, s)
        }
        return String(format: "%02d:%02d", m, s)
    }
}

// MARK: - Sheet de Configuração de Tempo (Progressiva e Regressiva)
struct TimerSheetView: View {
    @Environment(\\.dismiss) private var dismiss
    let circleColor: Color
    @Binding var timerMode: TimerMode
    @Binding var isCountdownRunning: Bool
    @Binding var countdownRemaining: Int
    @Binding var countdownTotal: Int
    @Binding var isCountupRunning: Bool
    @Binding var countupSeconds: Int
    @Binding var countupTarget: Int

    @State private var selectedTab: Int = 0 // 0: Progressiva, 1: Regressiva
    @State private var cdMinutes: Int = 5
    @State private var cdSeconds: Int = 0

    var body: some View {
        NavigationStack {
            Form {
                Picker("Tipo de Contagem", selection: $selectedTab) {
                    Text("Contagem Progressiva").tag(0)
                    Text("Contagem Regressiva").tag(1)
                }
                .pickerStyle(.segmented)

                if selectedTab == 0 {
                    // Contagem Progressiva
                    Section("Opções da Contagem Progressiva") {
                        Button("Iniciar do Zero (Livre)") {
                            countupSeconds = 0
                            countupTarget = 0
                            timerMode = .countup
                            isCountupRunning = true
                            dismiss()
                        }
                        Button("Meta: 5 minutos") {
                            countupSeconds = 0
                            countupTarget = 300
                            timerMode = .countup
                            isCountupRunning = true
                            dismiss()
                        }
                        Button("Meta: 15 minutos") {
                            countupSeconds = 0
                            countupTarget = 900
                            timerMode = .countup
                            isCountupRunning = true
                            dismiss()
                        }
                        Button("Meta: 30 minutos") {
                            countupSeconds = 0
                            countupTarget = 1800
                            timerMode = .countup
                            isCountupRunning = true
                            dismiss()
                        }
                    }
                } else {
                    // Contagem Regressiva
                    Section("Duração") {
                        Stepper("Minutos: \\(cdMinutes)", value: $cdMinutes, in: 0...60)
                        Stepper("Segundos: \\(cdSeconds)", value: $cdSeconds, in: 0...59)
                    }

                    Section("Presets Rápidos") {
                        Button("1 minuto") { cdMinutes = 1; cdSeconds = 0 }
                        Button("3 minutos") { cdMinutes = 3; cdSeconds = 0 }
                        Button("5 minutos") { cdMinutes = 5; cdSeconds = 0 }
                        Button("10 minutos") { cdMinutes = 10; cdSeconds = 0 }
                        Button("25 minutos (Pomodoro)") { cdMinutes = 25; cdSeconds = 0 }
                    }

                    Section {
                        Button(action: {
                            let total = cdMinutes * 60 + cdSeconds
                            if total > 0 {
                                countdownTotal = total
                                countdownRemaining = total
                                timerMode = .countdown
                                isCountdownRunning = true
                                dismiss()
                            }
                        }) {
                            HStack {
                                Spacer()
                                Text("Iniciar Contagem Regressiva")
                                    .bold()
                                    .foregroundColor(.white)
                                Spacer()
                            }
                        }
                        .listRowBackground(circleColor)
                    }
                }

                if timerMode != .clock {
                    Section {
                        Button("Voltar ao Relógio em Tempo Real", role: .destructive) {
                            timerMode = .clock
                            isCountdownRunning = false
                            isCountupRunning = false
                            dismiss()
                        }
                    }
                }
            }
            .navigationTitle("Configurar Tempo")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Fechar") { dismiss() }
                }
            }
        }
    }
}

// MARK: - Página de Configurações Gerais
struct SettingsSheetView: View {
    @Environment(\\.dismiss) private var dismiss
    @Binding var isDarkMode: Bool
    @Binding var circleColor: Color
    @Binding var showCircle: Bool
    @Binding var showNumbers: Bool
    @Binding var onlySeconds: Bool
    @Binding var showHours: Bool
    @Binding var soundEnabled: Bool

    private let presetColors: [Color] = [
        Color(hex: "#007AFF"),
        Color(hex: "#34C759"),
        Color(hex: "#FF9500"),
        Color(hex: "#FF3B30"),
        Color(hex: "#AF52DE"),
        Color(hex: "#32ADE6"),
        Color(hex: "#FFCC00")
    ]

    var body: some View {
        NavigationStack {
            Form {
                Section("Tema") {
                    Toggle("Modo Escuro (Fundo Preto)", isOn: $isDarkMode)
                }

                Section("Cor do Círculo") {
                    ColorPicker("Cor Personalizada", selection: $circleColor, supportsOpacity: false)
                }

                Section("Alternar Visibilidade") {
                    Toggle("Exibir Círculo de Segundos", isOn: $showCircle)
                    Toggle("Exibir Números Centrais", isOn: $showNumbers)
                }

                Section("Alternar Formato") {
                    Button("Apenas Segundos (SS)") { onlySeconds = true; showHours = false }
                    Button("Minutos e Segundos (MM:SS)") { onlySeconds = false; showHours = false }
                    Button("Horas, Minutos e Segundos (HH:MM:SS)") { onlySeconds = false; showHours = true }
                }

                Section("Som") {
                    Toggle("Ativar Tic-Tac Acústico", isOn: $soundEnabled)
                }
            }
            .navigationTitle("Configurações")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Concluir") { dismiss() }
                }
            }
        }
    }
}

// Extensão Utilitária para Hex Color
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

#Preview {
    ContentView()
}
`;
}
