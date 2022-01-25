import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { badStringID } from "../../util/utils";
import $ from "jquery";

const elemID = (() => {
    const constant = badStringID();
    return (astr) => constant + astr;
})();

const Menu = ({ id, className, pageIndex, setPageIndex, contents, ...attr }) => {
    const [previousPage, setPreviousPage] = useState(0);

    useEffect(() => {
        $("#" + elemID(previousPage)).removeClass(styles.active);
        $("#" + elemID(pageIndex)).addClass(styles.active);
        setPreviousPage(pageIndex);
    }, [pageIndex, previousPage]);

    return (
        <div {...attr} id={id} className={className}>
            <div className={styles.sidemenu}>
                {contents.map((content, index) =>
                    <div
                        key={index}
                        id={elemID(index)}
                        className={styles.menu}
                        onClick={() => { setPageIndex(index) }}>
                        <p>{content.name}</p>
                    </div>
                )}
            </div>
        </div >
    );
};

/**
 * @param {string} name 
 * @param {string} title 
 * @param {JSX.Element} page 
 */
export const contentFormat = (name, title, page) => { return { name: name, title: title, page: page } }
export default Menu;