import React from 'react';
import { ProfileImage, Description } from "../content/BioContent";
import FunCard from "../component/card/FunCard";
import BorderlessCard from "../component/card/BorderlessCard";
import { TitleBreak } from "../component/decoration/TileBreaker";

const Page = () => {
    document.title = "Home - My Bio";

    return (
        <React.Fragment>
            <div className="row my-3">
                <ProfileImage className="col-12 col-sm-5 px-4" />
                <Description className="col-12 col-sm-7" />
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