import { Fragment, useState, useEffect, useCallback, memo } from "react";
import { Banner } from "../component/decoration/Text";
import { Get, Post } from "../axios/Axios";
import { ImageCarousel } from "../component/carousel/Carousel";
import { useStore, useDispatch, updateCache } from "../store/CacheStore";
import { concat } from "../util/utils";
import ContentPadding from "./extra/ContentPadding";
import styles from "./styles.module.scss";
import Loader from "../component/loader/hash";
import { parse } from "../util/htmlParser";
import { useWindowSize } from "../util/hooks";
import { Err404 } from "./Error";

const parseDir = (dir) => {
  return {
    _id: dir?._id ?? "",
    type: dir?.type ?? "0",
    title: dir?.title ?? "",
    images: dir?.images ?? [],
    imageURLs: dir?.imageURLs ?? [],
    content: dir?.content ?? "",
    order: dir?.order ?? 0,
    childrens: dir?.childrens?.map((c) => parseDir(c)) ?? [],
  };
};

const SectionsMenu = ({ project, onChange, className, ...props }) => {
  const [sections, setSections] = useState([]);
  const [activeSectionIndex, setActiveSectionIndex] = useState(-1);

  const createSectionMenu = useCallback((section, indent = 0) => {
    if (!section) return [];
    const childrens =
      section.childrens?.reduce(
        (arr, s) => arr.concat(createSectionMenu(s, indent + 1)),
        []
      ) || [];
    section["indent"] = indent;
    delete section["childrens"];
    return [section].concat(childrens);
  }, []);

  const isUnclickable = (section) => {
    return !section || "" === section.content;
  };

  const changeSection = useCallback(
    (section, index) => {
      if (!section || "" === section.content) return;
      setActiveSectionIndex(index);
      onChange?.(section);
    },
    [onChange]
  );

  useEffect(() => {
    const menu = createSectionMenu(project);
    menu.splice(0, 1);
    setSections(menu);
    changeSection(menu[0], 0);
  }, [project, createSectionMenu, changeSection]);

  return (
    <div {...props} className={className}>
      <div className={styles.sectionMenu}>
        {sections.map((s, index) => (
          <div
            key={index}
            className={concat(
              styles.menu,
              activeSectionIndex === index ? styles.active : "",
              isUnclickable(s) ? styles.unclickable : ""
            )}
            style={{ paddingLeft: `${s.indent * 10}px` }}
            onClick={() => changeSection(s, index)}
          >
            <p>{s.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ViewDirectory = memo(({ directory }) => {
  return (
    <div className={styles.viewDirectory}>
      {0 < (directory.imageURLs?.length || 0) && (
        <ImageCarousel
          height="25rem"
          className="mb-3"
          urls={directory.imageURLs}
        />
      )}
      {parse(directory.content)}
    </div>
  );
});

const getProjectState = (id) => `project-dir-id-${id}`;

const Page = ({ ...props }) => {
  document.title = "View Projects";
  const id = props.match.params.id;

  const store = useStore();
  const dispatch = useDispatch();

  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(parseDir());
  const [currentProject, setCurrentProject] = useState(parseDir());
  const screen = useWindowSize();

  useEffect(() => {
    const project = JSON.parse(store[getProjectState(id)]?.value ?? "{}");
    if (Object.entries(project).length === 0) setLoading(true);
    else setLoading(false);
    setProject(project);
  }, [store, id]);

  // eslint-disable-next-line
  useEffect(() => {
    findDir(id);
  }, [id]);

  const findDir = async (id) => {
    const dirData = await findDirByID(id);
    if (dirData == null) {
      setNotFound(true);
      return;
    }
    const dirImgData = await updateImageURLs(parseDir(dirData));

    updateCache(store, dispatch, getProjectState(id), () =>
      JSON.stringify(dirImgData)
    ).then(() => setLoading(false));
  };

  const updateImageURLs = async (dir) => {
    const imagesID = dir?.images ?? [];
    if (imagesID.length > 0)
      dir.imageURLs = (await Post("/file/find-urls", imagesID)).data;
    else dir.imageURLs = [];
    dir.childrens = await Promise.all(
      dir.childrens.map((d) => updateImageURLs(d))
    );
    return dir;
  };

  const findDirByID = async (id) => {
    const res = await Get(`/directory/${id}`);
    if (res.success) return res.data;
    else return null;
  };

  if (notFound)
    return (
      <Fragment>
        <Banner title="Project" className="mb-3" />
        <Err404 message="Project not found !" />
      </Fragment>
    );
  return (
    <Fragment>
      <Banner
        title={project.title ? `Project - ${project.title}` : "Project"}
        className="mb-3"
      />
      <ContentPadding className={concat("row", screen.desktop ? "" : "px-3")}>
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <SectionsMenu
              className="col-12 col-sm-3 mb-4 px-0"
              project={project}
              onChange={setCurrentProject}
            />
            <ViewDirectory directory={currentProject} />
          </Fragment>
        )}
      </ContentPadding>
    </Fragment>
  );
};

export default Page;
