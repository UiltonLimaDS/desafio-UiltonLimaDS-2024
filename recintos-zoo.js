class RecintosZoo {
  constructor() {
    this.animais = [
      { especie: "LEAO", tamanho: 3, bioma: ["savana"] },
      { especie: "LEOPARDO", tamanho: 2, bioma: ["savana"] },
      { especie: "CROCODILO", tamanho: 3, bioma: ["rio"] },
      { especie: "MACACO", tamanho: 1, bioma: ["savana", "floresta"] },
      { especie: "GAZELA", tamanho: 2, bioma: ["savana"] },
      { especie: "HIPOPOTAMO", tamanho: 4, bioma: ["savana", "rio"] },
    ];

    this.recintos = [
      { numero: 1, bioma: "savana", tamanho: 10, animaisExistentes: [{ especie: "MACACO", quantidade: 3 }] },
      { numero: 2, bioma: "floresta", tamanho: 5, animaisExistentes: [] },
      { numero: 3, bioma: "savana e rio", tamanho: 7, animaisExistentes: [{ especie: "GAZELA", quantidade: 1 }] },
      { numero: 4, bioma: "rio", tamanho: 8, animaisExistentes: [] },
      { numero: 5, bioma: "savana", tamanho: 9, animaisExistentes: [{ especie: "LEAO", quantidade: 1 }] },
    ];
  }

  analisaRecintos(animal, quantidade) {
    // Validações iniciais
    const especieInfo = this.animais.find(a => a.especie === animal.toUpperCase());
    if (!especieInfo) {
      return { erro: "Animal inválido" };
    }
    if (quantidade <= 0 || !Number.isInteger(quantidade)) {
      return { erro: "Quantidade inválida" };
    }

    const recintosViaveis = [];

    // Percorrer os recintos para verificar a viabilidade
    for (let recinto of this.recintos) {
      const biomaOk = especieInfo.bioma.includes(recinto.bioma) || recinto.bioma.includes(especieInfo.bioma[0]);
      if (!biomaOk) continue;

      const espacoOcupado = recinto.animaisExistentes.reduce((total, a) => {
        const animalRecinto = this.animais.find(an => an.especie === a.especie);
        return total + (animalRecinto.tamanho * a.quantidade);
      }, 0);

      const espacoExtra = recinto.animaisExistentes.length > 0 && recinto.animaisExistentes[0].especie !== animal ? 1 : 0;
      const espacoTotalNecessario = especieInfo.tamanho * quantidade + espacoExtra;

      if (recinto.tamanho >= espacoOcupado + espacoTotalNecessario) {
        if (this.verificarConvivencia(recinto, especieInfo, quantidade)) {
          const espacoLivre = recinto.tamanho - (espacoOcupado + espacoTotalNecessario);
          recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`);
        }
      }
    }

    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    return { recintosViaveis: recintosViaveis.sort() };
  }

  verificarConvivencia(recinto, especieInfo, quantidade) {
    // Regras de convivência
    const carnívoros = ["LEAO", "LEOPARDO", "CROCODILO"];
    const jaTemAnimais = recinto.animaisExistentes.length > 0;
    const primeiroAnimal = recinto.animaisExistentes[0]?.especie;

    if (carnívoros.includes(especieInfo.especie)) {
      return !jaTemAnimais || primeiroAnimal === especieInfo.especie;
    }

    if (especieInfo.especie === "HIPOPOTAMO") {
      return recinto.bioma === "savana e rio";
    }

    if (especieInfo.especie === "MACACO") {
      return !jaTemAnimais || recinto.animaisExistentes.some(a => a.quantidade > 1);
    }

    return true;
  }
}

export { RecintosZoo as RecintosZoo };
