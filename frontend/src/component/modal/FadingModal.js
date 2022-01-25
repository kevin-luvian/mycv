import { useState, forwardRef, useImperativeHandle } from "react";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import styles from "./styles.module.scss";
import { concat } from "../../util/utils";
import { useStore } from "../../store/ThemeStore";
import { ColoredIcon, icons, iconColors } from "../decoration/Icons";

export const FadingModal = forwardRef(({ className, children, ...attr }, ref) => {
    const [open, setOpen] = useState(false);
    const store = useStore();

    useImperativeHandle(ref,
        () => ({
            open() { setOpen(true); },
            close() { setOpen(false); }
        }),
    )

    const closeModal = () => setOpen(false);

    return (
        <Modal
            {...attr}
            open={open}
            className={concat(store.theme, styles.modal, className)}
            onClose={closeModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}>
            <Fade in={open}>
                <div className={styles.paper}>
                    <ColoredIcon
                        className={styles.iclose}
                        color={iconColors.default}
                        icon={icons.close}
                        onClick={closeModal} />
                    <div className={styles.content}>
                        {children}
                    </div>
                </div>
            </Fade>
        </Modal>
    )
});

export default FadingModal;