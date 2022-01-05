import styles from "./styles.module.scss";
import Loader from "react-spinners/HashLoader";

const HashLoader = () =>
    <div className={styles.loader}>
        <Loader css={`position: inherit;`} size={70} color='#0973d6' />
    </div>

export default HashLoader;