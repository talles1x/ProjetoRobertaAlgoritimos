const Memoria = require('./Memoria.js');
const GeradorDeProcessos = require('./GeradorDeProcessos.js');

/**
 * Executa uma simulação de alocação de memória.
 * @param {string} algoritmo O algoritmo a ser usado.
 * @returns {object|null} Métricas da simulação ou null se nenhum processo alocado.
 */
function simular(algoritmo) {
    const DURACAO_SEGUNDOS = 100;
    const TAMANHO_MEMORIA = 2000; // Aumentado para reduzir fragmentação
    const PROCESSOS_POR_SEGUNDO = 1; // Menos processos para evitar fragmentação extrema

    const memoria = new Memoria(TAMANHO_MEMORIA);
    const gerador = new GeradorDeProcessos();

    let processosGerados = [];
    let processosAlocados = new Map();
    let processosDescartados = 0;
    let ocupacaoPorSegundo = [];

    for (let s = 0; s < DURACAO_SEGUNDOS; s++) {
        // Criação e alocação
        for (let i = 0; i < PROCESSOS_POR_SEGUNDO; i++) {
            const p = gerador.gerar();
            processosGerados.push(p);
            const alocou = memoria.alocar(p, algoritmo);
            if (alocou) processosAlocados.set(p.id, p);
            else processosDescartados++;
        }

        // Remoção de processos aleatórios
        if (processosAlocados.size > 0) {
            const numRemover = Math.min(processosAlocados.size, Math.random() < 0.5 ? 1 : 2);
            const ids = Array.from(processosAlocados.keys());

            for (let i = 0; i < numRemover; i++) {
                const idx = Math.floor(Math.random() * ids.length);
                const idRemover = ids.splice(idx, 1)[0];
                memoria.liberar(idRemover);
                processosAlocados.delete(idRemover);
            }
        }

        ocupacaoPorSegundo.push(memoria.getOcupacao());
    }

    if (processosGerados.length === 0) return null;

    const tamanhoMedio = processosGerados.reduce((s, p) => s + p.tamanho, 0) / processosGerados.length;
    const ocupacaoMedia = ocupacaoPorSegundo.reduce((s, o) => s + o, 0) / ocupacaoPorSegundo.length;
    const taxaDescarte = (processosDescartados / processosGerados.length) * 100;

    return {
        tamanhoMedioGerado: tamanhoMedio,
        ocupacaoMedia,
        taxaDescarte
    };
}

module.exports = simular;
