import styles from "./styles.module.scss";
import {
    Fragment,
    useEffect,
    useState,
    useRef,
    useCallback,
    forwardRef,
    useImperativeHandle
} from "react";
import { FileIconInput } from "./Inputs";
import { Get } from "../../axios/Axios";
import { SelectableModal } from "../modal/Modal";
import { ColoredIcon, icons, iconColors } from "../decoration/Icons";
import Notification from "../notification/Notification";
import { Basic } from "../button/Button";
import { concat, swap } from "../../util/utils";

const fetchFiles = async onSuccess => {
    const res = await Get("/file");
    if (res.success) onSuccess(res.data);
    else Notification.create(res.message, Notification.type.danger);
};

const ChooseFileModal = forwardRef(({ initialValue, files, onContinue }, ref) => {
    const modalRef = useRef();

    useImperativeHandle(ref, () => ({
        open() { modalRef.current.open(); },
        close() { modalRef.current.close(); }
    }));

    const valueIndex = useCallback(() =>
        files.findIndex(f => f._id === initialValue), [initialValue, files]);

    const handleContinue = index => onContinue?.(files[index]);

    const renderElement = useCallback((index, isActive) =>
        <Fragment>
            {!isActive ?
                <div>
                    <p className="mb-0" style={{ fontSize: "0.8em" }}>{files[index].filename}</p>
                </div> :
                <div style={{ maxWidth: "70vw" }}>
                    <p className="mb-0" style={{ fontSize: "0.8em" }}>{files[index].filename}</p>
                    {files[index].contentType.includes("image") &&
                        <img src={files[index].url} alt="file"
                            style={{ maxWidth: "100%", maxHeight: "15rem", marginTop: "0.3rem" }} />}
                </div>
            }
        </Fragment>, [files]);

    return <SelectableModal ref={modalRef} title="Find Files" data={files} titleKey="filename"
        perPage={100} valueIndex={valueIndex()} onContinue={handleContinue}
        renderElement={renderElement} />
});

export const ChooseFileInput = ({ value, onChange, label }) => {
    const [files, setFiles] = useState([]);
    const modalRef = useRef();

    // fetching files
    useEffect(() => fetchFiles(setFiles), []);

    const selectedFilename = useCallback(() =>
        files.find(f => f._id === value)?.filename ?? " ", [value, files])

    const handleContinue = file => onChange?.(file?._id);

    return (
        <Fragment>
            <FileIconInput
                disabled
                label={label}
                value={selectedFilename()}
                onClick={() => modalRef.current.open()} />
            <ChooseFileModal ref={modalRef} files={files} initialValue={value}
                onContinue={handleContinue} />
        </Fragment>
    )
}

export const ChooseMultiFileInput = ({ values, onChange, label }) => {
    const [files, setFiles] = useState([]);
    const modalRef = useRef();

    // fetching files
    useEffect(() => fetchFiles(setFiles), []);

    const getValuesFile = useCallback(() =>
        values.map(id => files.find(f => f._id === id)), [files, values]);

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
        <div className={concat(styles.inputBorder, "p-3")}>
            <p className="mb-2">Select Files</p>

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
                files={files}
                onContinue={handleContinue} />
        </div>
    )
}