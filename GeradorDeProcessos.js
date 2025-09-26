const Processo = require('./processo.js');

class GeradorDeProcessos {
    constructor() {
        this.proximoId = 1;
    }

    gerar() {
        const tamanho = Math.floor(Math.random() * 41) + 10; // entre 10 e 50
        const p = new Processo(this.proximoId++, tamanho);
        return p;
    }
}

module.exports = GeradorDeProcessos;
