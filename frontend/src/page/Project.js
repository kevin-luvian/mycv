import { Fragment, useState, useEffect, useCallback } from "react";
import { useStore, useDispatch, updateCache } from "../store/CacheStore";
import { Get, Post } from "../axios/Axios";
import { Banner } from "../component/decoration/Text";
import {
  DirectoriesCard,
  DirectoryCard,
} from "../component/card/DirectoriesCard";
import ContentPadding from "./extra/ContentPadding";
import Loader from "../component/loader/hash";
import styles from "./styles.module.scss";

const Page = () => {
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
    updateCache(store, dispatch, "project", fetchRoots, false).then(() =>
      setLoading(false)
    );
    // eslint-disable-next-line
  }, []);

  const fetchRoots = async () => {
    const res = await Get("/directory/root");
    res.notify();
    if (res.success) return res.data;
    return [];
  };

  return (
    <Fragment>
      <Banner title="Project" className="mb-3" />
      <ContentPadding className={styles.projectContainer}>
        {loading ? (
          <Loader />
        ) : (
          <DirectoriesCard
            projects={projects}
            render={(p, i) => (
              <DirectoryCard
                key={i}
                title={p.title}
                imgUrls={p.imageURLs}
                description={p.content}
                readMoreURL={`/project/${p._id}`}
              />
            )}
          />
        )}
      </ContentPadding>
    </Fragment>
  );
};

export default Page;
