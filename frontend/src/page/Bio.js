import React, { useEffect, useState } from 'react';
import { ProfileImage, Description } from "../content/BioContent";
import { FunCard, FunCardBorderless } from "../component/card/FunCard";
import { TitleBreak } from "../component/decoration/TileBreaker";
import { Get } from "../axios/Axios";

const Page = () => {
    document.title = "Home - My Bio";

    const [myInfo, setMyInfo] = useState({});
    const [whatIDos, setWhatIDos] = useState([]);
    const [funFacts, setFunFacts] = useState([]);

    const fetchMyInfo = async () => {
        const res = await Get("/myinfo");
        if (res.success) setMyInfo(res.data);
        res.notify();
    }

    const fetchWIDO = async () => {
        const res = await Get("/funInfo/0");
        if (res.success) setWhatIDos(res.data);
    }

    const fetchFF = async () => {
        const res = await Get("/funInfo/1");
        if (res.success) setFunFacts(res.data);
    }

    useEffect(() => {
        fetchMyInfo();
        fetchWIDO();
        fetchFF();
    }, []);

    return (
        <React.Fragment>
            <div className="row my-3">
                <ProfileImage className="col-12 col-sm-5 px-4"
                    imageURL={myInfo?.imageFile?.url} />
                <Description className="col-12 col-sm-7"
                    fullname={myInfo.fullname}
                    description={myInfo.description}
                    cvURL={myInfo?.cvFile?.url} />
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