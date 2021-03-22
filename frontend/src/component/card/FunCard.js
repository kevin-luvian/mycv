import styles from "./styles.module.scss";

export const FunCard = ({ className, ...attr }) => {
    const icon = "fa-key";
    const title = "Fun Cardo";
    const content = "IP500";
    return (
        <div className={`${className} col-12 col-sm-6 col-md-4 col-lg-3`} {...attr}>
            <div className={styles.funcard}>
                <i className={`fa ${icon}`} />
                <h2>{title}</h2>
                <h1>{content}</h1>
            </div>
        </div>
    )
}

export const FunCardBorderless = ({ className, ...attr }) => {
    const icon = "fa-key";
    const title = "Buying Stuff";
    const content = "capitalism";
    return (
        <div className={`${className} col-12 col-sm-6 col-lg-4 mb-4`} {...attr}>
            <div className={styles.borderlessCard}>
                <i className={`fa ${icon}`} />
                <div className={styles.content}>
                    <h2>{title}</h2>
                    <p>{content}</p>
                </div>
            </div>
        </div>
    )
}