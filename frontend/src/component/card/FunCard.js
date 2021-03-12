import styles from "./styles.module.scss";

const FunCard = ({ className, ...attr }) => {
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

export default FunCard;