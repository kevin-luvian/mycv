import styles from "./styles.module.scss";
import { Fragment, useCallback, useRef } from "react";
import { concat } from "../../util/utils";
import { Oval as BtnOval } from "../button/Button";
import { ImageCarousel } from "../carousel/Carousel";
import { icons, iconColors, ColoredIcon } from "../decoration/Icons";
import { SimpleValidation } from "../modal/Modal";
import { parse } from "../../util/htmlParser";

export const BlankCard = ({ active, className, children, ...attr }) => (
  <div
    {...attr}
    className={concat(className, styles.blankCard, active && styles.active)}
  >
    {children}
  </div>
);

export const DirectoryCard = ({
  title,
  imgUrls = [],
  description,
  className,
  children,
  readMore,
}) => {
  const parsedContent = useCallback(() => parse(description), [description]);

  return (
    <BlankCard className={concat(className, "p-3")}>
      {children}
      <h1>{title}</h1>

      <ImageCarousel className="mb-3" urls={imgUrls} />
      <p>{parsedContent()}</p>
      <div className="d-flex mt-3 justify-content-end">
        <BtnOval.Default style={{ padding: ".3rem .7rem" }} onClick={readMore}>
          read more
        </BtnOval.Default>
      </div>
    </BlankCard>
  );
};

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
            onClick={onEdit}
          />
          <ColoredIcon
            icon={icons.delete}
            color={iconColors.danger}
            onClick={() => deleteModalRef.current.open()}
          />
        </div>
      </DirectoryCard>
    </Fragment>
  );
};
export default BlankCard;
