import type { MediaImage } from "@/types/boat";

/**
 * Fotografias de ambientação (licença Unsplash, uso livre).
 * Nenhuma imagem vem do Matterport.
 *
 * Para usar fotos próprias da Uboatt, coloque os arquivos em `public/brand/`
 * e troque `src` por um caminho local, ex.: "/brand/baia-de-todos-os-santos.jpg".
 */
export const media = {
  bay: {
    src: "https://images.unsplash.com/photo-1766946441214-f46356c09fd1",
    alt: "Vista aérea do Forte São Marcelo cercado por barcos na Baía de Todos os Santos, em Salvador",
    width: 8064,
    height: 6048,
    credit: { name: "Ian Felix", url: "https://unsplash.com/photos/-PsJp0tzqcs" },
  },
  sunset: {
    src: "https://images.unsplash.com/photo-1646494835208-ba788b9a3ed5",
    alt: "Pôr do sol no Farol da Barra, em Salvador",
    width: 3524,
    height: 3524,
    credit: { name: "Edson Junior", url: "https://unsplash.com/photos/2o05Oktqsss" },
  },
  friends: {
    src: "https://images.unsplash.com/photo-1519801584609-8ee5f072eddd",
    alt: "Grupo de amigos sentado na proa de uma embarcação, olhando o mar",
    width: 4834,
    height: 3223,
    credit: { name: "Luke Bender", url: "https://unsplash.com/photos/h_YjxPtkRHA" },
  },
  pointing: {
    src: "https://images.unsplash.com/photo-1775326667922-7aaab4148721",
    alt: "Duas amigas apontando para o mar a bordo de uma lancha",
    width: 5464,
    height: 8192,
    credit: { name: "Will Haddock", url: "https://unsplash.com/photos/OEZp9nbHw5o" },
  },
} satisfies Record<string, MediaImage>;

export const mediaCredits = Object.values(media);
