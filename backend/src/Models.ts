export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
}

export interface Ticket {
  id: number;
  projectId: number;
  ticketId: number;
  title: string;
  description: string;
  status: "open" | "inProgress" | "done";
  creator: number | null;
  assignee: number | null;
  createdAt: number;
  updatedAt: number;
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
