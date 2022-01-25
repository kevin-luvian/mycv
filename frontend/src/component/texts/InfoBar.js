import { concat } from "../../util/utils";
import styles from "./styles.module.scss";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";

export const Tips = ({ className, children, ...props }) => (
  <div className={concat(className, styles.infobar)} {...props}>
    <div className={styles.verticalbar} />
    <div className="col my-auto py-3">
      <div className={styles.icon}>
        <EmojiObjectsIcon />
      </div>
    </div>
    <div className="w-100 my-auto py-3">
      <p className={concat(styles.text)} children={children} />
    </div>
  </div>
);
