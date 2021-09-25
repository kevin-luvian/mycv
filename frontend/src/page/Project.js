import { Fragment, useState, useEffect } from 'react';
import { useStore, useDispatch, updateCache } from "../store/CacheStore";
import { Get, Post } from '../axios/Axios';
import { Banner } from '../component/decoration/Text';
import { DirectoryCard } from '../component/card/BlankCard';
import ContentPadding from "./extra/ContentPadding";

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

const Page = ({ ...props }) => {
    document.title = "View My Projects";

    const [projects, setProjects] = useState([]);

    const store = useStore();
    const dispatch = useDispatch();

    // useEffect(() => console.log("Project", projects), [projects]);
    // useEffect(() => console.log("Props", props), []);

    useEffect(() => {
        updateCache(store, dispatch, "project", fetchRoots, true);
        // eslint-disable-next-line
    }, []);

    useEffect(() => setProjects(store.project?.value ?? []), [store]);

    const fetchRoots = async () => {
        let data = [];
        const res = await Get("/directory/root");
        if (res.success) {
            data = await Promise.all(res.data.map(async dir => {
                dir = parseDir(dir);
                dir.imageURLs = (await Post("/file/find-urls", dir?.images ?? [])).data;
                return dir;
            }));
        }
        res.notify();
        return data;
    }

    return (
        <Fragment>
            <Banner title="Project" className="mb-3" />
            <ContentPadding>
                <div className="row">
                    {projects?.map((p, i) =>
                        <div key={i} className="col-6 mb-4">
                            <DirectoryCard
                                title={p.title}
                                imgUrls={p.imageURLs}
                                description={p.description}
                                readMore={() => props.history.push(`/project/${p._id}`)} />
                        </div>
                    )}
                </div>
            </ContentPadding>
        </Fragment>
    );
}

export default Page;