import React, { useEffect, useCallback } from "react";
import { Oval as BtnOval, OvalType } from "../component/button/Button";
import styles from "./bioContent.module.scss";
import Util from "../util/utils";
import $ from "jquery";

export const ProfileImage = (attr) => {
    const elemID = Util.memoizeID();

    const mapScale = (val, minA, maxA, minB, maxB) =>
        ((val - minA) * (maxB - minB)) / (maxA - minA) + minB;

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
    }, []);

    const clearTracking = () => {
        $(document).off("mousemove");
        $(document).off("resize");
    };

    const setImageHeight = () => {
        const width = $(`#${elemID(styles.imageContainer)}`).width();
        $(`#${elemID(styles.circle)}`).css({ height: `${width}px` });
    };

    useEffect(() => {
        trackWindow();
        setImageHeight();
        return clearTracking;
    }, [trackWindow]);

    return (
        <div {...attr}>
            <div id={elemID(styles.imageContainer)} className={styles.imageContainer}>
                <div id={elemID(styles.circle)} className={styles.circle}>
                    <div
                        id={elemID(styles.image)}
                        className={styles.image}
                        style={{
                            backgroundImage:
                                "url(https://s3.envato.com/files/76350124/BlueSpace2_Img)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export const Description = (attr) => {
    const elemID = Util.memoizeID();

    const fullname = "Kevin Luvian H";
    const desc = `
        Linear interpolation as described here is for data points in one spatial
        dimension. For two spatial dimensions, the extension of linear interpolation
        is called bilinear interpolation, and in three dimensions, trilinear interpolation.
    `;

    const setVerticalPadding = () => {
        const wrapperHeight = $("#" + elemID(styles.descwrapper)).height();
        const descriptionHeight = $("#" + elemID(styles.description)).height();
        let paddingTop = (wrapperHeight - descriptionHeight) / 2;
        if (paddingTop < 0) paddingTop = 0;
        $("#" + elemID(styles.description)).css("padding-top", paddingTop + "px");
    };

    useEffect(() => {
        setVerticalPadding();
        $(window).on("resize", setVerticalPadding);
        return $(document).off("resize");
    }, []);

    return (
        <div {...attr}>
            <div id={elemID(styles.descwrapper)} className={styles.descwrapper}>
                <div id={elemID(styles.description)} className={styles.description}>
                    <h1>{fullname}</h1>
                    <p>{desc}</p>
                    <div className={styles.buttons}>
                        <BtnOval type={OvalType.primary} className="mr-4">Download CV</BtnOval>
                        <BtnOval type={OvalType.secondary}>Contact</BtnOval>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const FunCard = (attr) => {
    const title = "Fun Cardo";
    const content = "IP500";
    return (
        <div {...attr}>
            <i className="fa fa-key" />
            <div className="fa fa-key w-50" />
            <h1>{title}</h1>
            <p>{content}</p>
        </div>
    )
}