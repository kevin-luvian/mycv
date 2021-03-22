import React, { useState } from "react";
import Button from "../../component/button/Button";
import Notification from "../../component/notification/Notification";
import FadingModal from "../../component/modal/FadingModal";
import {
    useStore
} from "../../store/CVDataStore";

const Page = () => {
    const [open, setOpen] = useState(false);
    const store = useStore();

    const send = () => {
        let message = "resume data sent";
        Notification.create(message, Notification.type.success);
    }

    return (
        <React.Fragment>
            <h2 className="mb-4">Edit Resume</h2>
            <Button onClick={() => setOpen(true)}>button</Button>
            <FadingModal open={open} onClose={() => setOpen(false)}>
                <h2>Transition modal</h2>
                <p>react-transition-group animates me.</p>
                <h3>my fullname: {store.fullname}</h3>
            </FadingModal>
            <Button className="w-100" onClick={send}>submit</Button>
        </React.Fragment>
    );
}

export default Page;