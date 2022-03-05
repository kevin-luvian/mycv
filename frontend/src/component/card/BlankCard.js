import styles from "./styles.module.scss";
import { concat } from "../../util/utils";

export const BlankCard = ({ active, className, children, ...attr }) => (
  <div
    {...attr}
    className={concat(className, styles.blankCard, active ? styles.active : "")}
  >
    {children}
  </div>
);

export default BlankCard;
