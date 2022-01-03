import { Fragment, useState, useEffect, useCallback } from 'react';
import { UnderlinedTitle, Banner } from '../component/decoration/Text';
import { useStore, useDispatch, updateCache } from "../store/CacheStore";
import { Get, Post } from '../axios/Axios';
import { ResumeCard } from "../component/card/ResumeCard";
import { SkillCard } from "../component/card/SkillCard";
import { DirectoryCard } from '../component/card/BlankCard';
import { ImageCarousel } from "../component/carousel/Carousel";
import { badStringID, concat } from "../util/utils";
import ContentPadding from "./extra/ContentPadding";
import styles from "./styles.module.scss";
import parse from 'html-react-parser';

const elemID = (() => {
    const constant = badStringID();
    return (astr) => constant + astr;
})();

const parseDir = (dir) => {
    return {
        _id: dir?._id ?? "",
        type: dir?.type ?? '0',
        title: dir?.title ?? "",
        images: dir?.images ?? [],
        imageURLs: [],
        content: dir?.content ?? "",
        order: dir?.order ?? 0,
        childrens: dir?.childrens?.map(c => parseDir(c)) ?? []
    };
}

const SectionsMenu = ({ project, onChange, className, ...props }) => {
    const [sections, setSections] = useState([]);
    const [activeSectionIndex, setActiveSectionIndex] = useState(-1);

    useEffect(() => {
        const menu = createSectionMenu(project);
        menu.splice(0, 1);
        setSections(menu);
        changeSection(menu[0], 0);
    }, [project]);

    const createSectionMenu = (section, indent = 0) => {
        if (!section) return [];
        const childrens = section.childrens?.reduce(
            (arr, s) => arr.concat(createSectionMenu(s, indent + 1)),
            []) || [];
        section["indent"] = indent;
        delete section["childrens"];
        return [section].concat(childrens);
    }

    const isUnclickable = (section) => !section || "" === section.content;

    const changeSection = (section, index) => {
        if (!section || "" === section.content) return;
        setActiveSectionIndex(index);
        onChange?.(section);
    }

    return (
        <div {...props} className={className}>
            <div className={styles.sectionMenu}>
                {sections.map((s, index) =>
                    <div
                        key={index}
                        className={concat(styles.menu,
                            activeSectionIndex === index && styles.active,
                            isUnclickable(s) && styles.unclickable
                        )}
                        style={{ paddingLeft: `${s.indent * 10}px` }}
                        onClick={() => changeSection(s, index)}>
                        <p>{s.title}</p>
                    </div>
                )}
            </div>
        </div >
    )
}

const ViewDirectory = ({ className, directory }) =>
    <div className={className}>
        {0 < (directory.imageURLs?.length || 0) &&
            <ImageCarousel className="mb-3" urls={directory.imageURLs} />}
        <h1>{directory.title}</h1>
        {parse(directory.content)}
    </div>

const Page = ({ ...props }) => {
    document.title = "View Projects";

    const [project, setProject] = useState(parseDir());
    const [currentProject, setCurrentProject] = useState(parseDir());

    const store = useStore();
    const dispatch = useDispatch();

    useEffect(() => {
        const id = props.match.params.id;
        const project = store[`directory-${id}`]?.value ?? {};
        setProject(project);
        console.log("Store", store);
        // setProject( ?? {});
    }, [store]);

    // eslint-disable-next-line
    useEffect(() => {
        const id = props.match.params.id
        console.log("finding dir", id);
        findDir(id)
    }, [props.match.params.id]);

    const findDir = async id => {
        const dirData = await findDirByID(id);
        console.log("dir found", dirData);
        updateCache(store, dispatch, `directory-${id}`, () => parseDir(dirData), true)
            .then(() =>
                updateCache(store, dispatch, `directory-${id}`, () => updateImageURLs(parseDir(dirData)), true)
            );
    };

    const findDirByID = async id => {
        const res = await Get(`/directory/${id}`);
        res.notify();
        if (res.success) return res.data;
        return {};
    }

    const updateImageURLs = async dir => {
        dir.imageURLs = (await Post("/file/find-urls", dir?.images ?? [])).data;
        dir.childrens = await Promise.all(dir.childrens.map(d => updateImageURLs(d)));
        return dir;
    }

    return (
        <Fragment>
            <Banner title="Project" className="mb-3" />
            <ContentPadding className="row">
                <SectionsMenu
                    className="col-3 pl-0"
                    project={project}
                    onChange={setCurrentProject} />
                <ViewDirectory
                    className="col-9 pr-0"
                    directory={currentProject} />
            </ContentPadding>
        </Fragment>
    );
}

export default Page;