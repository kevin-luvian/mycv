import React, { useEffect } from 'react';
import Navbar from '../../component/navbar/Navbar';
import styles from './styles.module.scss';
import themes from "../../style/themes";
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
                    {children}
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