import { concat } from "../../util/utils";
import styles from "./styles.module.scss";

export const Heading = ({ className, children, ...attr }) =>
    <h2
        {...attr}
        className={concat(className, styles.heading)}
        children={children}
    />