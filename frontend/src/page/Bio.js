import React from 'react';
import { ProfileImage, Description, FunCard, TitleBreak } from "../content/BioContent";

const Page = () => {
    return (
        <React.Fragment>
            <div className="row mt-3">
                <ProfileImage className="col-12 col-sm-5 px-4" />
                <Description className="col-12 col-sm-7" />
            </div>
            <TitleBreak title="Fun Facts" className="mt-3" />
            <div className="row mt-4">
                <FunCard />
                <FunCard />
                <FunCard />
            </div>
        </React.Fragment>
    );
}

export default Page;