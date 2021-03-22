import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import List from "@material-ui/icons/List";
import styles from "./navbar.module.scss";
import $ from "jquery";
import MenuTracker from "./MenuTracker";
import { isTokenExpired } from "../../util/utils";
import { useStore } from "../../store/CVDataStore";

const publicMenu = [
    { name: "Home", url: "/", submenu: [] },
    { name: "Resume", url: "/resume", submenu: [] },
    {
        name: "Projects", url: "#", submenu: [
            { name: "WaWa", url: "/x" },
            { name: "Wowo", url: "/xz" }]
    },
    { name: "Contact", url: "/contact", submenu: [] },
    { name: "Test", url: "/test", submenu: [] },
    { name: "Login", url: "/login", submenu: [] },
];

const privateMenu = (function () {
    const privates = [
        { name: "Edit", url: "/edit", submenu: [] },
        { name: "Logout", url: "/logout", submenu: [] }
    ];
    return publicMenu.slice(0, publicMenu.length - 1).concat(privates);
})();

const Page = () => {
    const [menus, setMenus] = useState([]);
    const [displayMenu, setDisplayMenu] = useState(true);
    const currExpires = useSelector(store => store.auth.expires);

    const store = useStore();

    useEffect(() => MenuTracker.activateMenu(menus, window.location.pathname));

    useEffect(() => {
        const isExpired = isTokenExpired(currExpires);
        MenuTracker.clearActiveMenu();
        if (isExpired) setMenus(publicMenu);
        else setMenus(privateMenu);
    }, [currExpires]);

    function toggleDisplayMenu() {
        setDisplayMenu(!displayMenu);
        const links = $("#" + styles.links);
        if (displayMenu) {
            links.css("opacity", "1");
            links.css("transform", "translateY(0%)");
        } else {
            links.css("opacity", "0");
            links.css("transform", "translateY(-100%)");
        }
    }

    const firstName = () => store.fullname.split(" ")[0];
    const lastName = () => {
        const splitted = store.fullname.split(" ");
        if (splitted.length <= 1) return "";
        return splitted.slice(1, splitted.length).join(" ");
    }

    return (
        <nav id={styles.nav}>
            <div id={styles.toolbar}>
                <div id={styles.logoname}>
                    <Link to="/"><p id={styles.logo}>{store.fullname[0]}</p></Link>
                    <p id={styles.name}>{firstName()} <span>{lastName()}</span></p>
                </div>
                <div id={styles.links}>
                    {menus.map((menu, index) =>
                        <li key={index}>{MenuTracker.renderMenu(menu)}</li>
                    )}
                </div>
                <div id={styles.menubar}>
                    <List id={styles.snackbar} onClick={toggleDisplayMenu} />
                </div>
            </div>
        </nav>
    );
}

export default Page;