import React, { useState, useRef, Fragment, useEffect } from "react";
import Button from "../../component/button/Button";
import FadingModal from "../../component/modal/FadingModal";
import FavIconInput from "../../component/input/FavIconInput";
import { TextInput } from "../../component/input/Inputs";
import { Get, Delete, Post, Put } from "../../axios/Axios";
import { EditFunCardBorderless } from "../../component/card/FunCard";

const emptyContact = {
    title: "untitled",
    icon: "fa fa-home",
    description: "[ ... ]"
}

const Form = ({ id, reload }) => {
    const [contact, setContact] = useState({ title: "", icon: "", description: "" });

    useEffect(() => {
        if ("" === id)
            setContact(emptyContact);
        else
            Get(`/contact/${id}`)
                .then(res => res.success && setContact(res.data));
    }, [id]);

    const changeAttr = attr => setContact({ ...contact, ...attr });
    const onSubmit = async () => {
        if (id === "") await save();
        else await update();
        reload();
    }
    const save = () => Post("/contact", contact).then(res => res.notify());
    const update = () => Put(`/contact/${id}`, contact).then(res => res.notify());

    return (
        <Fragment>
            <h2 className="mb-4">{id === "" ? "Create" : "Edit"}</h2>
            <TextInput
                label="Title"
                value={contact.title}
                onChange={value => changeAttr({ title: value })} />
            <FavIconInput
                label="Icon"
                value={contact.icon}
                onChange={value => changeAttr({ icon: value })} />
            <TextInput
                label="Description"
                value={contact.description}
                onChange={value => changeAttr({ description: value })} />
            <Button className="w-100" onClick={onSubmit}>submit</Button>
        </Fragment>
    )
}

const Page = () => {
    const editModalRef = useRef();

    const [contacts, setContacts] = useState([]);
    const [editContactID, setEditContactID] = useState("");

    useEffect(() => getAll(), []);
    useEffect(() => console.log("contacts", contacts), [contacts]);

    const getAll = async () => {
        const res = await Get("/contact");
        if (res.success) setContacts(res.data);
        res.notify();
    }
    const editContact = id => {
        console.log("edit contact id", id)
        setEditContactID(id);
        editModalRef.current.open();
    }
    const deleteModal = async id => {
        const res = await Delete(`/contact/${id}`);
        if (res.success) getAll();
        res.notify();
    }
    return (
        <React.Fragment>
            <FadingModal ref={editModalRef}>
                <Form id={editContactID} reload={getAll} />
            </FadingModal>

            <h2 className="mb-4">Edit Contact</h2>
            {contacts.map((c, i) =>
                <EditFunCardBorderless
                    key={i}
                    title={c.title}
                    icon={c.icon}
                    description={c.description}
                    onUpdate={() => editContact(c._id)}
                    onDelete={() => deleteModal(c._id)} />
            )}
            <Button className="w-100 mb-3" onClick={() => editContact("")}>New</Button>
        </React.Fragment>
    );
}

export default Page;