import styles from "./styles.module.scss";
import { useState } from "react";
import { concat, fileExtFromURL } from "../../util/utils";
import CustomPlayer from "../videoplayer/CustomPlayer";

export const ImageCarousel = ({ urls = [], className, height = "20rem" }) => {
  const [currTarget, setCurrTarget] = useState(0);

  const changeTarget = (index) => {
    if (index < 0) index = (urls.length ?? 1) - 1;
    else if (index >= urls.length) index = 0;
    setCurrTarget(index);
  };
  const isTarget = (index) => (index === currTarget ? styles.target : "");

  if (urls.length == 0) {
    return <div></div>;
  }

  return (
    <div className={concat(styles.imageCarousel, className)}>
      <div className={styles.buttons}>
        <div
          className={styles.prev}
          onClick={() => changeTarget(currTarget - 1)}
        >
          <div className={styles.btnIconContainer}>
            <i className="fa fa-caret-left" />
          </div>
        </div>
        <div
          className={styles.next}
          onClick={() => changeTarget(currTarget + 1)}
        >
          <div className={styles.btnIconContainer}>
            <i className="fa fa-caret-right" />
          </div>
        </div>
      </div>

      <div className={styles.carousel} style={{ height: height }}>
        {urls.map((url, index) => {
          const ext = fileExtFromURL(url).toLowerCase();
          let fElem = <img src={url} alt="carousel" />;
          switch (ext) {
            case ".mp4":
              fElem = <CustomPlayer source={url} height="100%" />;
              break;
          }
          return (
            <div
              key={index}
              className={concat(
                styles.imageBlock,
                styles.slideIn,
                isTarget(index)
              )}
            >
              <div className={styles.elem}>{fElem}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.navigations}>
        <div
          className={concat(styles.container, "d-flex justify-content-center")}
        >
          {urls.map((_, index) => (
            <div
              key={index}
              className={concat(styles.circle, isTarget(index))}
              onClick={() => changeTarget(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
