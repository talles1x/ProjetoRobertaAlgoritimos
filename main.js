const simular = require('./Simulador.js');

function main() {
    const REPETICOES = 100;
    const ALGORITMOS = ['FIRST_FIT', 'NEXT_FIT', 'BEST_FIT', 'WORST_FIT'];

    console.log('Iniciando o experimento de alocação de memória...');
    console.log(`Configuração: ${REPETICOES} repetições para cada algoritmo.\n`);

    const resultadosFinais = {};

    for (const algoritmo of ALGORITMOS) {
        console.log(`--- Executando simulações para o algoritmo: ${algoritmo} ---`);
        const metricas = [];

        for (let i = 0; i < REPETICOES; i++) {
            const res = simular(algoritmo);
            if (!res) {
                console.error(`\n[ERRO] Nenhum processo alocado no algoritmo ${algoritmo}, repetição ${i + 1}`);
                continue;
            }
            metricas.push(res);
            process.stdout.write(`\rRepetição ${i + 1}/${REPETICOES} concluída.`);
        }
        console.log('\n');

        const total = metricas.length;
        resultadosFinais[algoritmo] = {
            mediaTamanhoGerado: total > 0 ? metricas.reduce((s, m) => s + m.tamanhoMedioGerado, 0) / total : 0,
            mediaOcupacao: total > 0 ? metricas.reduce((s, m) => s + m.ocupacaoMedia, 0) / total : 0,
            mediaTaxaDescarte: total > 0 ? metricas.reduce((s, m) => s + m.taxaDescarte, 0) / total : 0,
        };
    }

    console.log('======================================================');
    console.log('Resultados Finais (Média de 100 execuções)');
    console.log('======================================================');
    for (const algoritmo of ALGORITMOS) {
        const res = resultadosFinais[algoritmo];
        console.log(`\nAlgoritmo: ${algoritmo}`);
        console.log(`  - Tamanho médio dos processos gerados: ${res.mediaTamanhoGerado.toFixed(2)}`);
        console.log(`  - Ocupação média da memória: ${res.mediaOcupacao.toFixed(2)}%`);
        console.log(`  - Taxa de descarte (processos não alocados): ${res.mediaTaxaDescarte.toFixed(2)}%`);
    }
    console.log('======================================================');
}

main();
