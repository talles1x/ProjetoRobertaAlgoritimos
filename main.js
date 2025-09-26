const simular = require('./Simulador.js');

async function main() {
    const REPETICOES = 100;
    const ALGORITMOS = ['FIRST_FIT', 'NEXT_FIT', 'BEST_FIT', 'WORST_FIT'];
    const resultadosFinais = {};

    console.log('Iniciando experimento de alocação de memória...\n');

    for (const alg of ALGORITMOS) {
        console.log(`Executando: ${alg}`);
        const metricas = [];
        let erros = 0;

        for (let i = 0; i < REPETICOES; i++) {
            try {
                // Feedback a cada 10%
                if ((i + 1) % 10 === 0) {
                    console.log(`  ${alg}: ${i + 1}/${REPETICOES}`);
                }
                
                const metrica = simular(alg);
                metricas.push(metrica);
                
            } catch (e) {
                erros++;
                console.log(`  Erro em ${alg} - repetição ${i + 1}: ${e.message}`);
            }
        }

        console.log(`  ✅ ${alg} concluído: ${metricas.length} simulações válidas`);

        if (metricas.length > 0) {
            resultadosFinais[alg] = {
                mediaTamanhoGerado: metricas.reduce((s, m) => s + m.tamanhoMedioGerado, 0) / metricas.length,
                mediaOcupacao: metricas.reduce((s, m) => s + m.ocupacaoMedia, 0) / metricas.length,
                mediaTaxaDescarte: metricas.reduce((s, m) => s + m.taxaDescarte, 0) / metricas.length
            };
        }
    }

    // Relatório final
    console.log('\n======================================================');
    console.log('RESULTADOS FINAIS:');
    console.log('======================================================');
    
    for (const alg of ALGORITMOS) {
        const r = resultadosFinais[alg];
        console.log(`\n${alg}:`);
        console.log(`  Tamanho médio dos processos: ${r.mediaTamanhoGerado.toFixed(2)} `);
        console.log(`  Ocupação média da memória: ${r.mediaOcupacao.toFixed(2)}%`);
        console.log(`  Taxa de descarte: ${r.mediaTaxaDescarte.toFixed(2)}%`);
    }
    console.log('======================================================');
}

if (require.main === module) {
    main().catch(error => {
        console.error('Erro na execução:', error);
    });
}

module.exports = main;