import { useEffect, useState, useRef, useCallback, Fragment } from "react";
import {
  icons,
  iconColors,
  ColoredIcon,
} from "../../component/decoration/Icons";
import { Divider } from "../../component/decoration/TileBreaker";
import { ImageCarousel } from "../../component/carousel/Carousel";
import Button from "../../component/button/Button";
import {
  TextInput,
  MultiTextInput,
  SearchFilterInput,
} from "../../component/input/Inputs";
import { Link } from "react-router-dom";
import { ChooseMultiFileInput } from "../../component/input/SearchFilterInput";
import { BlankCard } from "../../component/card/BlankCard";
import { SimpleValidation } from "../../component/modal/Modal";
import { Get, Delete, Post, Put } from "../../axios/Axios";
import styles from "./styles.module.scss";
import { parse } from "../../util/htmlParser";
import { cnord } from "../../util/utils";
import {
  DirectoriesCard,
  EditDirectoryCard,
} from "../../component/card/DirectoriesCard";

const parseDir = (dir) => ({
  _id: dir?._id ?? "",
  type: dir?.type ?? "0",
  title: dir?.title ?? "empty",
  images: dir?.images ?? [],
  imageURLs: [],
  content: dir?.content ?? "",
  order: dir?.order ?? 0,
  childrens: dir?.childrens?.map((c) => parseDir(c)) ?? [],
});

const SectionCard = ({ directory, onEdit, onDelete }) => {
  const deleteModalRef = useRef();

  return (
    <Fragment>
      <SimpleValidation
        ref={deleteModalRef}
        onContinue={() => onDelete(directory)}
      />
      <BlankCard className="mb-2">
        <div className="row">
          <p className="col-9">{directory.title}</p>
          <div className="col-3 text-right">
            <ColoredIcon
              icon={icons.edit}
              color={iconColors.warning}
              onClick={() => onEdit(directory)}
            />
            <ColoredIcon
              icon={icons.delete}
              color={iconColors.danger}
              onClick={() => deleteModalRef.current.open()}
            />
          </div>
        </div>
      </BlankCard>
    </Fragment>
  );
};

const EditPage = ({ id, changePage }) => {
  const [directory, setDirectory] = useState(parseDir());
  const [content, setContent] = useState(parse(""));

  useEffect(() => {
    getDirectoryInfo();
  }, [id]);
  useEffect(() => updateImageUrls(), [directory.images]);

  const updateDirectory = useCallback(
    (attr) => setDirectory((d) => ({ ...d, ...attr })),
    [setDirectory]
  );

  const updateImageUrls = useCallback(async () => {
    const res = await Post("/file/find-urls", directory?.images ?? []);
    if (res.success) updateDirectory({ imageURLs: res.data });
  }, [directory.images, updateDirectory]);

  const getDirectoryInfo = useCallback(async () => {
    const res = await Get(`/directory/${id}`);
    if (res.success) {
      const dir = parseDir(res.data);
      setDirectory(dir);
      setContent(parse(dir.content));
    }
    res.notify();
  }, [id]);

  useEffect(() => getDirectoryInfo(), [getDirectoryInfo]);
  useEffect(() => updateImageUrls(), [updateImageUrls]);

  const onUpdate = async () => {
    const res = await Put(`/directory/${directory._id}`, directory);
    if (res.success) {
      setContent(parse(directory.content));
      changePage(directory.title, directory._id);
    }
    res.notify();
  };

  const newSection = async () => {
    const res = await Post(`/directory/${directory._id}/new`);
    if (res.success) getDirectoryInfo();
    res.notify();
  };
  const editSection = (dir) => changePage(dir.title, dir._id);
  const deleteSection = async (dir) => {
    const res = await Delete(`/directory/${directory._id}/section/${dir._id}`);
    if (res.success) getDirectoryInfo();
    res.notify();
  };

  return (
    <Fragment>
      <h5>Section</h5>
      <div className="mb-3">
        {directory?.childrens.map((dir, index) => (
          <SectionCard
            key={index}
            directory={dir}
            onEdit={editSection}
            onDelete={deleteSection}
          />
        ))}
        <Button className="w-100" onClick={newSection}>
          New
        </Button>
      </div>

      <TextInput
        label="title"
        value={directory.title}
        onChange={(value) => updateDirectory({ title: value })}
      />

      <ChooseMultiFileInput
        label="images"
        className="mb-3"
        values={directory.images}
        onChange={(values) => updateDirectory({ images: values })}
      />

      <MultiTextInput
        label="content"
        rowsMax={20}
        value={directory.content}
        onChange={(value) => updateDirectory({ content: value })}
      />

      <Button className="w-100" onClick={() => onUpdate()}>
        Update
      </Button>

      <Divider className="my-5" />
      {cnord(directory.imageURLs?.length, 0) > 0 && (
        <ImageCarousel className="mb-3" urls={directory.imageURLs} />
      )}
      {content}
    </Fragment>
  );
};

const MainPage = ({ changePage }) => {
  const [rootDirs, setRootDirs] = useState([]);
  const [dirShown, setDirShown] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => fetchRoots, []);
  useEffect(() => updateDirShown, [search, rootDirs]);

  const updateDirShown = () =>
    setDirShown(rootDirs.filter((dir) => stringIncludes(dir.title, search)));

  const fetchRoots = useCallback(async () => {
    const res = await Get("/directory/root");
    res.notify();
    if (!res.success) return;
    const dirs = res.data.map(parseDir);
    setRootDirs(dirs);
    new Promise(async () => {
      const mDirs = await Promise.all(
        dirs.map(async (dir) => {
          dir.imageURLs = (
            await Post("/file/find-urls", dir?.images ?? [])
          ).data;
          return dir;
        })
      );
      setRootDirs(mDirs);
    });
  }, []);

  const stringIncludes = (strA = "", strB = "") =>
    strA.toLowerCase().includes(strB.toLowerCase());

  const onCreate = async () => {
    const res = await Post("/directory/new");
    if (res.success) fetchRoots();
    res.notify();
  };

  const onDelete = async (id) => {
    const res = await Delete("/directory/" + id);
    if (res.success) fetchRoots();
    res.notify();
  };

  const onEdit = (title, id) => {
    changePage(title, id);
  };

  // updating shown directory based on search result
  useEffect(
    () =>
      setDirShown(rootDirs.filter((dir) => stringIncludes(dir.title, search))),
    [search, rootDirs]
  );
  useEffect(() => fetchRoots(), [fetchRoots]);

  return (
    <Fragment>
      <div className="row my-3 p-0">
        <div className="col-8 col-lg-10">
          <SearchFilterInput
            placeholder="Search Files"
            onChange={(val) => setSearch(val)}
          />
        </div>
        <div className="col-4 col-lg-2">
          <Button className="w-100 h-100" onClick={onCreate}>
            Create
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <DirectoriesCard
          projects={dirShown}
          render={(project, i) => (
            <EditDirectoryCard
              key={i}
              title={project.title}
              imgUrls={project.imageURLs}
              description={project.content}
              readMoreURL={"/project/" + project._id}
              onEdit={() => onEdit(project.title, project._id)}
              onDelete={() => onDelete(project._id)}
            />
          )}
        />
      </div>
    </Fragment>
  );
};

const ViewPage = () => {
  const [previousDirectories, setPreviousDirectories] = useState([
    { title: "home", id: "" },
  ]);
  const [currentDirectory, setCurrentDirectory] = useState({
    title: "home",
    id: "",
  });

  const modifyPreviousDir = (title, id) => {
    let temp = previousDirectories;
    for (let i = 0; i < temp.length; i++) {
      if (id === temp[i].id) {
        temp = temp.slice(0, i);
        break;
      }
    }
    setPreviousDirectories([...temp, { title, id }]);
  };

  const changeDir = (title, id) => {
    modifyPreviousDir(title, id);
    setCurrentDirectory({ title, id });
  };

  return (
    <Fragment>
      <h2 className="mb-4">Edit Directory</h2>
      <div className="mb-3">
        {previousDirectories?.map((dir, index) => (
          <Link
            key={index}
            to="#"
            className={styles.links}
            onClick={() => changeDir(dir.title, dir.id)}
          >
            {" "}
            /{dir.title}
          </Link>
        ))}
      </div>
      {currentDirectory.id === "" ? (
        <MainPage changePage={changeDir} />
      ) : (
        <EditPage id={currentDirectory.id} changePage={changeDir} />
      )}
    </Fragment>
  );
};

export default ViewPage;
