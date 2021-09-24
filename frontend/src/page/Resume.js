import { Fragment, useState, useEffect } from 'react';
import { useStore, useDispatch, updateCache } from "../store/CacheStore";
import { Get } from '../axios/Axios';
import { ResumeCard } from "../component/card/ResumeCard";
import { SkillCard } from "../component/card/SkillCard";
import { UnderlinedTitle, Banner } from '../component/decoration/Text';
import ContentPadding from "./extra/ContentPadding";

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

const fetchFunction = url => async () => {
    const res = await Get(url);
    res.notify();
    return groupToCategory(res.data);
}

const Page = () => {
    const [resumes, setResumes] = useState([]);
    const [skills, setSkills] = useState([]);

    document.title = "View My Resumes";

    const store = useStore();
    const dispatch = useDispatch();

    useEffect(() => {
        updateCache(store, dispatch, "resume", fetchFunction("/resume"));
        updateCache(store, dispatch, "skill", fetchFunction("/skill"));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setResumes(store.resume?.value ?? {});
        setSkills(store.skill?.value ?? {});
    }, [store]);

    return (
        <Fragment>
            <Banner title="Resume" className="mb-3" />
            <ContentPadding>
                <div className="row mt-5">
                    {Object.keys(resumes).map((category, index) =>
                        <div key={index} className="col-12 col-md-6">
                            <UnderlinedTitle className="mb-3" text={category} />
                            {resumes[category].map((r, i) =>
                                <ResumeCard key={i} className="mb-3" resume={r} />
                            )}
                        </div>
                    )}
                </div>
                <div className="row mt-4">
                    {Object.keys(skills).map((category, index) =>
                        <div key={index} className="col-12 col-md-6">
                            <UnderlinedTitle className="mb-3" text={category} />
                            {skills[category].map((s, i) =>
                                <SkillCard key={i} className="mb-3" skill={s} />
                            )}
                        </div>
                    )}
                </div>
            </ContentPadding>
        </Fragment>
    );
}

export default Page;