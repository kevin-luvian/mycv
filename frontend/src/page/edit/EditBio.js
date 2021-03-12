import React, { useState } from "react";
import EditMenu from "./EditMenu";
import { createPageContext } from "../extra/Functions";
import {
    TextInput,
    NumberInput,
    MultiTextInput,
    HelpIconInput,
    OptionInput,
    optionItem
} from "../../component/input/Inputs";
import Button from "../../component/button/Button";
import Notification from "../../component/notification/Notification";
import { Post } from "../../axios/Axios";

const Page = () => {
    document.title = "Edit - change my biodata";

    const [fullname, setFullname] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState(0);
    const [gender, setGender] = useState(0);

    const genders = [
        optionItem("unspecified", 0),
        optionItem("male", 1),
        optionItem("female", 2),
        optionItem("other", 3)
    ];

    const composePayload = () => {
        return {
            fullname: fullname,
            phone: phone,
            gender: gender,
            address: address
        }
    }

    const send = () => {
        let message = "data sent";
        Notification.create(message, Notification.type.success);
        // Post("/bio", composePayload());
    }

    return (
        <EditMenu>
            <h1>Edit Biodata</h1>
            <p>Edit Meh</p>
            <TextInput
                className="col-5"
                label="fullname"
                value={fullname}
                onChange={setFullname} />

            <NumberInput
                className="col-10"
                label="phone number"
                value={phone}
                onChange={setPhone} />

            <MultiTextInput
                className="col-5"
                label="address"
                value={address}
                onChange={setAddress} />

            <OptionInput
                className="col-5"
                label="gender"
                selections={genders}
                value={gender}
                onChange={setGender} />

            <HelpIconInput
                className="col-5"
                label="fullname"
                value={fullname}
                onChange={setFullname}
                onClick={() => { console.log("icon clicked!!") }} />

            <div className="col-12 text-center">
                <Button onClick={send}>submit</Button>
            </div>
        </EditMenu>
    );
}

export default createPageContext("Bio", "/edit/bio", Page);