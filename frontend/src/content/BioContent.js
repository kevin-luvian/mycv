import React, { useEffect, useCallback } from "react";
import { Oval as BtnOval } from "../component/button/Button";
import styles from "./bioContent.module.scss";
import { getFilenameFromURL, memoizeID } from "../util/utils";
import $ from "jquery";
import { Link } from "react-router-dom";

export const ProfileImage = ({ imageURL, ...attr }) => {
  const elemID = memoizeID();

  const mapScale = (val, minA, maxA, minB, maxB) =>
    ((val - minA) * (maxB - minB)) / (maxA - minA) + minB;

  const setImageHeight = useCallback(() => {
    const width = $(`#${elemID(styles.imageContainer)}`).width();
    $(`#${elemID(styles.circle)}`).css({ height: `${width}px` });
  }, [elemID]);

  const trackWindow = useCallback(() => {
    const width = $(document).width();
    const height = $(document).height();
    const image = $(`#${elemID(styles.image)}`);
    $(document).on("mousemove", (event) => {
      image.css(
        "background-position",
        `calc(50% + ${mapScale(event.pageX, 0, width, 0.8, -0.8)}rem)
                 calc(50% + ${mapScale(event.pageY, 0, height, 0.5, -0.5)}rem)`
      );
    });
    $(window).on("resize", setImageHeight);
  }, [elemID, setImageHeight]);

  const clearTracking = () => {
    $(document).off("mousemove");
    $(document).off("resize");
  };

  useEffect(() => {
    trackWindow();
    setImageHeight();
    return clearTracking;
  }, [trackWindow, setImageHeight]);

  return (
    <div {...attr}>
      <div id={elemID(styles.imageContainer)} className={styles.imageContainer}>
        <div id={elemID(styles.circle)} className={styles.circle}>
          <div
            id={elemID(styles.image)}
            className={styles.image}
            style={{
              backgroundImage: `url(${imageURL})`,
              backgroundPosition: "50% 50%",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const Description = ({ fullname, description, cvURL, ...attr }) => {
  const elemID = memoizeID();

  useEffect(() => {
    const setVerticalPadding = () => {
      const wrapperHeight = $("#" + elemID(styles.descwrapper)).height();
      const descriptionHeight = $("#" + elemID(styles.description)).height();
      let paddingTop = (wrapperHeight - descriptionHeight) / 2;
      if (paddingTop < 0) paddingTop = 0;
      $("#" + elemID(styles.description)).css("padding-top", paddingTop + "px");
    };

    setVerticalPadding();
    $(window).on("resize", setVerticalPadding);
    return $(document).off("resize");
  }, [elemID]);

  return (
    <div {...attr}>
      <div id={elemID(styles.descwrapper)} className={styles.descwrapper}>
        <div id={elemID(styles.description)} className={styles.description}>
          <h1>{fullname}</h1>
          <p>{description}</p>
          <div className={styles.buttons}>
            <a href={cvURL} download target="_blank">
              <BtnOval.Default className="mr-4">Download CV</BtnOval.Default>
            </a>
            <Link to="/contact">
              <BtnOval.Secondary>Contact</BtnOval.Secondary>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
