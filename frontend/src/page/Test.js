import { Fragment, useState } from 'react';
import { ChooseMultiFileInput } from "../component/input/SearchFilterInput";
import { shouldUpdate, useStore, useDispatch, updateFiles } from "../store/CacheStore";
import { Basic } from "../component/button/Button";

export const Page = () => {
    const [fileIDs, setFileIDs] = useState(["605a02f93df2b9600beb25bb", "60572ec1a4b828505ebd895d"]);
    document.title = "Test - Test Page";

    const store = useStore();
    const dispatch = useDispatch();

    const handleClick = () => {
        console.log("sup", shouldUpdate(store, "files", 1));
    }

    const handleClick2 = async () => {
        await updateFiles(store, dispatch);
    }

    return (
        <Fragment>
            <p>the files:</p>
            {store.files?.value.map(f => <p>{f.url}</p>)}
            <ChooseMultiFileInput label="choose files"
                values={fileIDs}
                onChange={setFileIDs} />
            <Basic.Default onClick={handleClick}>click</Basic.Default>
            <Basic.Danger onClick={handleClick2}>click</Basic.Danger>
        </Fragment>
    );
}

export default Page;