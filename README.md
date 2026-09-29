# Uboatt · Conheça antes de embarcar

Protótipo funcional da experiência **"Entre a bordo"**: a pessoa conhece a lancha em 360° antes de reservar, manda o tour no grupo e é convidada a planejar o passeio (campanha **Quem marca, embarca**).

> **Tour demonstrativo.** O tour exibido é um modelo público do Matterport de outra embarcação (Fairline Targa 43, Model ID `WVdYpfzTFcg`), usado **apenas para demonstrar a interação**. Ele é incorporado pelo iframe oficial: nenhuma imagem ou ativo do Matterport é baixado, copiado ou hospedado aqui. A versão final utilizará imagens reais das embarcações Uboatt.

Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lucide Icons · Marzipano (carregado sob demanda). Sem banco de dados e sem login.

---

## Como instalar

Requisitos: **Node.js 20.9 ou mais recente** e npm.

```bash
npm install
```

## Como executar

```bash
npm run dev      # desenvolvimento em http://localhost:3000
npm run lint     # ESLint
npm run build    # build de produção
npm run start    # serve o build de produção
```

### Rotas e atalhos úteis

| Endereço | O que mostra |
| --- | --- |
| `/` | Redireciona para `/boat-tour` |
| `/boat-tour` | Página da experiência (modo Matterport) |
| `/boat-tour#a-bordo` | Abre direto no tour imersivo |
| `/boat-tour?simular=erro` | Força o estado de erro do tour (o "Tentar novamente" carrega normalmente) |
| `/boat-tour/marzipano` | Prévia técnica do modo Marzipano (cenas e hotspots, sem panoramas ainda) |
| `/boat-tour/opengraph-image` | Imagem de prévia do link (WhatsApp, Instagram…) |

O modo imersivo fica na URL (`#a-bordo`), então o botão **voltar** do celular fecha o tour em vez de sair da página.

---

## Como fazer deploy (Vercel)

1. Suba o projeto para um repositório Git (GitHub, GitLab ou Bitbucket).
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório. O framework **Next.js** é detectado automaticamente; não é preciso mudar nenhuma configuração de build.
3. (Opcional) Em *Settings → Environment Variables*, defina `NEXT_PUBLIC_SITE_URL` com o domínio final (ex.: `https://tour.uboatt.com.br`). Sem ela, o projeto usa o domínio de produção da Vercel para montar os links absolutos da prévia do link.

Pela linha de comando:

```bash
npx vercel
```

```bash
npx vercel --prod
```

Todas as páginas são estáticas. O protótipo está marcado como `noindex` (fora dos buscadores); remova `robots` em `app/layout.tsx` quando for para produção.

---

## Estrutura

```
app/
  layout.tsx               fonte Inter, metadados, viewport
  page.tsx                 redireciona para /boat-tour
  boat-tour/
    page.tsx               página da experiência
    marzipano/page.tsx     prévia técnica do modo Marzipano
    opengraph-image.tsx    prévia do link compartilhado
components/
  boat-tour/
    BoatTourPage.tsx       composição da página (Server Component)
    BoatTourProvider.tsx   estados: apresentação → preparação → tour → detalhes → CTA
    BoatHero.tsx           primeira tela
    TourPreview.tsx        janela de entrada do tour (leve, sem carregar o Matterport)
    TourViewer.tsx         abstração: mode="matterport" | "marzipano"
    MatterportViewer.tsx   iframe oficial + loading, timeout e erro
    MarzipanoViewer.tsx    panoramas próprios (e prévia técnica sem panoramas)
    TourHotspot.tsx        visual dos hotspots de navegação e de informação
    TourOverlay.tsx        modo imersivo (interface Uboatt ao redor do viewer)
    TourHeader.tsx         logo, Tour 360, Protótipo, tela cheia, Fechar
    TourBottomBar.tsx      Guiado, Detalhes, Livre, Mandar no grupo, Planejar
    TourStartCard.tsx      "Como quer conhecer a lancha?"
    GuidedTour.tsx         tour guiado (TourGuidedMode) com progresso 1 de 4
    GestureHint.tsx        "Arraste para olhar ao redor" (1× por sessão)
    TourLoading.tsx        "Preparando seu embarque..."
    TourError.tsx          "Não conseguimos abrir o tour agora."
    BoatDetailsDrawer.tsx  drawer (desktop) / bottom sheet (mobile)
    BoatMap.tsx            mapa POPA · COCKPIT · CABINE · PROA
    SpacesSection.tsx      mapa + descrição em texto (alternativa ao tour)
    ShareButton.tsx        "Mandar no grupo" (Web Share API / copiar link)
    CTAPlanner.tsx         "Gostou do que viu?" → data + grupo → mandar no grupo
    PrototypeBadge.tsx     selo permanente PROTÓTIPO
    ...                    header, menu mobile, seções e rodapé
  ui/                      Sheet (<dialog> nativo), Toast, botões, Photo, ícone 360
  brand/UboattLogo.tsx     logo (placeholder textual até o arquivo oficial chegar)
data/
  demoBoat.ts              embarcação demonstrativa + cenas futuras
  media.ts                 fotos de ambientação (Unsplash) e créditos
  brand.ts                 caminho do logo oficial
types/
  tour.ts                  BoatScene, TourHotspot, TourTarget, TourMode…
  boat.ts                  Boat, BoatSpace, BoatMapZone, GuidedStep
  marzipano.d.ts           tipagem mínima do Marzipano
lib/                       compartilhamento, URL do Matterport, tela cheia,
                           orientação do celular, sessionStorage, rota #a-bordo
public/
  brand/                   logo e fotos próprias da Uboatt
  boats/                   panoramas de cada embarcação
```

---

## Como substituir o Matterport

**Outro tour Matterport público** — em `data/demoBoat.ts` (ou no arquivo da embarcação), troque o `modelId`:

```ts
tour: {
  matterport: { modelId: "SEU_MODEL_ID", params: { play: 1 } },
},
```

`params` vira parâmetros da URL `https://my.matterport.com/show/?m=…` (ver `lib/matterport.ts`).

**Panoramas próprios (Marzipano)** — mude `tourMode` para `"marzipano"` e preencha `tour.marzipano.scenes` (ver abaixo). O restante da interface (tour guiado, mapa, detalhes, compartilhar, CTA) continua igual; com Marzipano, o tour guiado e os botões do mapa passam a trocar de cena.

**Matterport SDK (futuro)** — só com conta, SDK key e permissão sobre o modelo. O ponto de integração é `MatterportViewer.tsx`: ele já recebe o mesmo `TourTarget` usado pelo Marzipano, com o campo reservado `sweepId` para mover a câmera até um ambiente.

---

## Como adicionar uma embarcação

1. Crie `data/boats/<id>.ts` seguindo o formato de `data/demoBoat.ts`:

```ts
import type { Boat } from "@/types/boat";

export const minhaLancha: Boat = {
  id: "minha-lancha-32",
  name: "Nome da lancha",
  model: "Modelo",
  length: "32 pés",
  capacity: 12,          // null se ainda não estiver no cadastro
  location: "Salvador",  // null se não houver ponto de saída definido
  cover: null,
  tourMode: "marzipano", // ou "matterport"
  isDemo: false,         // esconde os avisos de demonstração
  tour: { marzipano: { scenes: minhaLanchaScenes, initialSceneId: "cockpit" } },
  spaces: [/* Área externa, Cockpit, Cabine, Banheiro, Proa… */],
  mapZones: [/* popa, cockpit, cabine, proa → cada uma com target { sceneId } */],
  guidedSteps: [/* etapas do tour guiado, cada uma com target { sceneId } */],
  detailSpaceIds: ["area-externa", "cockpit", "cabine", "banheiro", "proa"],
};
```

2. Crie a rota, por exemplo `app/embarcacoes/[slug]/page.tsx`, renderizando `<BoatTourPage boat={...} />`.

**Nunca invente especificações.** Capacidade, equipamentos e textos de hotspots devem vir do cadastro de cada embarcação. Os textos atuais são genéricos e marcados como demonstrativos.

---

## Como adicionar panoramas Marzipano

Formato: **JPEG equiretangular 2:1**, por exemplo 8192×4096 ou 6000×3000. Cada ambiente é uma cena.

1. Salve os arquivos em `public/boats/<id-da-embarcacao>/`:

```
public/boats/minha-lancha-32/cockpit.jpg
public/boats/minha-lancha-32/proa.jpg
public/boats/minha-lancha-32/cabine.jpg
public/boats/minha-lancha-32/popa.jpg
```

2. Preencha as cenas:

```ts
{
  id: "cockpit",
  name: "Cockpit",
  panorama: "/boats/minha-lancha-32/cockpit.jpg",
  panoramaWidth: 6000,   // largura real do arquivo
  initialYaw: 0,
  initialPitch: 0,
  hotspots: [/* ver abaixo */],
}
```

3. Veja em `/boat-tour/marzipano` ou mude o `tourMode` da embarcação.

Como o viewer carrega:

- A biblioteca Marzipano só é baixada quando o tour abre em modo Marzipano (import dinâmico).
- Cada cena só é criada quando é visitada. Além da cena atual, é pré-carregada apenas a **próxima cena provável**: o destino do **primeiro** hotspot de navegação da cena. Coloque primeiro o caminho mais comum.
- Recomendações: JPEG progressivo com qualidade ~80, uma miniatura leve por cena (`thumbnail`) e, para panoramas acima de ~8K, gerar **tiles multirresolução** (cubo) com o [Marzipano Tool](https://www.marzipano.net/tool/) e trocar a geometria em `ensureScene` (`MarzipanoViewer.tsx`) por `CubeGeometry` com `ImageUrlSource.fromString(".../{z}/{f}/{y}/{x}.jpg")`.
- Setas do teclado giram o panorama quando ele está em foco.
- **Mover com o celular** aparece só no modo Marzipano, em aparelhos com sensor. A permissão (iOS) é pedida somente depois do toque no botão, nunca automaticamente.

---

## Como adicionar hotspots

Cada cena tem uma lista `hotspots`. Os ângulos estão em **radianos** (convenção Marzipano: `yaw` 0 = frente da cena; `pitch` positivo = abaixo do horizonte).

```ts
hotspots: [
  // Navegação: seta + rótulo, leva para outra cena
  { id: "go-proa", type: "navigation", yaw: 1.2, pitch: -0.1, label: "Ir para a proa", targetScene: "proa" },
  { id: "go-cabine", type: "navigation", yaw: -0.6, pitch: 0.2, label: "Entrar na cabine", targetScene: "cabine" },

  // Informação: "+" que abre um card. O texto vem do cadastro da embarcação.
  { id: "info-som", type: "info", yaw: 0.5, pitch: -0.05, label: "Sistema de som", description: "…" },
],
```

Para descobrir yaw/pitch de um ponto: abra o tour com `?debug=hotspots` na URL (ex.: `/boat-tour/marzipano?debug=hotspots#a-bordo`) e clique no panorama; o console do navegador mostra `yaw` e `pitch` daquele ponto. O Marzipano Tool também exporta esses valores.

Botões do mapa, cards e etapas do tour guiado usam `target: { sceneId, yaw?, pitch? }` para levar direto a um ambiente e a uma direção.

---

## Identidade e imagens

- **Logo:** salve o arquivo em `public/brand/` e preencha `logo` / `logoOnDark` em `data/brand.ts`. Enquanto isso, aparece o placeholder "UBOATT".
- **Fotos:** as fotos de ambientação vêm do Unsplash (licença livre, créditos no rodapé) e são servidas pelo CDN do Unsplash. Para usar fotos próprias, coloque-as em `public/brand/` e troque `src` em `data/media.ts`.
- Cores e animações ficam em `app/globals.css` (`@theme`).

## Acessibilidade e mobile

- Mobile first: barra inferior estilo app, alvos de toque de 44 px ou mais, sem depender de hover.
- Painéis sobre `<dialog>` nativo (foco preso, `Esc`, fundo inerte); no mobile o bottom sheet fecha arrastando para baixo.
- `aria-label` nos botões de ícone, foco visível, contraste AA nos textos e `prefers-reduced-motion` respeitado.
- Alternativa em texto ao tour: seção "A embarcação por escrito", painel de detalhes e um atalho no início do modo imersivo.
- Testado em 375×812, 390×844, 430×932, 768×1024, 1366×768, 1440×900 e 1920×1080, sem rolagem horizontal.

## Limitações conhecidas do protótipo

- Sem SDK, o iframe do Matterport não pode ser controlado: o tour guiado e o mapa só mudam o texto explicativo nesse modo.
- O estado de erro do Matterport é detectado por tempo limite (25 s) e por queda de conexão, já que o iframe é de outra origem.
- O planejamento não envia nem guarda dados; "Ver embarcações disponíveis" abre o site atual da Uboatt.
