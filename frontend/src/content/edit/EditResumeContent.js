import React, { useState, useRef, Fragment, useEffect } from "react";
import Button from "../../component/button/Button";
import Notification from "../../component/notification/Notification";
import FadingModal from "../../component/modal/FadingModal";
import {
    IconInput,
    TextInput,
    MultiTextInput,
    OptionInput,
    optionItem,
    SearchFilterInput
} from "../../component/input/Inputs";
import ResumeForm from "../../component/form/ResumeForm";
import SkillForm from "../../component/form/SkillForm";
import { EditResumeCard } from "../../component/card/ResumeCard";
import { SkillCard, EditSkillCard } from "../../component/card/SkillCard";
import { Get, Delete, Post, Put } from "../../axios/Axios";
import { UnderlinedTitle } from "../../component/decoration/Text";
import styles from "./styles.module.scss";

const groupToCategory = data => {
    let group = {};
    let key = ""
    for (let i = 0; i < data.length; i++) {
        key = data[i].category;
        if (key in group) group[key].push(data[i]);
        else group[key] = [data[i]];
    }
    return group;
}

const EditSkill = ({ className }) => {
    const editModalRef = useRef();

    const [skills, setSkills] = useState("");
    const [editSkillID, setEditSkillID] = useState("");

    useEffect(() => getAll(), []);

    const getAll = async () => {
        const res = await Get("/skill");
        if (res.success) setSkills(groupToCategory(res.data));
        res.notify();
    }
    const editSkill = id => {
        setEditSkillID(id);
        editModalRef.current.open();
    };
    const deleteSkill = async id => {
        const res = await Delete(`/skill/${id}`);
        if (res.success) getAll();
        res.notify();
    }
    return (
        <div className={className}>
            <FadingModal ref={editModalRef}>
                <SkillForm id={editSkillID} reload={getAll} />
            </FadingModal>

            <h2 className="mb-4">Skill</h2>
            <div className="row">
                {Object.keys(skills).map((category, index) =>
                    <div key={index} className="col-12 col-md-6">
                        <UnderlinedTitle className="mb-3" text={category} />
                        {skills[category].map((s, i) =>
                            <EditSkillCard
                                key={i}
                                className="mb-3"
                                skill={s}
                                onEdit={editSkill}
                                onDelete={deleteSkill} />
                        )}
                    </div>
                )}
            </div>
            <Button className="w-100 mb-3" onClick={() => editSkill("")}>New</Button>
        </div>
    );
}

const EditResume = ({ className }) => {
    const editModalRef = useRef();

    const [resumes, setResumes] = useState({});
    const [editResumeID, setEditResumeID] = useState("");

    useEffect(() => getAll(), []);

    const getAll = async () => {
        const res = await Get("/resume");
        if (res.success) setResumes(groupToCategory(res.data));
        res.notify();
    }
    const deleteResume = async id => {
        const res = await Delete(`/resume/${id}`);
        if (res.success) getAll();
        res.notify();
    };
    const editResume = id => {
        setEditResumeID(id);
        editModalRef.current.open();
    };

    return (
        <div className={className}>
            <FadingModal ref={editModalRef}>
                <ResumeForm id={editResumeID} reload={getAll} />
            </FadingModal>

            <div className="row">
                {Object.keys(resumes).map((category, index) =>
                    <div key={index} className="col-12 col-md-6">
                        <UnderlinedTitle className="mb-3" text={category} />
                        {resumes[category].map((r, i) =>
                            <EditResumeCard
                                key={i}
                                className="mb-3"
                                resume={r}
                                onDelete={deleteResume}
                                onEdit={editResume} />
                        )}
                    </div>
                )}
            </div>
            <Button className="w-100 mb-3" onClick={() => editResume("")}>New</Button>
        </div>
    );
}

const Page = () => {
    return (
        <React.Fragment>
            <h2 className="mb-4">Edit Resume</h2>
            <EditResume className="mb-3" />
            <EditSkill />
        </React.Fragment>
    );
}

export default Page;