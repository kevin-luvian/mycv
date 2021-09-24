import { useEffect, useState } from 'react';
import { useStore, useDispatch, updateCache } from "../store/CacheStore";
import { FunCard, FunCardBorderless } from "../component/card/FunCard";
import { ProfileImage, Description } from "../content/BioContent";
import { TitleBreak } from "../component/decoration/TileBreaker";
import ContentPadding from "./extra/ContentPadding";
import { Get } from "../axios/Axios";

const fetchFunction = url => async () => {
    const res = await Get(url);
    res.notify();
    return res.data;
}

const Page = () => {
    document.title = "Home - My Bio";

    const [myInfo, setMyInfo] = useState({});
    const [whatIDos, setWhatIDos] = useState([]);
    const [funFacts, setFunFacts] = useState([]);

    // useEffect(() => console.log("myinfo", myInfo), [myInfo]);

    const store = useStore();
    const dispatch = useDispatch();

    useEffect(() => {
        updateCache(store, dispatch, "myinfo", fetchFunction("/myinfo"), true);
        updateCache(store, dispatch, "whatido", fetchFunction("/funInfo/0"));
        updateCache(store, dispatch, "funfact", fetchFunction("/funInfo/1"));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setMyInfo(store.myinfo?.value ?? {});
        setWhatIDos(store.whatido?.value ?? []);
        setFunFacts(store.funfact?.value ?? []);
    }, [store]);

    return (
        <ContentPadding>
            <div className="row my-3">
                <ProfileImage className="col-12 col-sm-5 px-4"
                    imageURL={myInfo.imageFile?.url} />
                <Description className="col-12 col-sm-7"
                    fullname={myInfo.fullname}
                    description={myInfo.description}
                    cvURL={myInfo.cvFile?.url} />
            </div>
            <TitleBreak title="What I Do" className="pt-3" />
            <div className="row mt-4">
                {whatIDos.map((val, index) =>
                    <FunCardBorderless
                        key={index}
                        title={val.title}
                        description={val.description}
                        icon={val.favicon} />
                )}
            </div>
            <TitleBreak title="Fun Facts" className="pt-3" />
            <div className="row mt-4">
                {funFacts.map((val, index) =>
                    <FunCard
                        key={index}
                        title={val.title}
                        description={val.description}
                        icon={val.favicon} />
                )}
            </div>
        </ContentPadding>
    );
}
export default Page;