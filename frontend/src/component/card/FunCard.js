import styles from "./styles.module.scss";
import { useRef } from "react";
import { concat } from "../../util/utils";
import { icons, iconColors, ColoredIcon } from "../decoration/Icons";
import { SimpleValidation } from "../modal/Modal";


const emptyStr = "[ empty ]";

export const FunCard = ({ className, icon, title, description, children, ...attr }) =>
    <div className={`${concat(styles.fadeAnim, className)} col-12 col-sm-6 col-md-4 col-lg-3`} {...attr}>
        <div className={styles.funcard}>
            <i className={`fa ${icon ?? emptyStr}`} />
            {children}
            <h2>{title ?? emptyStr}</h2>
            <h1>{description ?? emptyStr}</h1>
        </div>
    </div>

export const EditFunCard = ({ onUpdate, onDelete, ...attr }) =>
    <FunCard {...attr}>
        <div className="mt-2">
            <ColoredIcon
                icon={icons.edit}
                color={iconColors.warning}
                onClick={onUpdate} />
            <ColoredIcon
                icon={icons.delete}
                color={iconColors.danger}
                onClick={onDelete} />
        </div>
    </FunCard>

export const FunCardBorderless = ({ className, icon, title, description, children, ...attr }) =>
    <div className={`${concat(styles.fadeAnim, className)} col-12 col-sm-6 col-lg-4 mb-4`} {...attr}>
        <div className={styles.borderlessCard}>
            <i className={`fa ${icon ?? emptyStr}`} />
            <div className={styles.content}>
                {children}
                <h2>{title ?? emptyStr}</h2>
                <p>{description ?? emptyStr}</p>
            </div>
        </div>
    </div>

export const EditFunCardBorderless = ({ onUpdate, onDelete, ...attr }) => {
    const deleteModalRef = useRef();

    return (
        <FunCardBorderless {...attr}>
            <SimpleValidation ref={deleteModalRef} onContinue={onDelete} />
            <div className="mt-2">
                <ColoredIcon
                    icon={icons.edit}
                    color={iconColors.warning}
                    onClick={onUpdate} />
                <ColoredIcon
                    icon={icons.delete}
                    color={iconColors.danger}
                    onClick={() => deleteModalRef.current.open()} />
            </div>
        </FunCardBorderless>
    )
}