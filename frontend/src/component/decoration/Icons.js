import {
    CheckBoxOutlineBlank,
    FolderOpenOutlined,
    FilterList,
    ExpandMore,
    GetApp,
    Search,
    Delete,
    Close,
    Edit,
    Info,
    Add,
} from '@material-ui/icons';
import styles from "./styles.module.scss";
import { concat } from "../../util/utils";

export const icons = {
    add: Add,
    info: Info,
    edit: Edit,
    close: Close,
    delete: Delete,
    search: Search,
    download: GetApp,
    filter: FilterList,
    arrowDown: ExpandMore,
    blank: CheckBoxOutlineBlank,
    folderSharp: FolderOpenOutlined,
}

export const iconColors = {
    primary: styles.colorPrimary,
    success: styles.colorSuccess,
    warning: styles.colorWarning,
    danger: styles.colorDanger,
    default: styles.colorDefault
}

export const ColoredIcon = ({ className, color, onClick, icon: Component, ...attr }) => {
    if (!Component) Component = icons.blank;
    if (!color) color = iconColors.default;
    return <Component className={concat(className, styles.icon, color)} onClick={onClick} {...attr} />
}