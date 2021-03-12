import React from "react";
import EditMenu from "./EditMenu";
import { createPageContext } from "../extra/Functions";

const Page = () => {
    document.title = "Edit - change my resume";

    return (
        <EditMenu>
            <h1>Edit Resume</h1>
        </EditMenu>
    );
}

export default createPageContext("Edit Resume", "/edit/resume", Page);