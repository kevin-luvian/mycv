import { Fragment, useState, useEffect, useCallback } from "react";
import { Banner } from "../component/decoration/Text";
import { Get, Post } from "../axios/Axios";
import { ImageCarousel } from "../component/carousel/Carousel";
import { concat } from "../util/utils";
import ContentPadding from "./extra/ContentPadding";
import styles from "./styles.module.scss";
import parse from "html-react-parser";
import Loader from "../component/loader/hash";

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
              activeSectionIndex === index && styles.active,
              isUnclickable(s) && styles.unclickable
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

const ViewDirectory = ({ className, directory }) => (
  <div className={className}>
    {0 < (directory.imageURLs?.length || 0) && (
      <ImageCarousel height="30rem" className="mb-3" urls={directory.imageURLs} />
    )}
    <h1>{directory.title}</h1>
    {parse(directory.content)}
  </div>
);

const Page = ({ ...props }) => {
  document.title = "View Projects";

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(parseDir());
  const [currentProject, setCurrentProject] = useState(parseDir());

  // eslint-disable-next-line
  useEffect(() => {
    const id = props.match.params.id;
    findDir(id);
  }, [props.match.params.id]);

  const findDir = async (id) => {
    setLoading(true);
    const dirData = await findDirByID(id);
    const dirImgData = await updateImageURLs(parseDir(dirData));
    setProject(dirImgData);
    setLoading(false);
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
    return {};
  };

  return (
    <Fragment>
      <Banner title="Project" className="mb-3" />
      <ContentPadding className="row">
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <SectionsMenu
              className="col-3 pl-0"
              project={project}
              onChange={setCurrentProject}
            />
            <ViewDirectory className="col-9 pr-0" directory={currentProject} />
          </Fragment>
        )}
      </ContentPadding>
    </Fragment>
  );
};

export default Page;
