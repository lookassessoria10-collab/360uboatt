import { Anchor, Bath, DoorOpen, Info, Navigation, Sun, Users, Waves, type LucideIcon } from "lucide-react";
import type { IconKey } from "@/types/boat";

/** Ícones dos espaços. Os dados guardam só a chave (serializável). */
export const spaceIcons: Record<IconKey, LucideIcon> = {
  sun: Sun,
  users: Users,
  door: DoorOpen,
  bath: Bath,
  bow: Navigation,
  stern: Waves,
  anchor: Anchor,
  info: Info,
};
