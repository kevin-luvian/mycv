import styles from "./styles.module.scss";
import { useRef } from 'react';
import { concat } from "../../util/utils";
import { icons, iconColors, ColoredIcon } from "../decoration/Icons";
import { SimpleValidation } from "../modal/Modal";

export const SkillCard = ({ className, skill, children }) => {
    const percentage = num => num * 100;
    return (
        <div className={concat(className, styles.skillcard)}>
            <div className={styles.title}>
                <h1>{skill.title}</h1>
                {children}
                <p>{percentage(skill.level)}%</p>
            </div>
            <div className={styles.percentage}>
                <div style={{ width: percentage(skill.level) + "%" }} />
            </div>
        </div>
    )
}

export const EditSkillCard = ({ onDelete, onEdit, skill, ...props }) => {
    const deleteModalRef = useRef();
    return (
        <SkillCard skill={skill} {...props}>
            <SimpleValidation ref={deleteModalRef} onContinue={() => onDelete(skill._id)} />
            <div className="ml-2 d-inline-block">
                <ColoredIcon
                    icon={icons.edit}
                    color={iconColors.warning}
                    onClick={() => onEdit(skill._id)} />
                <ColoredIcon
                    icon={icons.delete}
                    color={iconColors.danger}
                    onClick={() => deleteModalRef.current.open()} />
            </div>
        </SkillCard>
    )
}