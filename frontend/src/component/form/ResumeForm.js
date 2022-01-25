import React, { useState, Fragment, useEffect } from "react";
import Button from "../../component/button/Button";
import {
    TextInput,
} from "../../component/input/Inputs";
import { Get, Post, Put } from "../../axios/Axios";

const emptyResumeObj = {
    title: "untitled",
    place: "unknown",
    date: "0",
    description: "[ ... ]",
    category: "uncategorized",
}

const Form = ({ id = "", reload }) => {
    const [resume, setResume] = useState(emptyResumeObj);

    useEffect(() => console.log(resume), [resume]);

    useEffect(() => id === "" ?
        setResume(emptyResumeObj) :
        Get(`/resume/${id}`).then(res => res.success && setResume({ ...res.data })),
        [id]);

    const updateResume = attr => setResume({ ...resume, ...attr });
    const onSubmit = async () => {
        if (id === "") await save();
        else await update();
        reload();
    }
    const save = async () => {
        const res = await Post("/resume", resume);
        res.notify();
    }
    const update = async () => {
        const res = await Put(`/resume/${id}`, resume);
        res.notify();
    }

    return (
        <Fragment>
            <h2 className="mb-4">{id === "" ? "Create" : "Edit"}</h2>
            <TextInput
                label="title"
                value={resume.title}
                onChange={value => updateResume({ title: value })} />

            <TextInput
                label="place"
                value={resume.place}
                onChange={value => updateResume({ place: value })} />

            <TextInput
                label="date"
                value={resume.date}
                onChange={value => updateResume({ date: value })} />

            <TextInput
                label="description"
                value={resume.description}
                onChange={value => updateResume({ description: value })} />

            <TextInput
                label="category"
                value={resume.category}
                onChange={value => updateResume({ category: value })} />

            <Button className="w-100" onClick={onSubmit}>submit</Button>
        </Fragment>
    );
}

export default Form;