window.GEO_FAIXA_FRONTEIRA = {
  type: "FeatureCollection",
  name: "faixa_fronteira_brasil_storytelling",
  fonte: "Representação visual simplificada elaborada para storytelling com base na definição da Lei nº 6.634/1979.",
  data_base: "2026-05-20",
  observacao: "Camada esquemática, sem finalidade jurídica, cadastral ou geodésica.",
  features: [
    {
      type: "Feature",
      properties: {
        id: "FF-BR",
        nome: "Faixa de fronteira terrestre do Brasil",
        tipo: "linha_enfase_storytelling",
        largura_referencia_km: 150,
        descricao: "Linha de ênfase visual acompanhando, de forma simplificada, a faixa de fronteira terrestre do Brasil para ambientação do storytelling.",
        fonte_conceitual: "Lei nº 6.634/1979",
        uso: "Ambientação visual do storytelling prospectivo."
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-51.82, 4.48], [-52.5, 3.8], [-54.3, 2.8], [-56.0, 2.5], [-58.8, 4.2],
          [-60.9, 3.35], [-61.1, 4.48], [-63.9, 4.2], [-66.8, 2.2], [-69.94, -4.25],
          [-70.7, -7.6], [-68.75, -11.02], [-69.87, -15.19], [-57.68, -16.07],
          [-57.65, -19.0], [-58.0, -22.2], [-54.58, -25.52], [-55.73, -22.54],
          [-57.5, -25.2], [-57.6, -27.6], [-55.1, -30.2], [-53.2, -32.5]
        ]
      }
    }
  ]
};
