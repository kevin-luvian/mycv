import React, { useState } from "react";
import Button from "../../component/button/Button";
import Notification from "../../component/notification/Notification";
import FadingModal from "../../component/modal/FadingModal";

const Page = () => {
    document.title = "Edit - change my resume";

    const [open, setOpen] = useState(false);

    const send = () => {
        let message = "resume data sent";
        Notification.create(message, Notification.type.success);
        // Post("/bio", composePayload());
    }

    return (
        <React.Fragment>
            <h1>Edit Resume</h1>
            <Button onClick={() => setOpen(true)}>button</Button>
            <FadingModal state={open} onClose={() => setOpen(false)}>
                <h2>Transition modal</h2>
                <p>react-transition-group animates me.</p>
            </FadingModal>
            <Button className="w-100" onClick={send}>submit</Button>
        </React.Fragment>
    );
}

export default Page;