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
        travarMaquina("P1", PIN_BUZZER_P1, 1000); // 1000Hz (Bipe Agudo)
        tempoUltimoClique = tempoAtual;
      } 
      else if (p2Pressionado) {
        travarMaquina("P2", PIN_BUZZER_P2, 500);  // 500Hz (Bipe Mais Grave)
        tempoUltimoClique = tempoAtual;
      }
    }
  }
}

// Função que trava o sistema e avisa quem foi o mais rápido
void travarMaquina(String jogador, int pinoBuzzer, int frequenciaSom) {
  maquinaTravada = true;
  digitalWrite(PIN_LED_STATUS, HIGH); // Acende o LED geral de status
  
  // Envia a string (P1 ou P2) via USB para o computador
  Serial.println(jogador);

  // Toca o som por 500ms no buzzer correspondente (se os buzzers estiverem ligados)
  tone(pinoBuzzer, frequenciaSom, 500); 
}

// Função para resetar e preparar para a próxima rodada
void resetarMaquina() {
  if (maquinaTravada) {
    maquinaTravada = false;
    digitalWrite(PIN_LED_STATUS, LOW); // Apaga o LED
    noTone(PIN_BUZZER_P1); // Garante silêncio
    noTone(PIN_BUZZER_P2);
    
    // Avisa o PC que a máquina foi resetada (opcional, útil para limpar a tela do site)
    Serial.println("RESETADO");
  }
}
