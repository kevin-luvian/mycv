import Util from "../../util/utils";
import styles from "./styles.module.scss";

export const TitleBreak = ({ title, className, ...attr }) =>
    <div className={Util.concat(className, styles.tileBreak)} {...attr}>
        <h1>{title}</h1>
        <div className={styles.lines}>
            <div className={styles.secondary} />
            <div className={styles.primary} />
        </div>
    </div>

export const Banner = ({ title, className, ...attr }) => {
    return (
        <div className={Util.concat(className, styles.banner)} {...attr}>
            <h1>BANNER</h1>
            <h1>{title}</h1>
        </div>
    )
}