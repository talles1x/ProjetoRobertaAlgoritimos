/**
 * Representa um bloco (nó) na lista de memória.
 */
class NoMemoria {
    constructor(tamanho, isLivre = true) {
        this.tamanho = tamanho;
        this.isLivre = isLivre;
        this.processo = null;
        this.proximo = null;
        this.anterior = null;
    }
}

/**
 * Gerencia a memória, implementando os algoritmos de alocação.
 */
class Memoria {
    constructor(tamanhoTotal) {
        this.tamanhoTotal = tamanhoTotal;
        this.head = new NoMemoria(tamanhoTotal);
        this.ponteiroNextFit = this.head;
    }

    alocar(processo, algoritmo) {
        let blocoAlocado = null;

        switch (algoritmo) {
            case 'FIRST_FIT':
                blocoAlocado = this._firstFit(processo);
                break;
            case 'BEST_FIT':
                blocoAlocado = this._bestFit(processo);
                break;
            case 'WORST_FIT':
                blocoAlocado = this._worstFit(processo);
                break;
            case 'NEXT_FIT':
                blocoAlocado = this._nextFit(processo);
                break;
            default:
                throw new Error(`Algoritmo desconhecido: ${algoritmo}`);
        }

        if (blocoAlocado) {
            console.log(`[INFO] ${algoritmo} alocou processo ${processo.id} (tamanho ${processo.tamanho})`);
            this._dividirBloco(blocoAlocado, processo);
            this.ponteiroNextFit = blocoAlocado.proximo || this.head;
            return true;
        } else {
            console.log(`[INFO] ${algoritmo} NÃO conseguiu alocar processo ${processo.id} (tamanho ${processo.tamanho})`);
        }

        return false;
    }

    liberar(processoId) {
        let atual = this.head;
        while (atual) {
            if (!atual.isLivre && atual.processo && atual.processo.id === processoId) {
                atual.isLivre = true;
                atual.processo = null;
                this._fundirBlocos(atual);
                return;
            }
            atual = atual.proximo;
        }
    }

    _firstFit(processo) {
        let atual = this.head;
        while (atual) {
            if (atual.isLivre && atual.tamanho >= processo.tamanho) return atual;
            atual = atual.proximo;
        }
        return null;
    }

    _nextFit(processo) {
        let atual = this.ponteiroNextFit;
        const inicio = this.ponteiroNextFit;

        do {
            if (atual.isLivre && atual.tamanho >= processo.tamanho) return atual;
            atual = atual.proximo || this.head;
        } while (atual !== inicio);

        return null;
    }

    _bestFit(processo) {
        let melhorBloco = null;
        let menorDiferenca = Infinity;
        let atual = this.head;

        while (atual) {
            if (atual.isLivre && atual.tamanho >= processo.tamanho) {
                const diferenca = atual.tamanho - processo.tamanho;
                if (diferenca < menorDiferenca) {
                    melhorBloco = atual;
                    menorDiferenca = diferenca;
                }
            }
            atual = atual.proximo;
        }

        return melhorBloco;
    }

    _worstFit(processo) {
        let piorBloco = null;
        let maiorDiferenca = -1;
        let atual = this.head;

        while (atual) {
            if (atual.isLivre && atual.tamanho >= processo.tamanho) {
                const diferenca = atual.tamanho - processo.tamanho;
                if (diferenca > maiorDiferenca) {
                    piorBloco = atual;
                    maiorDiferenca = diferenca;
                }
            }
            atual = atual.proximo;
        }

        return piorBloco;
    }

    _dividirBloco(bloco, processo) {
        const restante = bloco.tamanho - processo.tamanho;
        if (restante > 0) {
            const novoBloco = new NoMemoria(restante);
            novoBloco.proximo = bloco.proximo;
            if (bloco.proximo) bloco.proximo.anterior = novoBloco;
            bloco.proximo = novoBloco;
            novoBloco.anterior = bloco;
            bloco.tamanho = processo.tamanho;
        }
        bloco.isLivre = false;
        bloco.processo = processo;
    }

    _fundirBlocos(bloco) {
        // Fundir com próximo
        while (bloco.proximo && bloco.proximo.isLivre) {
            bloco.tamanho += bloco.proximo.tamanho;
            bloco.proximo = bloco.proximo.proximo;
            if (bloco.proximo) bloco.proximo.anterior = bloco;
        }

        // Fundir com anterior
        while (bloco.anterior && bloco.anterior.isLivre) {
            bloco.anterior.tamanho += bloco.tamanho;
            bloco.anterior.proximo = bloco.proximo;
            if (bloco.proximo) bloco.proximo.anterior = bloco.anterior;
            bloco = bloco.anterior;
        }
    }

    getOcupacao() {
        let ocupada = 0;
        let atual = this.head;
        while (atual) {
            if (!atual.isLivre) ocupada += atual.tamanho;
            atual = atual.proximo;
        }
        return (ocupada / this.tamanhoTotal) * 100;
    }
}

module.exports = Memoria;
