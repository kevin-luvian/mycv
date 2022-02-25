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

export const SelectableModal = forwardRef((
    { title, data, titleKey, valueIndex, perPage, renderElement, onContinue },
    ref) => {
    const modalRef = useRef();
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [search, setSearch] = useState("");
    const [elements, setElements] = useState([createSelectableElement("", -1)]);
    const [availableElements, setAvailableElements] = useState([]);
    const [shownElements, setShownElements] = useState([]);
    const [numPerPage, setNumPerPage] = useState(10);

    const mRenderElement = useCallback((index, isActive) =>
        renderElement?.(index, isActive), [renderElement]);

    useImperativeHandle(ref, () => ({
        open() {
            modalRef.current.open();
            reset();
        },
        close() { modalRef.current.close(); }
    }));

    const reset = () => {
        setSelectedIndex(valueIndex);
    };

    const onClose = () => modalRef.current.close();

    useEffect(() => setSelectedIndex(valueIndex), [valueIndex])

    // handle number per page setting
    useEffect(() => setNumPerPage(perPage ?? 50), [perPage]);

    // handle elements creation
    useEffect(() =>
        setElements(data.map((val, index) => createSelectableElement(val[titleKey], index))),
        [data, titleKey]);

    // handle search query
    useEffect(() =>
        setAvailableElements(elements.filter(e => containStr(e.title, search))), [search, elements]);

    // handle page change
    const showPage = useCallback((firstIndex, lastIndex) =>
        setShownElements(availableElements.slice(firstIndex, lastIndex)), [availableElements]);

    const onSelect = index => {
        if (selectedIndex === index) setSelectedIndex?.(-1);
        else setSelectedIndex?.(index);
    }

    const handleContinue = () => {
        onContinue?.(selectedIndex);
        onClose();
    }

    return (
        <FadingModal className={styles.selectableModal} ref={modalRef}>
            <div className={styles.container}>
                <h5 className={styles.title}>{title ?? "Select an element to continue"}</h5>
                <SearchFilterInput
                    initialValue={search}
                    className={styles.searchField}
                    onChange={val => setSearch(val)} />
                <div style={{ overflowY: "auto", height: "50rem" }}>
                    <div className={styles.elementContainer}>
                        {shownElements.map((elem, index) =>
                            <div key={index}>
                                <BlankCard
                                    active={elem.index === selectedIndex}
                                    className={styles.element}
                                    onClick={() => onSelect(elem.index)}>
                                    {mRenderElement(elem.index, elem.index === selectedIndex)}
                                </BlankCard>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.actionContainer}>
                    <div className={styles.pagination}>
                        <IndexedPagination
                            itemSize={availableElements.length}
                            perPage={numPerPage}
                            onChange={showPage} />
                    </div>
                    <BtnBasic.Default onClick={handleContinue}>continue</BtnBasic.Default>
                </div>
            </div>
        </FadingModal>
    )
});

/**
 * create a selectable element
 * @param {string} title 
 * @param {number} index 
 */
export const createSelectableElement = (title, index) => { return { title, index } };