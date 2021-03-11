import React, { useState, useEffect } from 'react';
import { ProfileImage, Description, FunCard } from "../content/BioContent";

const Page = () => {
    const [count] = useState(0);

    useEffect(() => {
        document.title = `You clicked ${count} times`;
    }, [count]);

    return (
        <React.Fragment>
            <div className="row mt-3">
                <ProfileImage className="col-12 col-sm-5 px-4" />
                <Description className="col-12 col-sm-7" />
            </div>
            <div className="row mt-5">
                <FunCard className="col" />
                <FunCard className="col" />
                <FunCard className="col" />
            </div>
        </React.Fragment>
    );
}

export default Page;