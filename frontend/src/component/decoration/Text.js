import { concat } from "../../util/utils";
import styles from "./styles.module.scss";

export const UnderlinedTitle = ({ text, className, ...attr }) =>
    <div className={concat(className, styles.underlinedTitle)} {...attr}>
        <p>{text}</p>
        <div className={styles.line}>
            <div />
            <div />
        </div>
    </div>

export const Banner = ({ title, className, ...attr }) =>
    <div className={concat(className, styles.banner)} {...attr}>
        <h1>{title}</h1>
    </div>