import styles from "./styles.module.scss";
import { useState } from "react";
import { concat } from "../../util/utils";

export const ImageCarousel = ({ urls }) => {
    const [currTarget, setCurrTarget] = useState(0);

    const changeTarget = index => {
        if (index < 0) index = (urls.length ?? 1) - 1;
        else if (index >= urls.length) index = 0;
        setCurrTarget(index);
    }
    const isTarget = index => index === currTarget ? styles.target : "";

    return (
        <div className={styles.imageCarousel}>
            <div className={styles.buttons}>
                <div className={styles.prev} onClick={() => changeTarget(currTarget - 1)}>
                    <i className="fa fa-caret-left" />
                </div>
                <div className={styles.next} onClick={() => changeTarget(currTarget + 1)}>
                    <i className="fa fa-caret-right" />
                </div>
            </div>

            <div className={styles.carousel}>
                {urls.map((url, index) =>
                    <div className={concat(styles.imageBlock, styles.slideIn, isTarget(index))}>
                        <img key={index} src={url} alt="carousel" />
                    </div>
                )}
            </div>

            <div className={styles.navigations}>
                <div className={styles.container}>
                    {urls.map((_, index) =>
                        <div className={concat(styles.circle, isTarget(index))}
                            onClick={() => changeTarget(index)} />
                    )}
                </div>
            </div>
        </div>
    );
}