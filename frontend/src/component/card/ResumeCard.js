import styles from "./styles.module.scss";
import { useRef } from 'react';
import { concat } from "../../util/utils";
import { icons, iconColors, ColoredIcon } from "../decoration/Icons";
import { SimpleValidation } from "../modal/Modal";

export const ResumeCard = ({ className, resume, children }) => {
    return (
        <div className={concat(className, styles.resumecard)}>
            <div>
                <h5 className={styles.date}>{resume.date}</h5>
                <span className={styles.place}>{resume.place}</span>
                {children}
            </div>
            <h4 className={styles.title}>{resume.title}</h4>
            <div className={styles.description}>
                {resume.description}
            </div>
        </div>
    )
}

export const EditResumeCard = ({ onDelete, onEdit, resume, ...props }) => {
    const deleteModalRef = useRef();
    return (
        <ResumeCard resume={resume} {...props}>
            <SimpleValidation ref={deleteModalRef} onContinue={() => onDelete(resume._id)} />
            <div className="ml-2 d-inline-block">
                <ColoredIcon
                    icon={icons.edit}
                    color={iconColors.warning}
                    onClick={() => onEdit(resume._id)} />
                <ColoredIcon
                    icon={icons.delete}
                    color={iconColors.danger}
                    onClick={() => deleteModalRef.current.open()} />
            </div>
        </ResumeCard>
    )
}