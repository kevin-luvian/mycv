import { Fragment, useRef } from 'react';
import { Basic } from "../../component/button/Button";
import { SelectableModal, createSelectableElement } from "../../component/modal/Modal";
import Notification from "../../component/notification/Notification";
import favicons from "../../util/favicons";

const iconElements = favicons.map(val => createSelectableElement(val.replace("fa-", ""), val))
// .slice(0, 600)

export const Page = () => {
    document.title = "Test - Test Page";

    const modalRef = useRef();

    const show = elem => Notification.create(elem.title);
    const renderElement = (elem, isActive) =>
        <p style={{ fontSize: "0.8rem" }}><i className={"fa " + elem.data} /> {elem.title}</p>

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

export default Page;