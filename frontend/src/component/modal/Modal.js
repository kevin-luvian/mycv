import styles from "./styles.module.scss";
import { useRef, forwardRef, useImperativeHandle, useState, useCallback, useEffect } from "react";
import FadingModal from "./FadingModal";
import { Basic as BtnBasic } from "../button/Button";
import { SearchFilterInput } from "../input/Inputs";
import BlankCard from "../card/BlankCard";
import { containStr } from "../../util/utils";
import { IndexedPagination } from "../pagination/Paginations";

export const SimpleValidation = forwardRef(({ title, children, onContinue, onCancel }, ref) => {
    const modalRef = useRef();

    useImperativeHandle(ref, () => ({
        open() { modalRef.current.open() },
        close() { modalRef.current.close() }
    }))

    const continueFunc = () => {
        modalRef.current.close();
        onContinue?.();
    }
    const cancel = () => {
        modalRef.current.close();
        onCancel?.();
    }
    return (
        <FadingModal className={styles.simpleValidation} ref={modalRef}>
            <h5 className="mb-3">{title ?? "Do you wish to continue with the operation?"}</h5>
            <div>{children}</div>
            <div className={styles.buttons}>
                <BtnBasic.Default onClick={continueFunc}>continue</BtnBasic.Default>
                <BtnBasic.Danger onClick={cancel}>cancel</BtnBasic.Danger>
            </div>
        </FadingModal>
    )
});

export const createSelectableElement = (title, data) => {
    if (typeof createSelectableElement.counter == 'undefined')
        createSelectableElement.counter = 0;
    return { title, data, id: createSelectableElement.counter++ };
}

export const SelectableModal = forwardRef((
    { title, elements, onSelect, numPerPage, renderElement },
    ref) => {
    const modalRef = useRef();
    const [search, setSearch] = useState("");
    const [selectedID, setSelectedID] = useState(-1);
    const [searchedElements, setSearchedElements] = useState([]);
    const [shownElements, setShownElements] = useState([]);
    const perPage = numPerPage ?? 50;

    const mRenderElement = useCallback((elem, active) => renderElement?.(elem, active), [renderElement])

    useImperativeHandle(ref, () => ({
        open() {
            modalRef.current.open();
            reset();
        },
        close() { modalRef.current.close() }
    }));

    const selected = () => {
        const findID = (arr, targetID) => {
            for (let i = 0; i < arr.length; i++) {
                if (targetID === arr[i].id)
                    return arr[i].data;
            }
            return null;
        }
        if (selectedID >= 0) {
            onSelect?.(findID(elements, selectedID));
            modalRef.current.close();
        }
    }

    const reset = () => {
        setSearch("");
        setSelectedID(-1);
    }

    const showPage = useCallback((firstIndex, lastIndex) =>
        setShownElements(searchedElements.slice(firstIndex, lastIndex)), [searchedElements]);

    useEffect(() => {
        const searchElements = () => {
            const newElements = [];
            elements.forEach(element => {
                if (containStr(element.title, search))
                    newElements.push(element);
            });
            setSearchedElements(newElements);
        }
        searchElements();
    }, [search, elements]);

    return (
        <FadingModal className={styles.selectableModal} ref={modalRef}>
            <div className={styles.container}>
                <h5 className={styles.title}>{title ?? "Select an element to continue"}</h5>
                <SearchFilterInput
                    className={styles.searchField}
                    onChange={val => setSearch(val)} />
                <div style={{ overflowY: "auto", height: "50rem" }}>
                    <div className={styles.elementContainer}>
                        {shownElements.map((elem, index) =>
                            <div key={index}>
                                <BlankCard
                                    active={elem.id === selectedID}
                                    className={styles.element}
                                    onClick={() => setSelectedID(elem.id)}>
                                    {mRenderElement(elem.data, elem.id === selectedID)}
                                </BlankCard>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.actionContainer}>
                    <div className={styles.pagination}>
                        <IndexedPagination
                            itemSize={searchedElements.length}
                            perPage={perPage}
                            onChange={showPage} />
                    </div>
                    <BtnBasic.Default onClick={selected}>continue</BtnBasic.Default>
                </div>
            </div>
        </FadingModal>
    )
});