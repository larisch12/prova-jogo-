const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Entidade {
constructor(x, y, largura, altura, cor) {
this.x = x;
this.y = y;
this.largura = largura;
this.altura = altura;
this.cor = cor;
}

desenhar() {
ctx.fillStyle = this.cor;
ctx.fillRect(this.x, this.y, this.largura, this.altura);
}
}

class Jogador extends Entidade {
constructor() {
super(canvas.width/2 - 25, canvas.height - 60, 50, 50, 'red')
this.velocidade = 15
}

mover(direcao) {
if (direcao == 'esquerda') this.x = Math.max(0, this.x - this.velocidade)
if (direcao == 'direita') this.x = Math.min(canvas.width - this.largura, this.x + this.velocidade)
}

atirar() {
return new Tiro(this.x + this.largura/2 - 2.5, this.y - 10)
}
}

class Alien extends Entidade {
constructor(x) {
super(x, -40, 40, 40, 'white')
this.velocidade = 1 + Math.random() * 0.5
}

atualizar() {
this.y += this.velocidade
return this.y > canvas.height
}
}

class Tiro extends Entidade {
constructor(x, y) {
super(x, y, 5, 15, 'pink')
this.velocidade = 8
}

atualizar() {
this.y -= this.velocidade
return this.y < 0
}
}

const jogador = new Jogador()
const tiros = []
const aliens = []
let pontuacao = 0
let gameOver = false
let ultimoAlien = 0

document.addEventListener('keydown', (e) => {
if (gameOver) return

if (e.key == 'ArrowLeft') jogador.mover('esquerda')
if (e.key == 'ArrowRight') jogador.mover('direita')
if (e.key == ' ') tiros.push(jogador.atirar())
})

function checarColisao(a, b) {
return a.x < b.x + b.largura &&
a.x + a.largura > b.x &&
a.y < b.y + b.altura &&
a.y + a.altura > b.y;
}

function loop() {
ctx.clearRect(0, 0, canvas.width, canvas.height)

if (!gameOver) {

if (Date.now() - ultimoAlien > 2000) {
aliens.push(new Alien(Math.random() * (canvas.width - 40)))
ultimoAlien = Date.now()
}

for (let i = aliens.length - 1; i >= 0; i--) {
if (aliens[i].atualizar()) {
gameOver = true
break
}

if (checarColisao(aliens[i], jogador)) {
gameOver = true
break
}

aliens[i].desenhar()
}

for (let i = tiros.length - 1; i >= 0; i--) {
if (tiros[i].atualizar()) {
tiros.splice(i, 1)
continue
}

for (let j = aliens.length - 1; j >= 0; j--) {
if (checarColisao(tiros[i], aliens[j])) {
aliens.splice(j, 1)
tiros.splice(i, 1)
pontuacao += 10
break
}
}

if (i < tiros.length) tiros[i].desenhar()
}

jogador.desenhar()

ctx.fillStyle = 'gray'
ctx.font = '10px Arial'
ctx.fillText(`Pontuação: ${pontuacao}`, 10, 30)
} else {

ctx.fillStyle = 'gray'
ctx.font = '48px Arial'
ctx.fillText('Game Over', canvas.width/2 - 120, canvas.height/2)
ctx.font = '20px Arial'
ctx.fillText(` Pontos finais: ${pontuacao}`, canvas.width/2 - 100, canvas.height/2 + 40)
}
requestAnimationFrame(loop)
}
loop()