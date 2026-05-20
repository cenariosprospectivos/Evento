# Storytelling — União entre organizações criminosas na faixa de fronteira do Brasil

## Como abrir
Abra `index.html` com duplo clique. O projeto usa Leaflet e Chart.js por CDN, então os mapas-base e gráficos dependem de internet.

## Onde alterar os insumos
Todos os insumos estão na pasta `Data`.

### Textos
- `Data/textos/abertura.js`
- `Data/textos/faixa_fronteira.js`
- `Data/textos/orcrim_atuacao.js`
- `Data/textos/timeline.js`
- `Data/textos/apreensao_santos.js`
- `Data/textos/apreensao_cone_norte.js`
- `Data/textos/conclusao.js`

### Mapas
- `Data/geojson/faixa_fronteira_brasil.js`
- `Data/geojson/orcrim_pins.js`

### Notícias e timeline
- `Data/noticias/noticias_fronteira.js`

A timeline usa a mesma base das notícias. Para ocultar uma notícia da timeline, altere:
`usar_na_timeline: false`

### Gráficos
- `Data/series/apreensao_santos.js`
- `Data/series/apreensao_cone_norte.js`
- `Data/series/glo_forca_nacional.js`

Os gráficos estão padronizados como linha e período 2020–2025.

### Imagem do cabeçalho
A imagem ficou para depois. Quando quiser incluir, coloque a imagem em:
`Data/media/hero.jpg`

Depois altere:
`Data/config/storytelling.js`

de:
`heroImage: ""`

para:
`heroImage: "Data/media/hero.jpg"`

## Observação
O projeto foi estruturado para receber novas seções no futuro sem alterar os insumos já existentes.
