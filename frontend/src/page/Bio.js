import React, { useEffect, useState } from 'react';
import { ProfileImage, Description } from "../content/BioContent";
import FunCard from "../component/card/FunCard";
import BorderlessCard from "../component/card/BorderlessCard";
import { TitleBreak } from "../component/decoration/TileBreaker";
import { Get } from "../axios/Axios";

const Page = () => {
    document.title = "Home - My Bio";

    const [myInfo, setMyInfo] = useState({});

    const fetchMyInfo = async () => {
        const res = await Get("/myinfo");
        if (res.success) {
            setMyInfo(res.data);
            console.log("data", res.data);
        }
        res.notify();
    }

    useEffect(() => fetchMyInfo(), []);

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
                <BorderlessCard />
                <BorderlessCard />
                <BorderlessCard />
            </div>
            <TitleBreak title="Fun Facts" className="pt-3" />
            <div className="row mt-4">
                <FunCard />
                <FunCard />
                <FunCard />
            </div>
        </React.Fragment>
    );
}
export default Page;