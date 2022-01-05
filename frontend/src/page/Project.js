import { Fragment, useState, useEffect } from "react";
import { useStore, useDispatch, updateCache } from "../store/CacheStore";
import { Get, Post } from "../axios/Axios";
import { Banner } from "../component/decoration/Text";
import { DirectoryCard } from "../component/card/BlankCard";
import ContentPadding from "./extra/ContentPadding";
import Loader from "../component/loader/hash";

const parseDir = (dir) => {
  return {
    _id: dir?._id ?? "",
    type: dir?.type ?? "0",
    title: dir?.title ?? "empty",
    images: dir?.images ?? [],
    imageURLs: [],
    content: dir?.content ?? "",
    order: dir?.order ?? 0,
    childrens: dir?.childrens?.map((c) => parseDir(c)) ?? [],
  };
};

const Page = ({ ...props }) => {
  document.title = "View My Projects";

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const store = useStore();
  const dispatch = useDispatch();

  useEffect(() => {
    const projects = store.project?.value ?? [];
    if (projects.length === 0) setLoading(true);
    setProjects(projects);
  }, [store]);

  useEffect(() => {
    updateCache(store, dispatch, "project", fetchRoots, false);
    // eslint-disable-next-line
  }, []);

  const fetchRoots = async () => {
    const res = await Get("/directory/root");
    res.notify();
    if (res.success) {
      updateCache(store, dispatch, "project", fetchImages(res.data), true).then(
        () => setLoading(false)
      );
      return res.data;
    } else {
      return [];
    }
  };

  const fetchImages = (rootDirs) => async () =>
    Promise.all(
      rootDirs.map(async (dir) => {
        dir = parseDir(dir);
        dir.imageURLs = (await Post("/file/find-urls", dir?.images ?? [])).data;
        return dir;
      })
    );

  return (
    <Fragment>
      <Banner title="Project" className="mb-3" />
      {loading ? (
        <Loader />
      ) : (
        <ContentPadding>
          <div className="row">
            {projects?.map((p, i) => (
              <div key={i} className="col-12 col-md-6 mb-4">
                <DirectoryCard
                  title={p.title}
                  imgUrls={p.imageURLs}
                  description={p.content}
                  readMore={() => props.history.push(`/project/${p._id}`)}
                />
              </div>
            ))}
          </div>
        </ContentPadding>
      )}
    </Fragment>
  );
};

export default Page;
