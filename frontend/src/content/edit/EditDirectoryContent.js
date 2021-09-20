import { useEffect, useState, useRef, forwardRef, useImperativeHandle, Fragment, useCallback } from "react";
import { icons, iconColors, ColoredIcon } from "../../component/decoration/Icons";
import { Divider } from "../../component/decoration/TileBreaker";
import { ImageCarousel } from "../../component/carousel/Carousel";
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
import { ChooseMultiFileInput } from "../../component/input/SearchFilterInput";
import { BlankCard, DirectoryCard, EditDirectoryCard } from "../../component/card/BlankCard";
import { SimpleValidation } from "../../component/modal/Modal";
import BorderlessCard from "../../component/card/BorderlessCard";
import { Get, Delete, Post, Put } from "../../axios/Axios";
import styles from "./styles.module.scss";

const parseDir = (dir) => {
    return {
        _id: dir?._id ?? "",
        type: dir?.type ?? '0',
        title: dir?.title ?? "empty",
        images: dir?.images ?? [],
        imageURLs: [],
        content: dir?.content ?? "",
        order: dir?.order ?? 0,
        childrens: dir?.childrens?.map(c => parseDir(c)) ?? []
    };
}

const SectionCard = ({ directory, onEdit, onDelete }) => {
    const deleteModalRef = useRef();

    return (
        <Fragment>
            <SimpleValidation ref={deleteModalRef} onContinue={() => onDelete(directory)} />
            <BlankCard className="mb-2">
                <div className="row">
                    <p className="col-9">{directory.title}</p>
                    <div className="col-3 text-right">
                        <ColoredIcon
                            icon={icons.edit}
                            color={iconColors.warning}
                            onClick={() => onEdit(directory)} />
                        <ColoredIcon
                            icon={icons.delete}
                            color={iconColors.danger}
                            onClick={() => deleteModalRef.current.open()} />
                    </div>
                </div>
            </BlankCard>
        </Fragment>
    )
}

const EditPage = ({ id, changePage }) => {
    const [directory, setDirectory] = useState(parseDir());

    useEffect(() => getDirectoryInfo(), [id]);
    useEffect(() => console.log(directory), [directory.images]);
    useEffect(() => updateImageUrls(), [directory.images]);

    const updateDirectory = (attr) => setDirectory({ ...directory, ...attr });

    const updateImageUrls = async () => {
        const res = await Post("/file/find-urls", directory?.images ?? []);
        updateDirectory({ imageURLs: res.data });
    }

    const getDirectoryInfo = async () => {
        const res = await Get(`/directory/${id}`);
        if (res.success) setDirectory(parseDir(res.data));
        res.notify();
    }

    const onUpdate = async () => {
        const res = await Put(`/directory/${directory._id}`, directory);
        if (res.success) changePage(directory.title, directory._id);
        res.notify();
    }

    const newSection = async () => {
        const res = await Post(`/directory/${directory._id}/new`);
        if (res.success) getDirectoryInfo();
        res.notify();
    }
    const editSection = dir => changePage(dir.title, dir._id);
    const deleteSection = async dir => {
        const res = await Delete(`/directory/${directory._id}/section/${dir._id}`);
        if (res.success) getDirectoryInfo();
        res.notify();
    }

    return (
        <Fragment>
            <h5>Section</h5>
            <div className="mb-3">
                {directory?.childrens.map((dir, index) =>
                    <SectionCard
                        key={index}
                        directory={dir}
                        onEdit={editSection}
                        onDelete={deleteSection} />
                )}
                <Button className="w-100" onClick={newSection}>New</Button>
            </div>

            <TextInput
                label="title"
                value={directory.title}
                onChange={value => updateDirectory({ title: value })} />

            <ChooseMultiFileInput
                label="images"
                className="mb-3"
                values={directory.images}
                onChange={values => updateDirectory({ images: values })} />

            <MultiTextInput
                label="content"
                rowsMax={10}
                value={directory.content}
                onChange={value => updateDirectory({ content: value })} />

            <Button className="w-100" onClick={onUpdate}>Update</Button>

            <Divider className="my-5" />

            <ImageCarousel className="mb-3" urls={directory.imageURLs} />
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
            const dirs = await Promise.all(res.data.map(async dir => {
                dir = parseDir(dir);
                dir.imageURLs = (await Post("/file/find-urls", dir?.images ?? [])).data;
                return dir;
            }));
            setRootDirs(dirs);
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
                            imgUrls={dir.imageURLs}
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
        let temp = previousDirectories;
        for (let i = 0; i < temp.length; i++) {
            if (id === temp[i].id) {
                temp = temp.slice(0, i);
                break;
            }
        }
        setPreviousDirectories([...temp, { title, id }]);
    }

    const changeDir = (title, id) => {
        console.log("changing dir", title, id)
        modifyPreviousDir(title, id)
        setCurrentDirectory({ title, id });
    }

    return (
        <Fragment>
            <h2 className="mb-4">Edit Directory</h2>
            <div className="mb-3">
                {previousDirectories?.map((dir, index) =>
                    <a key={index}
                        className={styles.links}
                        onClick={() => changeDir(dir.title, dir.id)}> /{dir.title}
                    </a>)}
            </div>
            {currentDirectory.id === "" ?
                <MainPage changePage={changeDir} /> :
                <EditPage id={currentDirectory.id}
                    changePage={changeDir} />}
        </Fragment>
    )
}

export default ViewPage;