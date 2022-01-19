import styles from "./styles.module.scss";

export const ParserWrapper = ({ children, ...props }) => (
  <div className={styles.parserWrapper} {...props}>
    {children}
  </div>
);


export const ParserError = ({ children, ...props }) => (
  <div className={styles.parserError} {...props}>
    {children}
  </div>
);