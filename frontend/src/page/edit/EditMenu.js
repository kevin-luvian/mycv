import React from "react";
import { Link } from "react-router-dom";
import EditPages from "./EditPages";

const Wrapper = ({ children }) => {
    document.title = "Edit - change my biodata";

    const renderMenus = () =>
        Object.entries(EditPages).map((keyValue, index) => (
            <div key={index} className="col-12">
                <Link to={keyValue[1].url}>{keyValue[1].name}</Link>
            </div>
        ));

    return (
        <div className="editRoot">
            <div className="">
                <h2>Menu</h2>
                {renderMenus()}
            </div>
            <div className="content">{children}</div>
        </div>
    );
}

export default Wrapper;