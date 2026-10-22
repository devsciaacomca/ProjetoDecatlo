// Definição dos Pinos
const int PIN_BOTAO_P1 = 2; // Jogador 1 (Usaremos INPUT_PULLUP)
const int PIN_BOTAO_P2 = 3; // Jogador 2 (Usaremos INPUT_PULLUP)
const int PIN_BOTAO_RESET = 4; // Botão de Reset Físico (Usaremos INPUT_PULLUP)

const int PIN_LED_STATUS = 8; // LED de Status (acende quando a máquina travou)
const int PIN_BUZZER_P1 = 9;  // Buzzer para Jogador 1 (opcional)
const int PIN_BUZZER_P2 = 10; // Buzzer para Jogador 2 (opcional)

// Variáveis de Estado
bool maquinaTravada = false;
unsigned long tempoUltimoClique = 0;
const unsigned long DEBOUNCE_DELAY = 50; // milissegundos para evitar bouncing (cliques fantasmas)

// Sirene (não bloqueante: o reset continua funcionando enquanto toca)
const unsigned long SIRENE_DURACAO = 1500; // duração total da sirene (ms)
const unsigned long SIRENE_CICLO = 380;    // tempo de uma subida + descida (ms)
bool sireneAtiva = false;
int sirenePino = 0;
int sireneFreqBase = 0;
int sireneFreqPico = 0;
unsigned long sireneInicio = 0;

void setup() {
  Serial.begin(9600); // Inicia comunicação com o PC via USB

  // Configura os botões com resistores pull-up internos
  // (Quando pressionado = estado será LOW; Quando solto = estado será HIGH)
  pinMode(PIN_BOTAO_P1, INPUT_PULLUP);
  pinMode(PIN_BOTAO_P2, INPUT_PULLUP);
  pinMode(PIN_BOTAO_RESET, INPUT_PULLUP);

  // Configura saídas
  pinMode(PIN_LED_STATUS, OUTPUT);
  pinMode(PIN_BUZZER_P1, OUTPUT);
  pinMode(PIN_BUZZER_P2, OUTPUT);

  // Estado inicial: tudo desligado
  digitalWrite(PIN_LED_STATUS, LOW);
  noTone(PIN_BUZZER_P1);
  noTone(PIN_BUZZER_P2);
  
  Serial.println("SISTEMA_PRONTO");
}

void loop() {
  // 0. Atualiza a sirene (varredura de frequência sobe/desce)
  atualizarSirene();

  // 1. Lê a porta Serial para comando de Reset virtual (vindo do Node.js/Site)
  if (Serial.available() > 0) {
    char comando = Serial.read();
    if (comando == 'R' || comando == 'r') {
      resetarMaquina();
    }
  }

  // 2. Lê o botão de Reset físico
  if (digitalRead(PIN_BOTAO_RESET) == LOW) {
    resetarMaquina();
    delay(200); // Debounce simples para evitar reset duplo
  }

  // 3. Lê os botões dos jogadores (apenas se a máquina não estiver travada)
  if (!maquinaTravada) {
    bool p1Pressionado = (digitalRead(PIN_BOTAO_P1) == LOW);
    bool p2Pressionado = (digitalRead(PIN_BOTAO_P2) == LOW);

    unsigned long tempoAtual = millis();

    // Verifica se já passou o tempo de debounce
    if ((tempoAtual - tempoUltimoClique) > DEBOUNCE_DELAY) {
      if (p1Pressionado) {
        travarMaquina("P1", PIN_BUZZER_P1, 850, 1400); // Sirene aguda
        tempoUltimoClique = tempoAtual;
      } 
      else if (p2Pressionado) {
        travarMaquina("P2", PIN_BUZZER_P2, 650, 1100); // Sirene mais grave
        tempoUltimoClique = tempoAtual;
      }
    }
  }
}

// Função que trava o sistema e avisa quem foi o mais rápido
void travarMaquina(String jogador, int pinoBuzzer, int freqBase, int freqPico) {
  maquinaTravada = true;
  digitalWrite(PIN_LED_STATUS, HIGH); // Acende o LED geral de status
  
  // Envia a string (P1 ou P2) via USB para o computador
  Serial.println(jogador);

  // Inicia a sirene no buzzer correspondente
  sirenePino = pinoBuzzer;
  sireneFreqBase = freqBase;
  sireneFreqPico = freqPico;
  sireneInicio = millis();
  sireneAtiva = true;
}

// Varredura triangular: base -> pico -> base, repetida até SIRENE_DURACAO
void atualizarSirene() {
  if (!sireneAtiva) return;

  unsigned long decorrido = millis() - sireneInicio;
  if (decorrido >= SIRENE_DURACAO) {
    noTone(sirenePino);
    sireneAtiva = false;
    return;
  }

  unsigned long fase = decorrido % SIRENE_CICLO;
  unsigned long meio = SIRENE_CICLO / 2;
  long faixa = sireneFreqPico - sireneFreqBase;
  long freq = (fase < meio)
    ? sireneFreqBase + (faixa * (long)fase) / (long)meio
    : sireneFreqPico - (faixa * (long)(fase - meio)) / (long)meio;

  tone(sirenePino, (unsigned int)freq);
}

// Função para resetar e preparar para a próxima rodada
void resetarMaquina() {
  if (maquinaTravada) {
    maquinaTravada = false;
    digitalWrite(PIN_LED_STATUS, LOW); // Apaga o LED
    sireneAtiva = false;
    noTone(PIN_BUZZER_P1); // Garante silêncio
    noTone(PIN_BUZZER_P2);
    
    // Avisa o PC que a máquina foi resetada (opcional, útil para limpar a tela do site)
    Serial.println("RESETADO");
  }
}
