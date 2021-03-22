import React, { Fragment, useEffect, useRef, useState } from "react";
import {
    TextInput,
    MultiTextInput,
    FileIconInput,
    OptionInput,
    optionItem
} from "../../component/input/Inputs";
import Button from "../../component/button/Button";
import Notification from "../../component/notification/Notification";
import { Get, Post } from "../../axios/Axios";
import { arrayToString, hasNumberOnly } from "../../util/utils";
import {
    SelectableModal,
    createSelectableElement
} from "../../component/modal/Modal";

const genders = [
    optionItem("unspecified", 0),
    optionItem("male", 1),
    optionItem("female", 2),
    optionItem("other", 3)
];

const parsePayload = ({ fullname, phone, gender, address, email, description, professions, imageID, cvID }) => {
    return {
        fullname: fullname ?? "",
        phone: phone ?? "",
        gender: gender ?? 0,
        address: address ?? "",
        email: email ?? "",
        description: description ?? "",
        professions: arrayToString(professions ?? [""]),
        imageID: imageID ?? "",
        cvID: cvID ?? ""
    }
}

const Page = () => {
    const [state, setState] = useState({
        fullname: "",
        phone: "",
        gender: 0,
        address: "",
        email: "",
        description: "",
        professions: "",
        imageID: "",
        cvID: ""
    })

    useEffect(() => fetch(), []);

    const updateState = (obj) => {
        setState({ ...state, ...obj });
    }

    const fetch = async () => {
        const res = await Get("/myinfo");
        if (res.success) {
            Notification.create(res.message, Notification.type.success);
            const data = parsePayload(res.data);
            setState(data);
        }
        else Notification.create(res.message, Notification.type.danger);
    }

    const send = async () => {
        const res = await Post("/myinfo", state);
        if (res.success) Notification.create(res.message, Notification.type.success);
        else Notification.create("sending data failed", Notification.type.danger);
    }

    return (
        <React.Fragment>
            <h2 className="mb-4">Edit Biodata</h2>

            <TextInput
                label="fullname"
                value={state.fullname}
                onChange={val => updateState({ fullname: val })} />

            <OptionInput
                label="gender"
                selections={genders}
                value={state.gender}
                onChange={val => updateState({ gender: val })} />

            <TextInput
                label="email"
                value={state.email}
                onChange={val => updateState({ email: val })} />

            <TextInput
                label="phone number"
                value={state.phone}
                onChange={val => {
                    if (val.length <= 12 && hasNumberOnly(val))
                        updateState({ phone: val })
                }} />

            <MultiTextInput
                label="address"
                value={state.address}
                onChange={val => updateState({ address: val })} />

            <MultiTextInput
                label="description"
                rowsMax={10}
                value={state.description}
                onChange={val => updateState({ description: val })} />

            <TextInput
                label="professions"
                value={state.professions}
                onChange={val => updateState({ professions: val })} />

            <ChooseFileInput
                label="image"
                value={state.imageID}
                onChange={val => updateState({ imageID: val })} />

            <ChooseFileInput
                label="cv"
                value={state.cvID}
                onChange={val => updateState({ cvID: val })} />

            <Button className="w-100" onClick={send}>submit</Button>
        </React.Fragment>
    );
}

const ChooseFileInput = ({ value, onChange, label }) => {
    const [files, setFiles] = useState([]);
    const modalRef = useRef();

    useEffect(() => {
        const fetch = async () => {
            const res = await Get("/file");
            if (res.success) {
                const newFiles = [];
                for (let i = 0; i < res.data.length; i++) {
                    newFiles.push(createSelectableElement(res.data[i].filename, res.data[i]));
                }
                setFiles(newFiles);
            } else Notification.create(res.message, Notification.type.danger);
        };
        fetch();
    }, []);

    const renderElement = (elem, isActive) => {
        const showImage = elem.contentType.includes("image");
        if (!isActive) return (
            <div>
                <p className="mb-0" style={{ fontSize: "0.8em" }}>{elem.filename}</p>
            </div>
        )
        return (
            <div style={{ maxWidth: "70vw" }}>
                <p className="mb-0" style={{ fontSize: "0.8em" }}>{elem.filename}</p>
                {showImage &&
                    <img src={elem.url} alt="file"
                        style={{ maxWidth: "100%", maxHeight: "15rem", marginTop: "0.3rem" }} />}
            </div>
        )
    }

    const selected = file => onChange?.(file._id);

    const getFilename = fileID => {
        if (!fileID) return " ";
        for (let i = 0; i < files.length; i++) {
            if (fileID === files[i]?.data._id) return files[i].data.filename;
        }
        return " ";
    }

    return (
        <Fragment>
            <FileIconInput
                disabled
                label={label}
                value={getFilename(value)}
                onClick={() => modalRef.current.open()} />

            <SelectableModal
                ref={modalRef}
                title="Find Files"
                elements={files}
                numPerPage={100}
                onSelect={selected}
                renderElement={renderElement} />
        </Fragment>
    )
}

export default Page;