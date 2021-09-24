import styles from "./styles.module.scss";
import { Fragment, useRef } from 'react';
import { concat } from "../../util/utils";
import { Oval as BtnOval } from "../button/Button";
import { ImageCarousel } from "../carousel/Carousel";
import { icons, iconColors, ColoredIcon } from "../decoration/Icons";
import { SimpleValidation } from "../modal/Modal";
import { Get, Post, Delete, Put } from "../../axios/Axios";

export const BlankCard = ({ active, className, children, ...attr }) =>
    <div {...attr} className={concat(className, styles.blankCard, active && styles.active)}>
        {children}
    </div>

export const DirectoryCard = ({ title, imgUrls = [], description, className, children, readMore }) =>
    <BlankCard className={concat(className, "p-3")}>
        {children}
        <h1>{title}</h1>

        <ImageCarousel className="mb-3" urls={imgUrls} />
        <p>{description}</p>
        <div className="d-flex justify-content-end">
            <BtnOval.Default
                style={{ padding: ".3rem .7rem" }}
                onClick={readMore}>
                read more
            </BtnOval.Default>
        </div>
    </BlankCard>

export const EditDirectoryCard = ({ id, onEdit, onDelete, ...props }) => {

    const deleteModalRef = useRef();

    return (
        <Fragment>
            <SimpleValidation ref={deleteModalRef} onContinue={onDelete} />
            <DirectoryCard {...props}>
                <div className="d-flex justify-content-end">
                    <ColoredIcon
                        icon={icons.edit}
                        color={iconColors.warning}
                        onClick={onEdit} />
                    <ColoredIcon
                        icon={icons.delete}
                        color={iconColors.danger}
                        onClick={() => deleteModalRef.current.open()} />
                </div>
            </DirectoryCard>
        </Fragment>
    )
}
export default BlankCard;