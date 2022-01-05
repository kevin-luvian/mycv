import styles from "./styles.module.scss";
import Loader from "react-spinners/HashLoader";
import { Fragment } from "react";

const HashLoader = ({ loading }) => {
    if (loading) return (
        <div className={styles.loader}>
            <Loader css={`position: inherit;`} size={70} color='#0973d6' />
        </div>
    )
    return <Fragment />
}

export default HashLoader;