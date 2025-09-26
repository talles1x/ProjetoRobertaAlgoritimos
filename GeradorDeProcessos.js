const Processo = require('./processo.js');

/**
 * Gera novos processos quando solicitado.
 */
class GeradorDeProcessos {
    constructor() {
        this.proximoId = 1;
    }

    /**
     * Gera um novo processo com ID incremental e tamanho aleatório entre 10 e 50.
     * @returns {Processo} O novo processo gerado.
     */
    gerar() {
        const tamanhoMinimo = 10;
        const tamanhoMaximo = 50;
        const tamanho = Math.floor(Math.random() * (tamanhoMaximo - tamanhoMinimo + 1)) + tamanhoMinimo;
        const novoProcesso = new Processo(this.proximoId, tamanho);
        this.proximoId++;
        return novoProcesso;
    }
}

module.exports = GeradorDeProcessos;
