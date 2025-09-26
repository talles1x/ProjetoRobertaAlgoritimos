const Memoria = require('./Memoria.js');
const GeradorDeProcessos = require('./GeradorDeProcessos.js');

function simular(algoritmo) {
    const memoria = new Memoria(1000);
    const gerador = new GeradorDeProcessos();
    const ocupacaoPorSegundo = [];
    const processosGerados = [];
    let processosDescartados = 0;
    const processosAlocados = new Map();

    for (let segundo = 0; segundo < 100; segundo++) {
        // Gera 2 processos por segundo
        for (let i = 0; i < 2; i++) {
            const processo = gerador.gerar();
            processosGerados.push(processo);
            
            try {
                const alocado = memoria.alocar(processo, algoritmo);
                if (alocado) {
                    processosAlocados.set(processo.id, processo);
                } else {
                    processosDescartados++;
                }
            } catch (error) {
                processosDescartados++;
            }
        }

        // Remove 1-2 processos aleatórios
        if (processosAlocados.size > 0) {
            const numRemover = Math.random() < 0.5 ? 1 : Math.min(2, processosAlocados.size);
            const idsParaRemover = Array.from(processosAlocados.keys());
            let removidos = 0;

            for (let i = 0; i < numRemover && idsParaRemover.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * idsParaRemover.length);
                const id = idsParaRemover[randomIndex];
                
                idsParaRemover.splice(randomIndex, 1);
                
                if (processosAlocados.has(id)) {
                    try {
                        memoria.liberar(id);
                        processosAlocados.delete(id);
                        removidos++;
                    } catch (error) {
                        // Silencia erros de liberação
                    }
                }
            }
        }

        // Coleta métrica de ocupação
        try {
            const ocupacao = memoria.getOcupacao();
            ocupacaoPorSegundo.push(ocupacao);
        } catch (error) {
            ocupacaoPorSegundo.push(0);
        }
    }

    // Cálculo das métricas finais
    const totalProcessos = processosGerados.length;
    
    const metricas = {
        tamanhoMedioGerado: totalProcessos > 0 
            ? processosGerados.reduce((s, p) => s + p.tamanho, 0) / totalProcessos 
            : 0,
        ocupacaoMedia: ocupacaoPorSegundo.length > 0
            ? ocupacaoPorSegundo.reduce((s, o) => s + o, 0) / ocupacaoPorSegundo.length
            : 0,
        taxaDescarte: totalProcessos > 0
            ? (processosDescartados / totalProcessos) * 100
            : 0
    };

    return metricas;
}

module.exports = simular;