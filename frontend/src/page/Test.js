import { Fragment, useCallback, useState } from 'react';
import { IndexPagination } from "../component/pagination/Paginations";
import Notification from "../component/notification/Notification";

export const Page = () => {
    document.title = "Test - Test Page";

    const [itemSize, setItemSize] = useState(100);
    const [curPage, setCurPage] = useState(-1);

    const onChanged = useCallback((f, l) => {
        Notification.create(`changed: f:${f} l: ${l}`);
        setCurPage(f);
    }, []);

    return (
        <Fragment>
            <p>Curr Page:{curPage}</p>
            <button onClick={() => setItemSize(500)}>Add</button>
            <button onClick={() => setItemSize(100)}>Sub</button>
            <IndexPagination onChange={onChanged} itemSize={itemSize} perPage={10} />
        </Fragment>
    );
}

export default Page;