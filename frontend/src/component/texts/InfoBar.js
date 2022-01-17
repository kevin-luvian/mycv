import { concat } from "../../util/utils";
import styles from "./styles.module.scss";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";

export const Tips = ({ className, children, ...props }) => (
  <div className={concat(className, styles.infobar)} {...props}>
    <div className={styles.verticalbar} />
    <div className="col my-auto">
      <div className={styles.icon}>
        <EmojiObjectsIcon />
      </div>
    </div>
    <p className="pr-4 pl-2 py-3" children={children} />
  </div>
);
