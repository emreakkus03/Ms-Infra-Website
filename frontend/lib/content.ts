type SectionBase = { id: number; sort_order: number };
type TextContent = { title: string | null; content: string | null };
export type ContentSection = SectionBase & (
  | ({ type: "title_text" } & TextContent)
  | ({ type: "image_text"; image: string | null; image_position: "left" | "right" } & TextContent)
  | { type: "rich_text"; content: string | null }
  | ({ type: "bullet_list"; items: string[] } & TextContent)
  | { type: "gallery"; title: string | null; caption: string | null; images: { url: string | null }[] }
  | ({ type: "cta"; button_text: string | null; button_url: string | null } & TextContent)
);
