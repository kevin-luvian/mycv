import { concat } from "../../util/utils";
import styles from "./styles.module.scss";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight as ccolor } from "react-syntax-highlighter/dist/esm/styles/prism";

export const PreCodeHighlight = ({
  label = "",
  className = "",
  children = "",
  language = "javascript",
  ...props
}) => (
  <div className={concat(styles.precode, className)} {...props}>
    <div className={styles.labelClear}>
      <div className={styles.label}>
        <p>{label}</p>
      </div>
    </div>
    <SyntaxHighlighter
      className={styles.codeblock}
      language={`${language}`}
      style={ccolor}
    >
      {`${children}`}
    </SyntaxHighlighter>
  </div>
);
