import React from 'react';
import Navbar from '../../component/navbar/Navbar';
import styles from './styles.module.scss';

function chooseTheme() {
    return "themeocean";
};

class PageWrapper extends React.Component {
    render() {
        document.title = "My CV";
        return (
            <div className={chooseTheme()}>
                <div className={styles.root}>
                    <div className={styles.canvas}>
                        <Navbar />
                        <div className={styles.content + " col-12 col-md-10 mx-auto"}>{this.props.children}</div>
                        <div className={styles.footer}>
                            {/* <Divider className={styles.divider} /> */}
                            <p className={styles.copyright}>© 2020 All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default PageWrapper;