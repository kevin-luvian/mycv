import React from 'react';
import { Link } from 'react-router-dom';
import ArrowDown from "@material-ui/icons/KeyboardArrowDown";
import styles from "./navbar.module.scss";
import $ from "jquery";

class MenuTracker {
    isPublic = true;
    activeMenuID = "id";
    activeULID = "id";

    findMenu(menus, path) {
        for (let i = 0; i < menus.length; i++) {
            if (path === menus[i].url) return menus[i];
            for (let j = 0; j < menus[i].submenu.length; j++) {
                if (path === menus[i].submenu[j].url) return menus[i].submenu[j];
            }
        }
        return null;
    }
    renderMenu(menu) {
        const hasSubmenu = menu.submenu.length > 0;
        return (
            <React.Fragment>
                <Link to={menu.url} onClick={() => { this.setMenuULActive(menu) }}>
                    <p id={this.menuIDStr(menu.name)} className={styles.menu}>
                        {menu.name} {hasSubmenu && <ArrowDown style={{ fontSize: "1.3rem" }} />}
                    </p>
                </Link>
                {hasSubmenu && this.renderSubMenu(menu)}
            </React.Fragment>
        )
    }
    renderSubMenu(menu) {
        return (
            <ul id={this.menuULIDStr(menu.name)} className={styles.submenu}>
                {menu.submenu.map((smenu, i) =>
                    <li key={i} >
                        <Link to={smenu.url}>
                            <p id={this.menuIDStr(smenu.name)} className={styles.menu}>
                                {smenu.name}
                            </p>
                        </Link>
                    </li>
                )}
            </ul>
        )
    }

    setActive(id, isActive) {
        if (isActive) $("#" + id).addClass(styles.active);
        else $("#" + id).removeClass(styles.active);
    }

    menuIDStr(id) { return "menuID" + id; }
    setMenuActive(menu) {
        // clear previous
        this.setActive(this.menuIDStr(this.activeMenuID), false);

        if (!menu) this.activeMenuID = "id"
        else if (menu.name !== this.activeMenuID) this.activeMenuID = menu.name;

        // update new
        this.setActive(this.menuIDStr(this.activeMenuID), true);
    }

    menuULIDStr(id) { return "menuULID" + id; }
    setMenuULActive(menu) {
        // clear previous
        this.setActive(this.menuULIDStr(this.activeULID), false);

        if (menu.name !== this.activeULID) this.activeULID = menu.name;
        else this.activeULID = "id"

        // update new
        this.setActive(this.menuULIDStr(this.activeULID), true);
    }
}

const Singleton = (function () {
    let instance;

    function createInstance() {
        let object = new MenuTracker();
        return object;
    }

    return {
        getInstance() {
            if (!instance) instance = createInstance();
            return instance;
        },
        clearActiveMenu() {
            this.getInstance().setMenuActive("none");
        },
        activateMenu(menus, path) {
            this.getInstance().setMenuActive(
                this.getInstance().findMenu(menus, path)
            );
        },
        renderMenu(menu) {
            return this.getInstance().renderMenu(menu);
        }
    };
})();

export default Singleton;