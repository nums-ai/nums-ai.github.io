import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./careers.module.css";

export default function JobDescription({ body }: { body: string }) {
  return (
    <div className={styles.jobDescription}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          // The page title is h1 and each position title is h2.
          h1: ({ children }) => <h3>{children}</h3>,
          h2: ({ children }) => <h3>{children}</h3>,
          h3: ({ children }) => <h4>{children}</h4>,
          h4: ({ children }) => <h5>{children}</h5>,
          h5: ({ children }) => <h6>{children}</h6>,
          ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
          table: ({ children }) => <div className={styles.tableScroll}><table>{children}</table></div>,
        }}
      >
        {body}
      </Markdown>
    </div>
  );
}
