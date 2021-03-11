import React from 'react';
import { Link } from 'react-router-dom';
import ArrowDown from "@material-ui/icons/KeyboardArrowDown";
import styles from "./navbar.module.scss";
import $ from "jquery";

/**
 * wrap id with unique function signature
 * @param {string} id 
 * @returns {string} wrapped id
 */
const menuIDStr = (id) => { return "menuID" + id; }

/**
 * wrap id with unique function signature
 * @param {string} id 
 * @returns {string} wrapped id
 */
const menuULIDStr = (id) => { return "menuULID" + id; }

const MenuRenderer = {
    renderMenu(menu, callback) {
        const hasSubmenu = menu.submenu.length > 0;
        return (
            <React.Fragment>
                <Link to={menu.url} onClick={callback}>
                    <p id={menuIDStr(menu.name)} className={styles.menu}>
                        {menu.name} {hasSubmenu && <ArrowDown className={styles.arrow} />}
                    </p>
                </Link>
                {hasSubmenu && this.renderSubMenu(menu)}
            </React.Fragment>
        )
    },
    renderSubMenu(menu) {
        return (
            <ul id={menuULIDStr(menu.name)} className={styles.submenu}>
                {menu.submenu.map((smenu, i) =>
                    <li key={i} >
                        <Link to={smenu.url}>
                            <p id={menuIDStr(smenu.name)} className={styles.menu}>
                                {smenu.name}
                            </p>
                        </Link>
                    </li>
                )}
            </ul>
        )
    }
}

class MenuTracker {
    activeMenuID = "none";
    activeULID = "none";

    constructor() {
        console.log("Menutracker created");
    }

    findMenuName(menus, path) {
        for (let i = 0; i < menus.length; i++) {
            if (path === menus[i].url) return menus[i].name;
            for (let j = 0; j < menus[i].submenu.length; j++) {
                if (path === menus[i].submenu[j].url) return menus[i].submenu[j].name;
            }
        }
        return "none";
    }

    setActive(id, isActive) {
        if (isActive) $("#" + id).addClass(styles.active);
        else $("#" + id).removeClass(styles.active);
    }

    setMenuActive(name) {
        // clear previous
        this.setActive(menuIDStr(this.activeMenuID), false);

        if (this.activeMenuID !== name) this.activeMenuID = name;

        // update new
        this.setActive(menuIDStr(this.activeMenuID), true);
    }

    setMenuULActive(name) {
        // clear previous
        this.setActive(menuULIDStr(this.activeULID), false);

        if (this.activeULID !== name) this.activeULID = name;
        else this.activeULID = "none";

        // update new
        this.setActive(menuULIDStr(this.activeULID), true);
    }
}

const Singleton = (function () {
    let instance;

    return {
        getInstance() {
            if (!instance) instance = new MenuTracker();
            return instance;
        },
        clearActiveMenu() {
            this.getInstance().setMenuActive("none");
        },
        activateMenu(menus, path) {
            this.getInstance().setMenuActive(
                this.getInstance().findMenuName(menus, path)
            );
        },
        renderMenu(menu) {
            return MenuRenderer.renderMenu(menu,
                () => { this.getInstance().setMenuULActive(menu.name, 1) });
        }
    };
})();

export default Singleton;