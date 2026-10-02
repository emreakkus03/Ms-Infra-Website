import "server-only";
import styles from "./rich-text.module.css";

/** HTML comes exclusively from Laravel's sanitized RichContentRenderer, never from URL/client input. */
export default function RichText({ html }: { html: string | null }) {
  if (!html) return null;
  return <div className={styles.content} dangerouslySetInnerHTML={{ __html: html }} />;
}
