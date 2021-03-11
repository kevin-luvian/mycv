import styles from './button.module.scss';
import Util from '../../util/utils';

export function Basic({ className, children, ...attr }) {
    return (
        <button
            {...attr}
            className={Util.concat(styles.button, styles.colorDefault, className)}>
            {children}
        </button>
    );
};

export const OvalType = {
    primary: 1,
    secondary: 2
}
export function Oval({ type, className, children, ...attr }) {
    const styleType = (() => {
        switch (type) {
            case OvalType.primary:
                return styles.ovalColorPrimary;
            case OvalType.secondary:
                return styles.ovalColorSecondary;
            default:
                return styles.ovalColorDefault;
        }
    })();
    return (
        <button
            {...attr}
            className={Util.concat(styles.button, styles.oval, styleType, className)}>
            {children}
        </button>
    );
}

export default Basic;