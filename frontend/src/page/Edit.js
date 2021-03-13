import React, { useState, useEffect } from "react";
import EditBioContent from "../content/edit/EditBioContent";
import EditResumeContent from "../content/edit/EditResumeContent";
import styles from "./editStyles.module.scss";
import Util from "../util/utils";
import $ from "jquery";

const contents = [
    { name: "Bio", page: <EditBioContent /> },
    { name: "Resume", page: <EditResumeContent /> },
];

const elemID = (() => {
    const constant = Util.badStringID();
    return (astr) => constant + astr;
})();

const Wrapper = () => {
    const [previousPage, setPreviousPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const toggleActive = (toActivate, toDeactivate) => {
        $("#" + elemID(toDeactivate)).removeClass(styles.active);
        $("#" + elemID(toActivate)).addClass(styles.active);
    }

    useEffect(() => {
        toggleActive(currentPage, previousPage);
        setPreviousPage(currentPage);
    }, [currentPage, previousPage]);

    const renderMenus = () =>
        contents.map((content, index) => (
            <div
                key={index}
                id={elemID(index)}
                className={styles.menu}
                onClick={() => { setCurrentPage(index) }}>
                <p>{content.name}</p>
            </div>
        ));

    return (
        <div id={styles.editRoot} className="row py-3">
            <div className="col-12 col-sm-4 col-lg-3 pb-3">
                <div id={styles.sidemenu}>{renderMenus()}</div>
            </div>
            <div id={styles.content} className="col-12 col-sm-8 col-lg-9">
                {contents[currentPage].page}
            </div>
        </div>
    );
}

export default Wrapper;