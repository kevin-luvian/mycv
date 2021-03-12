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

export const Oval = {
    Default: ({ className, ...attr }) =>
        <OvalElement {...attr}
            className={Util.concat(className, styles.ovalColorDefault)} />,
    Primary: ({ className, ...attr }) =>
        <OvalElement {...attr}
            className={Util.concat(className, styles.ovalColorPrimary)} />,
    Secondary: ({ className, ...attr }) =>
        <OvalElement {...attr}
            className={Util.concat(className, styles.ovalColorSecondary)} />
};

const OvalElement = ({ className, children, ...attr }) => (
    <button
        {...attr}
        className={Util.concat(styles.button, styles.oval, className)}>
        {children}
    </button>
);

export default Basic;