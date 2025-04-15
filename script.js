const canvas = document.getElementById("JogoCanvas")
const ctx = canvas.getContext("2d")

class Entidade {
    constructor(x, y, largura, altura, cor) {
        this.x = x,
        this.y = y,
        this.largura = largura,
        this.altura = altura,
        this.cor = cor
    }

    desenhar() {
        ctx.fillStyle = this.cor
        ctx.fillRect(this.x, this.y, this.largura, this.altura)
    }
}

class Jogador extends Entidade {
    constructor(x, y, largura, altura, cor) {
        super(x, y, largura, altura, cor)
        this.velocidadeY = 0
        this.pulando = false
        this.pontos = 0
    }

    saltar() {
        if (!this.pulando) {
            this.velocidadeY = -15
            this.pulando = true
        }
    }

    atualizar() {
        this.y += this.velocidadeY
        this.velocidadeY += 0.8

        if (this.y >= canvas.height - this.altura) {
            this.y = canvas.height - this.altura
            this.pulando = false
        }
    }

    coletarItem(item) {
        if (
            this.x < item.x + item.largura &&
            this.x + this.largura > item.x &&
            this.y < item.y + item.altura &&
            this.y + this.altura > item.y
        ) {
            item.resetar()
            this.pontos += 10
        }
    }
}

class Item extends Entidade {
    constructor(x, y, largura, altura, cor) {
        super(x, y, largura, altura, cor)
        this.velocidadeX = -5
    }

    atualizar() {
        this.x += this.velocidadeX;

        if (this.x + this.largura < 0) {
            this.resetar()
        }
    }

    resetar() {
        this.x = canvas.width
        this.y = Math.random() * (canvas.height - this.altura)
    }
}

class Obstaculo extends Entidade {
    constructor(x, y, largura, altura, cor) {
        super(x, y, largura, altura, cor)
        this.velocidadeX = 5
    }

    atualizar() {
        this.x += this.velocidadeX

        if (this.x + this.largura < 0) {
            this.x = canvas.width + Math.random() * 100
        }
    }
}

const jogador = new Jogador(50, canvas.height - 50, 40, 40, 'blue')
const item = new Item(canvas.width, Math.random() * (canvas.height - 30), 30, 30, 'yellow')
const obstaculo = new Obstaculo(canvas.width + 100, canvas.height - 50, 50, 50, 'red')

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    jogador.desenhar()
    jogador.atualizar()

    item.desenhar()
    item.atualizar()

    obstaculo.desenhar()
    obstaculo.atualizar()

    jogador.coletarItem(item)

    ctx.fillStyle = 'black'
    ctx.font = '20px Arial'
    ctx.fillText(`Pontos: ${jogador.pontos}`, 10, 20)

    requestAnimationFrame(loop)
}

document.addEventListener("keypress", (e) => {
    if (e.code === "Space") {
        jogador.saltar()
    }
})

loop()
