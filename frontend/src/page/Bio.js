import React, { useEffect, useState } from 'react';
import { ProfileImage, Description } from "../content/BioContent";
import { FunCard, FunCardBorderless } from "../component/card/FunCard";
import { TitleBreak } from "../component/decoration/TileBreaker";
import { Get } from "../axios/Axios";
import { useStore, useDispatch, updateCache } from "../store/CacheStore";

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

    const store = useStore();
    const dispatch = useDispatch();

    useEffect(() => {
        updateCache(store, dispatch, "myinfo", fetchFunction("/myinfo"));
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
        <React.Fragment>
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
        </React.Fragment>
    );
}
export default Page;