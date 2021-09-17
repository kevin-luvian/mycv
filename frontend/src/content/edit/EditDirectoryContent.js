import { useEffect, useState, useRef, forwardRef, useImperativeHandle, Fragment, useCallback } from "react";
import { icons } from "../../component/decoration/Icons";
import Button from "../../component/button/Button";
import FindInPageIcon from '@material-ui/icons/FindInPage';
import {
    IconInput,
    TextInput,
    MultiTextInput,
    OptionInput,
    optionItem,
    SearchFilterInput
} from "../../component/input/Inputs";
import { BlankCard, DirectoryCard, EditDirectoryCard } from "../../component/card/BlankCard";
import { Get, Delete, Post, Put } from "../../axios/Axios";
import styles from "./styles.module.scss";

const parseDir = (dir) => {
    return {
        _id: dir?._id ?? "",
        type: dir?.type ?? '0',
        title: dir?.title ?? "empty",
        images: dir?.images ?? [],
        content: dir?.content ?? "",
        order: dir?.order ?? 0,
        childrens: dir?.childrens ?? []
    };
}

const EditPage = ({ id, changePage }) => {
    const [directory, setDirectory] = useState(parseDir());

    useEffect(() => getDirectoryInfo(), []);

    const updateDirectory = (attr) => setDirectory({ ...directory, ...attr });

    const getDirectoryInfo = async () => {
        const res = await Get("/directory/" + id);
        if (res.success) setDirectory(parseDir(res.data));
        res.notify();
    }

    return (
        <Fragment>

            <TextInput
                label="title"
                value={directory.title}
                onChange={value => updateDirectory({ title: value })} />

            <MultiTextInput
                label="content"
                rowsMax={10}
                value={directory.content}
                onChange={value => updateDirectory({ content: value })} />

            <p>{directory?._id}</p>
            <p>{directory?.title}</p>
            <p>{directory?.content}</p>
            <p>{directory?.type}</p>
        </Fragment>
    )
}

const MainPage = ({ changePage }) => {
    const [rootDirs, setRootDirs] = useState([]);
    const [dirShown, setDirShown] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => fetchRoots(), []);
    // useEffect(() => console.log(rootDirs), [rootDirs]);
    useEffect(() => updateDirShown(), [search, rootDirs]);

    const fetchRoots = async () => {
        const res = await Get("/directory/root");
        if (res.success) {
            console.log(res.data);
            setRootDirs(res.data.map(dir => parseDir(dir)));
        }
        res.notify();
    }

    const stringIncludes = (strA = "", strB = "") =>
        strA.toLowerCase().includes(strB.toLowerCase());

    const updateDirShown = () => {
        setDirShown(rootDirs.filter(dir => stringIncludes(dir.title, search)));
        console.log("updating dir shown")
    }

    const onCreate = async () => {
        const res = await Post("/directory/new");
        if (res.success) fetchRoots();
        res.notify();
    }

    const onDelete = async id => {
        const res = await Delete("/directory/" + id);
        if (res.success) fetchRoots();
        res.notify();
    }

    const onEdit = (title, id) => { changePage(title, id) }

    return (
        <Fragment>
            <div className="row my-3 p-0">
                <div className="col-10">
                    <SearchFilterInput
                        placeholder="Search Files"
                        onChange={val => setSearch(val)} />
                </div>
                <div className="col-2">
                    <Button className="w-100 h-100" onClick={onCreate}>Create</Button>
                </div>
            </div>

            <div className="row">
                {dirShown?.map((dir, index) =>
                    <div key={index} className="col-6 px-3">
                        <EditDirectoryCard
                            className="mb-3"
                            title={dir.title}
                            imgUrls={dir.images}
                            description={dir.content}
                            onEdit={() => onEdit(dir.title, dir._id)}
                            onDelete={() => onDelete(dir._id)} />
                    </div>
                )}
            </div>
        </Fragment>
    );
}

const ViewPage = () => {
    const [previousDirectories, setPreviousDirectories] = useState([{ title: "home", id: "" }]);
    const [currentDirectory, setCurrentDirectory] = useState({ title: "home", id: "" });

    useEffect(() => console.log(previousDirectories), [previousDirectories]);
    // useEffect(() => modifyPreviousDir, [currentDirectory]);

    const modifyPreviousDir = (title, id) => {
        for (let i = 0; i < previousDirectories.length; i++) {
            if (id === previousDirectories[i].id) {
                setPreviousDirectories(previousDirectories.slice(0, i + 1));
                return
            }
        }
        setPreviousDirectories([...previousDirectories, { title, id }]);
    }

    const changeDir = (title, id) => {
        modifyPreviousDir(title, id)
        setCurrentDirectory({ title, id });
    }

    return (
        <Fragment>
            <h2 className="mb-4">Edit Directory</h2>
            <div className="mb-3">
                {previousDirectories?.map((dir, index) =>
                    <a key={index} onClick={() => changeDir(dir.title, dir.id)}> /{dir.title}</a>)}
            </div>
            {currentDirectory.id === "" ?
                <MainPage changePage={changeDir} /> :
                <EditPage id={currentDirectory.id}
                    changePage={changeDir} />}
        </Fragment>
    )
}

export default ViewPage;