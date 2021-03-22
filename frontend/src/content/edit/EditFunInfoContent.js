import { Fragment, useState, useRef } from 'react';
import { SelectableModal, createSelectableElement } from "../../component/modal/Modal";
import { IconInput, TextInput, MultiTextInput } from "../../component/input/Inputs";
import { FunCard, FunCardBorderless } from "../../component/card/FunCard";
import { icons } from "../../component/decoration/Icons";
import BlankCard from "../../component/card/BlankCard";
import { Basic } from "../../component/button/Button";
import favicons from "../../util/favicons";

export const Page = () => {
    document.title = "Test - Test Page";

    return (
        <Fragment>
            <h2 className="mb-4">Edit Fun Info</h2>
            <FunInfoForm formTitle="What I Do" />
            <div className="row mt-4 px-3">
                <FunCardBorderless />
                <FunCardBorderless />
                <FunCardBorderless />
            </div>
            <FunInfoForm formTitle="Fun Fact" />
            <div className="row mt-4">
                <FunCard />
                <FunCard />
                <FunCard />
            </div>
        </Fragment>
    );
}

const FunInfoForm = ({ className, formTitle }) => {
    const [favIcon, setFavIcon] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    return (
        <BlankCard className={className + " px-5 py-4"}>
            <h5>{formTitle ?? "Fun Form"}</h5>
            <div className="row mt-3">
                <ChooseIconInput className="col-5" value={favIcon} onChange={setFavIcon} />
                <div className="col-7">
                    <TextInput label="title" value={title} onChange={setTitle} />
                </div>
            </div>
            <MultiTextInput
                label="description"
                value={description}
                onChange={setDescription} />
            <div className="text-center">
                <Basic.Default>Submit</Basic.Default>
            </div>
        </BlankCard>
    )
}

const iconElements = favicons.map(val => createSelectableElement(val.replace("fa-", ""), val));
const ChooseIconInput = ({ className, value, onChange }) => {
    const modalRef = useRef();

    const renderElement = val =>
        <p style={{ fontSize: "0.8rem" }}><i className={"fa " + val} /> {val.replace("fa-", "")}</p>

    return (
        <div className={className}>
            <IconInput
                label="fav-icon"
                icon={icons.info}
                value={value}
                onChange={onChange}
                onClick={() => modalRef.current.open()} />

            <SelectableModal
                ref={modalRef}
                title="Find Icon"
                elements={iconElements}
                numPerPage={100}
                onSelect={onChange}
                renderElement={renderElement} />
        </div>
    )
}

export default Page;