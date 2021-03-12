import styles from "./styles.module.scss";

const BorderlessCard = ({ className, ...attr }) => {
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

export default BorderlessCard;