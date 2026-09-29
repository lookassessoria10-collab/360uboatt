/**
 * Identidade Uboatt.
 *
 * Arquivos gerados a partir do logo oficial (https://uboatt.com.br/image/logo.png):
 * - uboatt-logo.png          logo completo, para fundos claros
 * - uboatt-logo-branco.png   logo completo, para fundos escuros (azul-marinho → branco)
 * - uboatt-simbolo*.png      só o símbolo, para espaços estreitos
 * Para trocar, substitua os arquivos em `public/brand/` mantendo as proporções
 * ou ajuste largura/altura abaixo.
 */
export const brand = {
  name: "Uboatt",
  siteUrl: "https://uboatt.com.br/pt",
  logo: {
    dark: { src: "/brand/uboatt-logo.png", width: 640, height: 182 },
    light: { src: "/brand/uboatt-logo-branco.png", width: 640, height: 182 },
  },
  symbol: {
    dark: { src: "/brand/uboatt-simbolo.png", width: 290, height: 192 },
    light: { src: "/brand/uboatt-simbolo-branco.png", width: 290, height: 192 },
  },
};
