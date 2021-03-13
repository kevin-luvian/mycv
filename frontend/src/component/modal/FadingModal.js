import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import styles from "./styles.module.scss";
import { chooseTheme } from "../../page/extra/PageWrapper";
import { concat } from "../../util/utils";

const FadingModal = ({ state, onClose, children, ...attr }) =>
    <Modal
        {...attr}
        open={state}
        className={concat(chooseTheme(), styles.modal)}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}>
        <Fade in={state}>
            <div className={styles.paper}>
                {children}
            </div>
        </Fade>
    </Modal>

export default FadingModal;