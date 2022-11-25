import React, { Fragment, useCallback, useRef } from "react";
import { concat } from "../../util/utils";
import { Basic, Oval as BtnOval } from "../button/Button";
import { ImageCarousel } from "../carousel/Carousel";
import { icons, iconColors, ColoredIcon, TextIcon } from "../decoration/Icons";
import { SimpleValidation } from "../modal/Modal";
import { parse } from "../../util/htmlParser";
import { Link } from "react-router-dom";
import { useWindowSize } from "../../util/hooks";
import styles from "./styles.module.scss";
import BlankCard from "./BlankCard";

/**
 * @param {{
 * projects: any[]
 * render: (project, i:number) => ReactElement
 * }} param0
 */
export const DirectoriesCard = ({ projects, render }) => {
  const screen = useWindowSize();

  const splitProjects = useCallback(() => {
    if (screen.desktop) {
      return [
        projects.filter((_, i) => i % 2 == 0),
        projects.filter((_, i) => i % 2 != 0),
      ];
    }
    return [projects];
  }, [projects, screen]);

  return splitProjects().map((batch, bIndex) => (
    <div key={bIndex} className={styles.directories}>
      {batch.map((p, i) => (
        <div key={i} className={styles.directory}>
          {render(p)}
        </div>
      ))}
    </div>
  ));
};

export const DirectoryCard = ({
  title,
  imgUrls = [],
  description,
  className,
  children,
  readMoreURL = "#",
}) => {
  const parsedContent = useCallback(() => parse(description), [description]);

  return (
    <BlankCard className={concat(className, "p-3")}>
      {children}
      <h1 style={{ wordWrap: "break-word" }}>{title}</h1>

      <ImageCarousel className="mb-3" urls={imgUrls} />
      {parsedContent()}
      <div className="d-flex mt-3 justify-content-end">
        <Link to={readMoreURL}>
          <BtnOval.Default style={{ padding: ".3rem .7rem" }}>
            read more
          </BtnOval.Default>
        </Link>
      </div>
    </BlankCard>
  );
};

export const EditDirectoryCard = ({
  id,
  order,
  onEdit,
  onDelete,
  ...props
}) => {
  const deleteModalRef = useRef();

  return (
    <Fragment>
      <SimpleValidation ref={deleteModalRef} onContinue={onDelete} />
      <DirectoryCard {...props}>
        <div className="d-flex justify-content-end">
          <TextIcon>{order}</TextIcon>
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

export default DirectoriesCard;
