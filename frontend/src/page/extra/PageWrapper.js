import React, { useEffect } from 'react';
import Navbar from '../../component/navbar/Navbar';
import styles from './styles.module.scss';
import themes from "../../style/themes";
import { concat } from "../../util/utils";
import { useStore, useDispatch, actions } from "../../store/ThemeStore";

const PageWrapper = ({ children }) => {
    document.title = "My CV";

    const store = useStore();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.setTheme(themes.ocean));
        window.setTimeout(() => dispatch(actions.setTheme(themes.forest)), 10000);
    }, [dispatch]);

    return (
        <div className={store.theme}>
            <div className={styles.root}>
                <div className={styles.canvas}>
                    <Navbar />
                    <div className={concat(styles.content, "col-12 col-md-10 mx-auto")}>
                        {children}
                    </div>
                    <div className={styles.footer}>
                        {/* <Divider className={styles.divider} /> */}
                        <p className={styles.copyright}>© 2020 All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageWrapper;