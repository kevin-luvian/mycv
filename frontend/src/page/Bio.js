import { useEffect, useState } from "react";
import { useStore, useDispatch, updateCache } from "../store/CacheStore";
import { FunCard, FunCardBorderless } from "../component/card/FunCard";
import { ProfileImage, Description } from "../content/BioContent";
import { TitleBreak } from "../component/decoration/TileBreaker";
import ContentPadding from "./extra/ContentPadding";
import { Get } from "../axios/Axios";
import Loader from "../component/loader/hash";
import { concat } from "../util/utils";
import { useWindowSize } from "../util/hooks";

const fetchFunction =
  (url, notify = true) =>
  async () => {
    const res = await Get(url);
    if (notify) res.notify();
    return res.data;
  };

const Page = () => {
  document.title = "Home - My Bio";

  const [loading, setLoading] = useState(true);
  const [myInfo, setMyInfo] = useState({});
  const [whatIDos, setWhatIDos] = useState([]);
  const [funFacts, setFunFacts] = useState([]);

  const store = useStore();
  const dispatch = useDispatch();
  const screen = useWindowSize();

  useEffect(() => {
    Promise.all([
      updateCache(
        store,
        dispatch,
        "myinfo",
        fetchFunction("/myinfo", false),
        true
      ),
      updateCache(store, dispatch, "whatido", fetchFunction("/funInfo/0")),
      updateCache(store, dispatch, "funfact", fetchFunction("/funInfo/1")),
    ]).then(() => setTimeout(setLoading(false), 100));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const myInfo = store.myinfo?.value ?? {};
    const widos = store.whatido?.value ?? [];
    const ffacts = store.funfact?.value ?? [];
    if (Object.entries(myInfo).length + widos.length + ffacts.length > 0) {
      setLoading(false);
    }
    setMyInfo(myInfo);
    setWhatIDos(widos);
    setFunFacts(ffacts);
  }, [store]);

  if (loading)
    return (
      <ContentPadding className="row">
        <Loader />
      </ContentPadding>
    );
  return (
    <ContentPadding className={concat(!screen.desktop ? "px-3" : "")}>
      <div className="row my-3">
        <ProfileImage
          className="col-12 col-sm-5 px-4"
          imageURL={myInfo.imageFile?.url}
        />
        <Description
          className={concat("col-12 col-sm-7", screen.mobile ? "py-5" : "")}
          fullname={myInfo.fullname}
          description={myInfo.description}
          cvURL={myInfo.cvFile?.url}
        />
      </div>
      <TitleBreak title="What I Do" className="pt-3" />
      <div className="row mt-4">
        {whatIDos.map((val, index) => (
          <FunCardBorderless
            key={index}
            title={val.title}
            description={val.description}
            icon={val.favicon}
            className="col-12 col-sm-6 col-lg-4"
          />
        ))}
      </div>
      <TitleBreak
        title="Fun Facts"
        className={concat("pt-3", screen.mobile ? "mt-5" : "")}
      />
      <div className="row mt-4">
        {funFacts.map((val, index) => (
          <FunCard
            key={index}
            title={val.title}
            description={val.description}
            icon={val.favicon}
          />
        ))}
      </div>
    </ContentPadding>
  );
};
export default Page;
