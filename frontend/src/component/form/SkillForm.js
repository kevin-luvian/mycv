import React, { useState, useRef, Fragment, useEffect } from "react";
import Button from "../../component/button/Button";
import { TextInput, NumberInput } from "../../component/input/Inputs";
import { Get, Delete, Post, Put } from "../../axios/Axios";

const emptySkillObj = {
    title: "untitled",
    level: 0.5,
    category: "uncategorized",
}

const Form = ({ id = "", reload }) => {
    const [skill, setSkill] = useState(emptySkillObj);

    useEffect(() => console.log("skill", skill), [skill]);

    useEffect(() => {
        if (id === "") setSkill(emptySkillObj);
        else findSkill();
    }, [id]);

    const findSkill = async () => {
        const res = await Get(`/skill/${id}`);
        if (res.success) setSkill({ ...res.data });
    }
    const updateAttr = attr => setSkill({ ...skill, ...attr });
    const onSubmit = async () => {
        if (id === "") await save();
        else await update();
        reload();
    }
    const save = async () => {
        const res = await Post("/skill", skill);
        res.notify();
    }
    const update = async () => {
        const res = await Put(`/skill/${id}`, skill);
        res.notify();
    }

    return (
        <Fragment>
            <h2 className="mb-4">{id === "" ? "Create" : "Edit"}</h2>
            <TextInput
                label="title"
                value={skill.title}
                onChange={value => updateAttr({ title: value })} />

            <NumberInput
                label="level"
                step={0.1}
                value={skill.level}
                onChange={value => updateAttr({ level: value })} />

            <TextInput
                label="category"
                value={skill.category}
                onChange={value => updateAttr({ category: value })} />

            <Button className="w-100" onClick={onSubmit}>submit</Button>
        </Fragment>
    );
}

export default Form;