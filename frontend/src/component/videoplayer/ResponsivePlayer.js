import styles from "./styles.module.scss";
import ReactPlayer from 'react-player';
import { concat } from "../../util/utils";

const ResponsivePlayer = ({ source = "", className }) => (
  <div className={concat(styles.wrapper, className)}>
    <ReactPlayer
      className={styles.player}
      url={source}
      controls
      width='100%'
      height='100%'
    />
  </div>
)

export default ResponsivePlayer;