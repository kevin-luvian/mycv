import { concat } from "../../util/utils";
import styles from "./styles.module.scss";

export const TitleBreak = ({ title, className, ...attr }) =>
    <div className={concat(className, styles.tileBreak)} {...attr}>
        <h1>{title}</h1>
        <div className={styles.lines}>
            <div className={styles.secondary} />
            <div className={styles.primary} />
        </div>
    </div>

export const Divider = ({ className, orientation }) => {
    return (
        <div className={concat(className, styles.divider)} />
    )
}