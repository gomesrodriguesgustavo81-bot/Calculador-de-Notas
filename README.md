# Calculador de Notas

Uma Progressive Web App (PWA) simples para calcular notas e estimar o risco de aprovação.

## Arquivos principais

- `index.html` – Página principal da app.
- `style.css` – Estilos da app.
- `script.js` – Lógica de cálculo e registro do service worker.
- `manifest.json` – Metadados para PWA.
- `service-worker.js` – Cache offline da app.
- `icon-192x192.png`, `icon-512x512.png` – Ícones do PWA.

## Como usar localmente

1. Abra um terminal em `/workspaces/Calculador-de-Notas`.
2. Execute:

```bash
python3 -m http.server 8000
```

3. Abra no navegador:

```bash
http://localhost:8000
```

4. No celular, abra a mesma URL em um navegador compatível para instalar a PWA.

## Publicação no GitHub Pages

Este repositório já gerou o branch `gh-pages` via GitHub Actions.

Se o site não estiver ativo automaticamente, habilite em:

`Settings > Pages > Branch > gh-pages / root`

URL provável:

`https://gomesrodriguesgustavo81-bot.github.io/Calculador-de-Notas/`

## Instalação no celular

- Abra o site no navegador móvel.
- Procure pelo banner de instalação ou use o menu do navegador.
- Escolha "Adicionar à tela inicial" / "Instalar app".

