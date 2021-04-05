import { Fragment, useEffect, useState, useRef, useCallback } from 'react';
import Notification from "../component/notification/Notification";
import { FileIconInput } from "../component/input/Inputs";
import { ChooseFileInput, ChooseMultiFileInput } from "../component/input/SearchFilterInput";
import { SelectableModal, MultiSelectableModal } from "../component/modal/Modal";
import { Get } from "../axios/Axios";

export const Page = () => {
    const [fileID, setFileID] = useState("605a02f93df2b9600beb25bb");
    const [fileIDs, setFileIDs] = useState(["605a02f93df2b9600beb25bb", "60572ec1a4b828505ebd895d"]);
    document.title = "Test - Test Page";

    const handleChange = fileIds => {
        setFileIDs(fileIds);
    }

    return (
        <Fragment>
            <ChooseMultiFileInput label="choose files"
                values={fileIDs}
                onChange={handleChange} />
            {/* <ChooseFileInput label="choose fiel"
                value={fileID}
                onChange={setFileID} /> */}
        </Fragment>
    );
}

export default Page;