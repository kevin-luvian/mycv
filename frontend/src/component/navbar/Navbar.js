import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import List from "@material-ui/icons/List";
import styles from "./navbar.module.scss";
import $ from "jquery";
import MenuTracker from "./MenuTracker";
import Util from "../../util/utils";

const publicMenu = [
    { name: "Home", url: "/", submenu: [] },
    { name: "Resume", url: "/resume", submenu: [] },
    {
        name: "Projects", url: "#", submenu: [
            { name: "WaWa", url: "/x" },
            { name: "Wowo", url: "/xz" }]
    },
    { name: "Contact", url: "/contact", submenu: [] },
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

    useEffect(() => {
        MenuTracker.activateMenu(menus, window.location.pathname);
        // console.log("path", window.location.pathname);
    });

    useEffect(() => {
        const isExpired = Util.isTokenExpired(currExpires);
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

    return (
        <nav id={styles.nav}>
            <div id={styles.toolbar}>
                <div id={styles.logoname}>
                    <Link to="/"><p id={styles.logo}>K</p></Link>
                    <p id={styles.name}>Kevin <span>Luvian H</span></p>
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