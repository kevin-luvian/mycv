import {
    CheckBoxOutlineBlank,
    FilterList,
    ExpandMore,
    GetApp,
    Search,
    Delete,
    Close,
    Edit,
} from '@material-ui/icons';
import styles from "./styles.module.scss";
import { concat } from "../../util/utils";

export const icons = {
    edit: Edit,
    close: Close,
    delete: Delete,
    search: Search,
    download: GetApp,
    filter: FilterList,
    arrowDown: ExpandMore,
    blank: CheckBoxOutlineBlank,
}

export const iconColors = {
    primary: styles.colorPrimary,
    success: styles.colorSuccess,
    warning: styles.colorWarning,
    danger: styles.colorDanger,
    default: styles.colorDefault
}

export const ColoredIcon = ({ className, tip, color, onClick, icon: Component }) => {
    if (!Component) Component = icons.blank;
    if (!color) color = iconColors.default;
    return <Component className={concat(className, styles.icon, color)} onClick={onClick} />
}