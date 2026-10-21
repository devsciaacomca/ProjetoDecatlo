# Como Integrar seu Site (Frontend) à Máquina de Quiz

Como você já possui o site da Gincana pronto em HTML/JS, a integração é muito simples. Você só precisa adicionar o código cliente do **Socket.io** no seu arquivo HTML.

## Passo 1: Preparar o Servidor no Ubuntu

No seu computador com Ubuntu que ficará conectado ao Arduino via cabo USB, você precisa rodar o servidor que criamos.

1. Abra o terminal na pasta `backend`
2. Instale as dependências (você precisará ter o Node.js instalado no sistema):
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```

> **Dica sobre Permissões (Ubuntu):**
> Se ao rodar `npm start` você receber um erro dizendo "Access Denied" para a porta `/dev/ttyACM0`, isso significa que seu usuário não tem permissão para ler portas USB seriais.
> Para corrigir, execute no terminal: `sudo usermod -a -G dialout $USER` e depois **reinicie o seu computador** (ou faça logoff e login novamente) para que a permissão tenha efeito.

> **Dica sobre a Porta:**
> Se disser que a porta `/dev/ttyACM0` não foi encontrada, rode no terminal `ls /dev/tty*` e procure por `/dev/ttyUSB0` ou algo similar. Em seguida, altere o nome da porta no arquivo `backend/server.js`.

---

## Passo 2: Injetar o código no seu Site (index.html)

Abra o arquivo principal HTML do seu site no seu editor de código e cole o bloco de código abaixo **logo antes de fechar a tag `</body>`**:

```html
<!-- 1. Carrega a biblioteca do Socket.io (via internet) -->
<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>

<!-- 2. Script para se conectar à ponte do Arduino -->
<script>
    // Conecta ao servidor Node.js que está rodando no próprio Ubuntu (porta 3000)
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
        console.log('Site da Gincana conectado ao Arduino com sucesso!');
    });

    // -------------------------------------------------------------
    // EVENTO 1: Alguém apertou o botão na máquina física
    // -------------------------------------------------------------
    socket.on('botaoApertado', (dados) => {
        console.log("JOGADOR ACIONADO:", dados.jogador);
        
        if (dados.jogador === 'P1') {
            // ==========================================
            // COLOQUE SEU CÓDIGO AQUI PARA O JOGADOR 1
            // Exemplo: mostrar o nome dele na tela, tocar um som no site, etc.
            // ==========================================
            alert("JOGADOR 1 APERTOU O BOTÃO!");
            
        } 
        else if (dados.jogador === 'P2') {
            // ==========================================
            // COLOQUE SEU CÓDIGO AQUI PARA O JOGADOR 2
            // ==========================================
            alert("JOGADOR 2 APERTOU O BOTÃO!");
        }
    });

    // -------------------------------------------------------------
    // EVENTO 2: A máquina foi resetada (pelo botão físico do apresentador)
    // -------------------------------------------------------------
    socket.on('resetado', () => {
        console.log("Máquina liberada para a próxima rodada!");
        // ==========================================
        // COLOQUE SEU CÓDIGO AQUI PARA LIMPAR A TELA (se necessário)
        // ==========================================
    });

    // -------------------------------------------------------------
    // BÔNUS: Botão no próprio site para resetar a máquina física
    // -------------------------------------------------------------
    // Se você quiser colocar um botão "<button onclick='resetarArduino()'>Resetar</button>" no seu site
    function resetarArduino() {
        socket.emit('comandoPC', 'RESET');
    }
</script>
```

## Como Testar
1. Conecte o Arduino no PC.
2. Rode o `npm start` na pasta `backend`.
3. Abra o arquivo `index.html` do seu site no Firefox.
4. Aperte o botão da máquina física. O Arduino acenderá o LED e tocará o Buzzer. O sinal vai pro Node.js, e o Node.js envia via WebSocket para o Firefox, disparando o `alert()` do jogador correspondente na sua tela instantaneamente!
