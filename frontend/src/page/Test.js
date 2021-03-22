import { Fragment, useCallback, useState, useRef } from 'react';
import { IndexedPagination } from "../component/pagination/Paginations";
import Notification from "../component/notification/Notification";

import { Basic } from "../component/button/Button";
import { SelectableModal, createSelectableElement } from "../component/modal/Modal";
import favicons from "../util/favicons";

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
            <IndexedPagination onChange={onChanged} itemSize={itemSize} perPage={10} />
        </Fragment>
    );
}

const iconElements = favicons.map(val => createSelectableElement(val.replace("fa-", ""), val));
export const PModalPage = () => {
    document.title = "Test - Test Page";

    const modalRef = useRef();

    const show = elem => Notification.create(elem);
    const renderElement = (val, isActive) =>
        <p style={{ fontSize: "0.8rem" }}><i className={"fa " + val} /> {val.replace("fa-", "")}</p>

    return (
        <Fragment>
            <Basic.Default onClick={() => modalRef.current.open()}>Open Sesame</Basic.Default>
            <SelectableModal
                ref={modalRef}
                elements={iconElements}
                numPerPage={100}
                onSelect={show}
                renderElement={renderElement} />
        </Fragment>
    );
}

export default PModalPage;