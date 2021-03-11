import React from 'react';
import { Link } from "react-router-dom";

export const Err404 = () =>
    <div className="text-center my-5">
        <div className="container">
            <h2>404</h2>
            <p>Ooops! Something went wrong .</p>
            <Link to="/">Back to Home</Link>
        </div>
    </div>

const Exported = { Err404 };
export default Exported;