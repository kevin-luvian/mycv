import { concat } from "../../util/utils";
import styles from "./styles.module.scss";

export const PreCode = ({ label, className, children, ...props }) => (
  <div className={concat(styles.precode, className)} {...props}>
    <div className={styles.labelClear}>
      <div className={styles.label}>
        <p>{label}</p>
      </div>
    </div>
    <pre className={styles.codeblock}>
      <code>{children}</code>
    </pre>
  </div>
);
