import { useEffect, useState, useRef, forwardRef, useImperativeHandle, Fragment } from "react";
import { icons } from "../../component/decoration/Icons";
import {
    IconInput,
    TextInput,
    OptionInput, optionItem
} from "../../component/input/Inputs";
import BlankCard from "../../component/card/BlankCard";
import { Oval as OvalBtn } from "../../component/button/Button";
import Notification from "../../component/notification/Notification";
import {
    SimpleValidation,
    SelectableModal,
    createSelectableElement
} from "../../component/modal/Modal";
import { Get, Delete, Post, Put } from "../../axios/Axios";

const emptyID = "";

const parseDir = (dir) => {
    return {
        _id: dir?._id ?? emptyID,
        type: dir?.type ?? '0',
        title: dir?.title ?? "empty",
        images: dir?.images ?? [],
        content: dir?.content ?? "",
        order: dir?.order ?? 0,
        childrens: dir?.childrens ?? []
    };
}

const ChooseRootDirIDInput = forwardRef(({ className, directory, onChange }, ref) => {
    useImperativeHandle(ref, () => ({
        refetch() { fetchRoots(); }
    }))
    const [rootDirs, setRootDirs] = useState([]);

    const modalRef = useRef();

    useEffect(() => fetchRoots(), []);

    const fetchRoots = async () => {
        const res = await Get("/directory");
        if (res.success) {
            const directories = res.data.map(dir => {
                const parsedDir = parseDir(dir);
                return createSelectableElement(parsedDir.title, parsedDir);
            })
            setRootDirs(directories);
        }
        res.notify();
    }

    const renderElement = (dir, isActive) =>
        <div>
            <p>{dir.title}</p>
            {isActive && <p>id: {dir._id}</p>}
        </div>

    const handleSelect = dir => onChange?.(dir);

    return (
        <div className={className}>
            <IconInput
                disabled
                label="Root ID"
                icon={icons.folderSharp}
                value={directory._id || ""}
                onClick={() => modalRef.current.open()} />

            <SelectableModal
                ref={modalRef}
                title="Find Icon"
                elements={rootDirs}
                numPerPage={100}
                onSelect={handleSelect}
                renderElement={renderElement} />
        </div>
    )
})

const typeOptions = [
    optionItem("public", 0),
    optionItem("private", 1),
    optionItem("hidden", 2),
]
const EditableDirectoryComponent = forwardRef(({ directory, isRoot, leftMargin }, ref) => {
    useImperativeHandle(ref, () => ({
        propagate() {
            if (isDeleted || Object.entries(state).length === 0) return null;
            if (!state?.childrens?.length > 0) return state;
            const childDirs = [];
            childRefs.current.forEach(cRef => {
                const dir = cRef?.propagate();
                if (dir) childDirs.push(dir);
            });
            return { ...state, childrens: childDirs };
        }
    }))

    const childRefs = useRef([]);
    const [state, setState] = useState({});
    const [isDeleted, setIsDeleted] = useState(false);

    const changeState = data => setState({ ...state, ...data });

    useEffect(() => setState(s => { return { ...s, ...parseDir(directory) } }), [directory]);

    const newChild = () => changeState({ childrens: state.childrens.concat([parseDir({})]) });

    const pushRef = (ref, index) => {
        if (childRefs.current.length <= index)
            childRefs.current.push(ref);
        childRefs.current[index] = ref;
    }

    if (isDeleted) return <Fragment />;
    return (
        <Fragment>
            <BlankCard className="p-4 mb-3" style={{ marginLeft: `${leftMargin ?? 0}px` }}>
                <TextInput
                    label="Title"
                    value={state?.title}
                    onChange={val => changeState({ title: val })} />
                <TextInput
                    label="Content"
                    value={state?.content}
                    onChange={val => changeState({ content: val })} />
                <OptionInput
                    label="Type"
                    selections={typeOptions}
                    value={state?.type ?? 0}
                    onChange={val => changeState({ type: val })} />
                <div className="text-center">
                    {!isRoot &&
                        <OvalBtn.Dark
                            className="mr-3"
                            onClick={() => setIsDeleted(true)}>Delete</OvalBtn.Dark>
                    }
                    <OvalBtn.Default onClick={newChild}>New Directory</OvalBtn.Default>
                </div>
            </BlankCard>
            {state?.childrens?.map((dir, index) =>
                <EditableDirectoryComponent
                    key={index}
                    directory={dir}
                    ref={ref => pushRef(ref, index)}
                    leftMargin={(leftMargin ?? 0) + 15} />
            )}
        </Fragment>
    )
})

const Page = () => {
    const rootRef = useRef();
    const chooseRootInputRef = useRef();
    const modalRefs = useRef([]);
    const [dir, setDir] = useState(parseDir({}));

    const postRoot = rootDirectory => Post("/directory", rootDirectory);
    const putRoot = rootDirectory => Put("/directory/" + rootDirectory._id, rootDirectory);
    const handleSumbit = async () => {
        const rootDir = rootRef.current.propagate();
        let res;
        if (dir._id === emptyID) res = await postRoot(rootDir);
        else res = await putRoot(rootDir);
        if (res.success) refreshData();
        res.notify();
    }
    const deleteRoot = async () => {
        Notification.create("deleting directory");
        const res = await Delete(`/directory/${dir._id}`);
        if (res.success) refreshData();
        res.notify();
    }
    const refreshData = () => {
        chooseRootInputRef.current.refetch();
        setDir(parseDir({}));
    }
    const resetRoot = () => setDir(parseDir());

    const pushRef = (ref, index) => {
        if (modalRefs.current.length <= index)
            modalRefs.current.push(ref);
        modalRefs.current[index] = ref;
    }

    const openModalRef = index => modalRefs.current[index].open();

    return (
        <Fragment>
            <SimpleValidation ref={ref => pushRef(ref, 0)}
                title="Reset this directory with empty value?"
                onContinue={resetRoot} />
            <SimpleValidation ref={ref => pushRef(ref, 1)}
                title="Permanently delete the whole directory?"
                onContinue={deleteRoot} />
            <SimpleValidation ref={ref => pushRef(ref, 2)}
                title="Save this directory?"
                onContinue={handleSumbit} />
            <h2 className="mb-4">Edit Directory</h2>
            <ChooseRootDirIDInput ref={chooseRootInputRef} directory={dir} onChange={setDir} />
            <EditableDirectoryComponent ref={rootRef} isRoot directory={dir} />
            <div className="text-center">
                <OvalBtn.Dark className="mr-3" onClick={() => openModalRef(0)}>Clear</OvalBtn.Dark>
                <OvalBtn.Danger className="mr-3" onClick={() => openModalRef(1)}>Delete</OvalBtn.Danger>
                <OvalBtn.Default onClick={() => openModalRef(2)}>Submit</OvalBtn.Default>
            </div>
        </Fragment>
    );
}

export default Page;