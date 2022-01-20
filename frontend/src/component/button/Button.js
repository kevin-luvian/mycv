import styles from "./button.module.scss";
import { concat } from "../../util/utils";

export const Basic = {
  Default: ({ className, ...attr }) => (
    <BasicElement
      {...attr}
      className={concat(className, styles.colorDefault)}
    />
  ),
  Warning: ({ className, ...attr }) => (
    <BasicElement
      {...attr}
      className={concat(className, styles.colorWarning)}
    />
  ),
  Danger: ({ className, ...attr }) => (
    <BasicElement {...attr} className={concat(className, styles.colorDanger)} />
  ),
};

export function BasicElement({ className, children, loading, ...attr }) {
  return (
    <button
      {...attr}
      className={concat(
        styles.button,
        loading ? styles.loading : "",
        className
      )}
      disabled={loading}
    >
      <div className={styles.content}> {children} </div>
    </button>
  );
}

export const Oval = {
  Default: ({ className, ...attr }) => (
    <OvalElement {...attr} className={concat(className, styles.colorDefault)} />
  ),
  Secondary: ({ className, ...attr }) => (
    <OvalElement {...attr} className={concat(className, styles.colorDark)} />
  ),
  Dark: ({ className, ...attr }) => (
    <OvalElement {...attr} className={concat(className, styles.colorDark)} />
  ),
  Danger: ({ className, ...attr }) => (
    <OvalElement {...attr} className={concat(className, styles.colorDanger)} />
  ),
};

const OvalElement = ({ className, children, ...attr }) => (
  <button {...attr} className={concat(styles.button, styles.oval, className)}>
    {children}
  </button>
);

export default Basic.Default;
