import React, { useState, useEffect } from 'react';
import Button from "../component/button/Button";

const Page = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        document.title = `You clicked ${count} times`;
    }, [count]);

    return (
        <React.Fragment>
            <h1>Resume Page</h1>
            <p>You clicked {count} times</p>
            <Button onClick={() => { setCount(count + 1) }}>counter</Button>
        </React.Fragment>
    );
}

export default Page;