import styles from "./styles.module.scss";
import {
    Fragment,
    useEffect,
    useRef,
    useCallback,
    forwardRef,
    useImperativeHandle
} from "react";
import { FileIconInput } from "./Inputs";
import { SelectableModal } from "../modal/Modal";
import { ColoredIcon, icons, iconColors } from "../decoration/Icons";
import { Basic } from "../button/Button";
import { concat, swap } from "../../util/utils";
import { useStore, useDispatch, updateFiles } from "../../store/CacheStore";

const ChooseFileModal = forwardRef(({ initialValue, onContinue }, ref) => {
    const modalRef = useRef();

    const store = useStore();

    useImperativeHandle(ref, () => ({
        open() { modalRef.current.open(); },
        close() { modalRef.current.close(); }
    }));

    const fileByIndex = useCallback(index => store.files?.value[index], [store.files]);

    const valueIndex = useCallback(() =>
        store.files?.value.findIndex(f => f._id === initialValue), [initialValue, store.files]);

    const handleContinue = index => onContinue?.(fileByIndex(index));

    const renderElement = useCallback((index, isActive) =>
        <Fragment>
            {!isActive ?
                <div>
                    <p className="mb-0" style={{ fontSize: "0.8em" }}>{fileByIndex(index).filename}</p>
                </div> :
                <div style={{ maxWidth: "70vw" }}>
                    <p className="mb-0" style={{ fontSize: "0.8em" }}>{fileByIndex(index).filename}</p>
                    {fileByIndex(index).contentType.includes("image") &&
                        <img src={fileByIndex(index).url} alt="file"
                            style={{ maxWidth: "100%", maxHeight: "15rem", marginTop: "0.3rem" }} />}
                </div>
            }
        </Fragment>, [fileByIndex]);

    return <SelectableModal ref={modalRef} title="Find File" data={store.files?.value ?? []}
        titleKey="filename" perPage={100} valueIndex={valueIndex()} onContinue={handleContinue}
        renderElement={renderElement} />
});

export const ChooseFileInput = ({ value, onChange, label }) => {
    const modalRef = useRef();

    const store = useStore();
    const dispatch = useDispatch();

    // fetching files
    useEffect(() => updateFiles(store, dispatch), [store, dispatch]);

    const selectedFilename = useCallback(() =>
        store.files?.value.find(f => f._id === value)?.filename ?? " ", [value, store.files])

    const handleContinue = file => onChange?.(file?._id);

    return (
        <Fragment>
            <FileIconInput
                disabled
                label={label ?? "Select File"}
                value={selectedFilename()}
                onClick={() => modalRef.current.open()} />
            <ChooseFileModal ref={modalRef} initialValue={value} onContinue={handleContinue} />
        </Fragment>
    )
}

export const ChooseMultiFileInput = ({ className, values, onChange, label }) => {
    const modalRef = useRef();

    const store = useStore();
    const dispatch = useDispatch();

    // fetching files
    useEffect(() => updateFiles(store, dispatch), [store, dispatch]);

    const getValuesFile = useCallback(() =>
        values.map(id => store.files?.value.find(f => f._id === id)), [store.files, values]);

    const handleContinue = file => onChange?.(values.concat([file._id]));

    const changePos = (from, to) => onChange?.(swap(values, from, to));

    const deletePos = index =>
        onChange?.(values.slice(0, index).concat(values.slice(index + 1, values.length)));

    const renderSelectedFile = (file, index) =>
        <div className={styles.selectedFilename}>
            <ColoredIcon
                style={{ transform: "rotate(180deg)" }}
                color={iconColors.default}
                icon={icons.arrowDown}
                onClick={() => changePos(index, index - 1)} />
            <ColoredIcon
                color={iconColors.default}
                icon={icons.arrowDown}
                onClick={() => changePos(index, index + 1)} />
            <p className="mx-2">{file.filename}</p>
            <ColoredIcon
                color={iconColors.default}
                icon={icons.close}
                onClick={() => deletePos(index)} />
        </div>

    return (
        <div className={concat(className, styles.inputBorder, "p-3")}>
            <p className="mb-2">{label ?? "Select Files"}</p>

            {getValuesFile().map((file, index) =>
                <Fragment key={index}>{file && renderSelectedFile(file, index)}</Fragment>
            )}

            <div className="text-center mt-3">
                <Basic.Default style={{ width: "100px" }}
                    onClick={() => modalRef.current.open()} >
                    <icons.add style={{ width: "20px" }} />
                </Basic.Default>
            </div>

            <ChooseFileModal
                ref={modalRef}
                initialValue=""
                onContinue={handleContinue} />
        </div>
    )
}