import React, { useEffect, useCallback } from 'react';
import { Oval as BtnOval, OvalType } from "../component/button/Button";
import $ from "jquery";
import styles from "./bio.module.scss";

export const ProfileImage = ({ id, className }) => {

    const trackWindow = useCallback(() => {
        const width = $(document).width();
        const height = $(document).height();
        $(document).on("mousemove", event => {
            $(`#${styles.image}`).css(
                "background-position",
                `calc(50% + ${mapScale(event.pageX, 0, width, 0.8, -0.8)}rem)
                 calc(50% + ${mapScale(event.pageY, 0, height, 0.5, -0.5)}rem)`
            );
        });
        $(window).on("resize", () => {
            setImageHeight();
        });
    }, []);

    useEffect(() => {
        trackWindow();
        return clearTracking;
    }, [trackWindow]);
    
    useEffect(() => { setImageHeight(); });

    const mapScale = (val, minA, maxA, minB, maxB) =>
        (val - minA) * (maxB - minB) / (maxA - minA) + minB;

    const clearTracking = () => {
        $(document).off("mousemove");
        $(document).off("resize");
    }

    const setImageHeight = () => {
        const width = $(`#${styles.imageContainer}`).width();
        $(`#${styles.circle}`).css({ 'height': `${width}px` });
    }

    return (
        <div id={id} className={className}>
            <div id={styles.imageContainer}>
                <div id={styles.circle}>
                    <div id={styles.image}
                        style={{
                            backgroundImage: "url(https://s3.envato.com/files/76350124/BlueSpace2_Img)"
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export const Description = ({ id, className }) => {
    const fullname = "Kevin Luvian H";
    const desc = `
        Linear interpolation as described here is for data points in one spatial
        dimension. For two spatial dimensions, the extension of linear interpolation
        is called bilinear interpolation, and in three dimensions, trilinear interpolation.
    `;
    return (
        <div id={id} className={className}>
            <div id={styles.description}>
                <h1>{fullname}</h1>
                <p>{desc}</p>
                <div className={styles.buttons}>
                    <BtnOval className="mr-4">Download CV</BtnOval>
                    <BtnOval type={OvalType.secondary}>Contact</BtnOval>
                </div>
            </div>
        </div>
    );
}