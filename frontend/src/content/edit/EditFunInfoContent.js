import { useEffect, Fragment, useState, useRef } from 'react';
import FadingModal from "../../component/modal/FadingModal";
import { SimpleValidation } from "../../component/modal/Modal";
import FavIconInput from "../../component/input/FavIconInput";
import { TextInput, MultiTextInput } from "../../component/input/Inputs";
import { FunCard, EditFunCard, EditFunCardBorderless } from "../../component/card/FunCard";
import { icons, iconColors, ColoredIcon } from "../../component/decoration/Icons";
import BlankCard from "../../component/card/BlankCard";
import { Basic } from "../../component/button/Button";
import { Get, Post, Delete, Put } from "../../axios/Axios";

const whatIDoType = 0;
const funFactType = 1;
export const Page = () => {
    const [funFacts, setFunFacts] = useState([]);
    const [whatIDos, setWhatIDos] = useState([]);

    const fetchWIDO = async () => {
        const res = await Get("/funInfo/" + whatIDoType);
        if (res.success) setWhatIDos(res.data);
        res.notify();
    }

    const fetchFF = async () => {
        const res = await Get("/funInfo/" + funFactType);
        if (res.success) setFunFacts(res.data);
        res.notify();
    }

    const post = async (data, type) => {
        const res = await Post("/funInfo", { ...data, type });
        res.notify();
    }
    const postWIDO = async data => post(data, whatIDoType).then(fetchWIDO);
    const postFF = data => post(data, funFactType).then(fetchFF);

    useEffect(() => {
        fetchFF();
        fetchWIDO();
    }, []);

    return (
        <Fragment>
            <h2 className="mb-4">Edit Fun Info</h2>
            <BlankCard className="px-5 py-4">
                <FunInfoForm formTitle="What I Do" onSubmit={postWIDO} />
            </BlankCard>
            <div className="row mt-4 px-3">
                {whatIDos.map((val, index) =>
                    <FunELement key={index} obj={val} type={whatIDoType} onChange={fetchWIDO} />)}
            </div>
            <BlankCard className="px-5 py-4">
                <FunInfoForm formTitle="Fun Fact" onSubmit={postFF} />
            </BlankCard>
            <div className="row mt-4">
                {funFacts.map((val, index) =>
                    <FunELement key={index} obj={val} type={funFactType} onChange={fetchFF} />)}
            </div>
        </Fragment>
    );
}

const parseFunInfo = ({ _id, title, favicon, description, type }) => {
    return { _id, title, favicon, description, type };
}

const FunELement = ({ obj, type, onChange }) => {
    const parsedObj = parseFunInfo(obj);

    const updateModalRef = useRef();

    const updateObj = async data => {
        data.type = parsedObj.type;
        const res = await Put("/funInfo/" + parsedObj._id, data);
        res.notify();
        updateModalRef.current.close();
        onChange?.();
    }
    const deleteObj = async () => {
        const res = await Delete("/funInfo/" + parsedObj._id);
        res.notify();
        onChange?.();
    }

    return (
        <Fragment>
            <FadingModal ref={updateModalRef}>
                <FunInfoForm
                    parsedObj={parsedObj}
                    onSubmit={updateObj}
                    formTitle={`Edit ${parsedObj.title}`} />
            </FadingModal>
            {type === whatIDoType ?
                <EditFunCardBorderless
                    title={parsedObj.title}
                    description={parsedObj.description}
                    icon={parsedObj.favicon}
                    onUpdate={() => updateModalRef.current.open()}
                    onDelete={deleteObj} /> :
                <EditFunCard
                    title={parsedObj.title}
                    description={parsedObj.description}
                    icon={parsedObj.favicon}
                    onUpdate={() => updateModalRef.current.open()}
                    onDelete={deleteObj} />}
        </Fragment>
    )
}

const FunInfoForm = ({ className, parsedObj, formTitle, onSubmit }) => {
    const [title, setTitle] = useState("");
    const [favicon, setFavicon] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        setTitle(parsedObj?.title || "");
        setFavicon(parsedObj?.favicon || "");
        setDescription(parsedObj?.description || "");
    }, [parsedObj])

    const post = () => onSubmit?.({ title, favicon, description });

    return (
        <Fragment>
            <h5>{formTitle ?? "Fun Form"}</h5>
            <div className="row mt-3">
                <FavIconInput className="col-5" value={favicon} onChange={setFavicon} />
                <div className="col-7">
                    <TextInput label="title" value={title} onChange={setTitle} />
                </div>
            </div>
            <MultiTextInput
                label="description"
                value={description}
                onChange={setDescription} />
            <div className="text-center">
                <Basic.Default onClick={post}>Submit</Basic.Default>
            </div>
        </Fragment>
    )
}

export default Page;