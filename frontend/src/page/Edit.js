import React, { useState } from "react";
import EditBioContent from "../content/edit/EditBioContent";
import EditResumeContent from "../content/edit/EditResumeContent";
import EditFilesContent from "../content/edit/EditFilesContent";
import EditFunInfoContent from "../content/edit/EditFunInfoContent";
import EditDirectoryContent from "../content/edit/EditDirectoryContent";
import EditContact from "../content/edit/EditContact";
import EditMenu, { contentFormat } from "../content/edit/EditMenu";
import ContentPadding from "./extra/ContentPadding";
import styles from "./editStyles.module.scss";

const contents = [
    contentFormat("Bio", "Edit - change my biodata", <EditBioContent />),
    contentFormat("Contact", "Edit - change my contact", <EditContact />),
    contentFormat("Directory", "Edit - create new project directory", <EditDirectoryContent />),
    contentFormat("Files", "Edit - change my files", <EditFilesContent />),
    contentFormat("Fun Info", "Edit - change my fun info", <EditFunInfoContent />),
    contentFormat("Resume", "Edit - change my resume", <EditResumeContent />),
];

const Page = () => {
    const [index, setIndex] = useState(0);

    document.title = contents[index].title;

    return (
        <ContentPadding>
            <div id={styles.editRoot} className="row py-3">
                <EditMenu
                    className="col-12 col-sm-4 col-lg-3 pb-3"
                    contents={contents}
                    pageIndex={index}
                    setPageIndex={setIndex} />
                <div className="col-12 col-sm-8 col-lg-9">
                    {contents[index].page}
                </div>
            </div>
        </ContentPadding>
    );
}

export default Page;