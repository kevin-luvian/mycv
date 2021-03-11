import React, { useState, useEffect } from 'react';
import { ProfileImage, Description } from "../content/Bio";

const Page = () => {
    const [count] = useState(0);

    useEffect(() => {
        document.title = `You clicked ${count} times`;
    }, [count]);

    return (
        <React.Fragment>
            <div className="row">
                <ProfileImage className="col-12 col-sm-5 px-4" />
                <Description className="col-12 col-sm-7" />
            </div>
        </React.Fragment>
    );
}

export default Page;