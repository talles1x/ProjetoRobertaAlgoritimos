# Simulador de Alocação de Memória

Simulador em **JavaScript (Node.js)** que compara quatro algoritmos clássicos de alocação contígua de memória: **First Fit, Next Fit, Best Fit e Worst Fit**. Trabalho acadêmico.

## Como funciona

- A memória tem 1000 unidades e é representada por uma **lista duplamente encadeada** de blocos livres e ocupados
- A cada segundo da simulação, que dura 100 s, entram 2 processos com tamanho aleatório entre 10 e 50, e 1 ou 2 processos aleatórios são liberados
- Ao alocar, o bloco escolhido é dividido. Ao liberar, os blocos livres vizinhos são fundidos para reduzir a fragmentação
- Quando nenhum bloco comporta o processo, ele é descartado
- Cada algoritmo roda **100 vezes**, e o resultado final é a média dessas execuções

## Métricas

| Métrica | O que mede |
| :-- | :-- |
| Tamanho médio dos processos | Média dos tamanhos gerados |
| Ocupação média da memória | Percentual da memória em uso ao longo da simulação |
| Taxa de descarte | Percentual de processos que não conseguiram ser alocados |

## Exemplo de resultado

```
FIRST_FIT   ocupação 57.83%   descarte  9.86%
NEXT_FIT    ocupação 45.84%   descarte  9.26%
BEST_FIT    ocupação 60.27%   descarte 10.39%
WORST_FIT   ocupação 54.61%   descarte 11.45%
```

Os números mudam a cada execução, porque os processos são gerados aleatoriamente.

## Como rodar

Requer Node.js 16 ou superior, sem dependências.

```bash
git clone https://github.com/talles1x/ProjetoRobertaAlgoritimos.git
cd ProjetoRobertaAlgoritimos
node main.js
```

## Estrutura

```
main.js                # roda o experimento e imprime o relatório
Simulador.js           # uma simulação de 100 s para um algoritmo
Memoria.js             # lista encadeada + First/Next/Best/Worst Fit, divisão e fusão de blocos
GeradorDeProcessos.js  # cria processos com tamanho aleatório
processo.js            # modelo de processo
```
