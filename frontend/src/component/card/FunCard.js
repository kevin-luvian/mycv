import styles from "./styles.module.scss";
import { concat } from "../../util/utils";

const emptyStr = "[ empty ]";

export const FunCard = ({ className, icon, title, description, editComponent, ...attr }) =>
    <div className={`${concat(styles.fadeAnim, className)} col-12 col-sm-6 col-md-4 col-lg-3`} {...attr}>
        <div className={styles.funcard}>
            <i className={`fa ${icon ?? emptyStr}`} />
            {editComponent}
            <h2>{title ?? emptyStr}</h2>
            <h1>{description ?? emptyStr}</h1>
        </div>
    </div>

export const FunCardBorderless = ({ className, icon, title, description, editComponent, ...attr }) =>
    <div className={`${concat(styles.fadeAnim, className)} col-12 col-sm-6 col-lg-4 mb-4`} {...attr}>
        <div className={styles.borderlessCard}>
            <i className={`fa ${icon ?? emptyStr}`} />
            <div className={styles.content}>
                {editComponent}
                <h2>{title ?? emptyStr}</h2>
                <p>{description ?? emptyStr}</p>
            </div>
        </div>
    </div>