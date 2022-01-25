import { concat } from "../../util/utils";
import styles from "./styles.module.scss";

const Page = ({ className, style, children }) => (
  <div
    style={style}
    className={concat(className, styles.content, "col-12 col-md-10 mx-auto")}
  >
    {children}
  </div>
);

export default Page;
