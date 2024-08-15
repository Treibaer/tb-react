export interface Project {
  id: number;
  title: string;
  description: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  state: "open" | "inProgress" | "done";
  projectId: number;
}

export interface ScryfallCard {
  id: string;
  name: string;
  type_line: string;
  oracle_text: string;
  mana_cost: string;
  cmc: number;
  colors: string[];
  color_identity: string[];
  set: string;
  rarity: string;
  image_uris: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  prices: {
    usd: string;
    usd_foil: string;
    eur: string;
    tix: string;
  };
}
