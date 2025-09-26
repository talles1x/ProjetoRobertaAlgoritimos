class NoMemoria {
    constructor(tamanho, isLivre = true) {
        this.tamanho = tamanho;
        this.isLivre = isLivre;
        this.processo = null;
        this.proximo = null;
        this.anterior = null;
    }
}

class Memoria {
    constructor(tamanhoTotal) {
        this.tamanhoTotal = tamanhoTotal;
        this.head = new NoMemoria(tamanhoTotal);
        this.ponteiroNextFit = this.head;
    }

    alocar(processo, algoritmo) {
        let bloco = null;

        switch (algoritmo) {
            case 'FIRST_FIT': bloco = this._firstFit(processo); break;
            case 'NEXT_FIT': bloco = this._nextFit(processo); break;
            case 'BEST_FIT': bloco = this._bestFit(processo); break;
            case 'WORST_FIT': bloco = this._worstFit(processo); break;
            default: throw new Error('Algoritmo desconhecido');
        }

        if (bloco) {
            this._dividirBloco(bloco, processo);
            if (algoritmo === 'NEXT_FIT') this.ponteiroNextFit = bloco.proximo || this.head;
            return true;
        }
        return false;
    }

    liberar(id) {
        let atual = this.head;
        while (atual) {
            if (!atual.isLivre && atual.processo?.id === id) {
                atual.isLivre = true;
                atual.processo = null;
                this._fundirBlocos(atual);
                return true;
            }
            atual = atual.proximo;
        }
        return false;
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
    let inicio = this.ponteiroNextFit;
    let atual = inicio;
    let iteracoes = 0;
    const maxIteracoes = 1000; // Prevenção contra loop infinito

    do {
        if (atual.isLivre && atual.tamanho >= processo.tamanho) {
            return atual;
        }
        
        atual = atual.proximo || this.head;
        iteracoes++;
        
        // Prevenção contra loop infinito
        if (iteracoes >= maxIteracoes) {
            return null;
        }
        
    } while (atual !== inicio);

    return null;
}
    _bestFit(processo) {
        let melhor = null, menor = Infinity, atual = this.head;
        while (atual) {
            if (atual.isLivre && atual.tamanho >= processo.tamanho) {
                let dif = atual.tamanho - processo.tamanho;
                if (dif < menor) { melhor = atual; menor = dif; }
            }
            atual = atual.proximo;
        }
        return melhor;
    }

    _worstFit(processo) {
        let pior = null, maior = -1, atual = this.head;
        while (atual) {
            if (atual.isLivre && atual.tamanho >= processo.tamanho) {
                let dif = atual.tamanho - processo.tamanho;
                if (dif > maior) { pior = atual; maior = dif; }
            }
            atual = atual.proximo;
        }
        return pior;
    }

    _dividirBloco(bloco, processo) {
        const resto = bloco.tamanho - processo.tamanho;
        
        // Se o resto for muito pequeno (menos que 10% do tamanho original), não divide
        if (resto > 0 && resto >= processo.tamanho * 0.1) {
            const novo = new NoMemoria(resto);
            novo.proximo = bloco.proximo;
            novo.anterior = bloco;
            if (bloco.proximo) bloco.proximo.anterior = novo;
            bloco.proximo = novo;
            bloco.tamanho = processo.tamanho;
        }
        
        bloco.isLivre = false;
        bloco.processo = processo;
    }

    _fundirBlocos(bloco) {
        // Fundir com próximo bloco livre
        if (bloco.proximo && bloco.proximo.isLivre) {
            bloco.tamanho += bloco.proximo.tamanho;
            bloco.proximo = bloco.proximo.proximo;
            if (bloco.proximo) {
                bloco.proximo.anterior = bloco;
            }
        }

        // Fundir com bloco anterior livre
        if (bloco.anterior && bloco.anterior.isLivre) {
            bloco.anterior.tamanho += bloco.tamanho;
            bloco.anterior.proximo = bloco.proximo;
            if (bloco.proximo) {
                bloco.proximo.anterior = bloco.anterior;
            }
            // Atualizar ponteiro nextFit se necessário
            if (this.ponteiroNextFit === bloco) {
                this.ponteiroNextFit = bloco.anterior;
            }
            bloco = bloco.anterior;
        }
    }

    getOcupacao() {
        let atual = this.head, ocupado = 0;
        while (atual) { 
            if (!atual.isLivre) ocupado += atual.tamanho; 
            atual = atual.proximo; 
        }
        return (ocupado / this.tamanhoTotal) * 100;
    }

    // Método auxiliar para debug
    imprimirEstado() {
        let atual = this.head;
        let resultado = [];
        while (atual) {
            resultado.push(`${atual.isLivre ? 'LIVRE' : 'OCUPADO'}: ${atual.tamanho} bytes`);
            atual = atual.proximo;
        }
        console.log('Estado da memória:', resultado.join(' -> '));
    }
}

module.exports = Memoria;