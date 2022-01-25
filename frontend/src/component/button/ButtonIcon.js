import { concat } from "../../util/utils";
import styles from "./button-icon.module.scss";

export const ButtonIcon = ({ className, children, ...attrs }) => {
  return (
    <button {...attrs} className={concat(styles.button, className)}>
      {children}
    </button>
  );
};
