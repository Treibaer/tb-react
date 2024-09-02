export interface Status {
  id: number;
  title: string;
  host: string;
  port: number;
  up: boolean;
  type: "development" | "production" | "portfolio";
}
