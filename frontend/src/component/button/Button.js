import styles from './button.module.scss';
import { concat } from '../../util/utils';

export const Basic = {
    Default: ({ className, ...attr }) =>
        <BasicElement {...attr} className={concat(className, styles.colorDefault)} />,
    Warning: ({ className, ...attr }) =>
        <BasicElement {...attr} className={concat(className, styles.colorWarning)} />,
    Danger: ({ className, ...attr }) =>
        <BasicElement {...attr} className={concat(className, styles.colorDanger)} />
};

export function BasicElement({ className, children, ...attr }) {
    return (
        <button {...attr} className={concat(styles.button, className)}>
            {children}
        </button>
    );
};

export const Oval = {
    Default: ({ className, ...attr }) =>
        <OvalElement {...attr} className={concat(className, styles.colorDefault)} />,
    Primary: ({ className, ...attr }) =>
        <OvalElement {...attr} className={concat(className, styles.colorPrimary)} />,
    Secondary: ({ className, ...attr }) =>
        <OvalElement {...attr} className={concat(className, styles.colorSecondary)} />
};

const OvalElement = ({ className, children, ...attr }) => (
    <button {...attr} className={concat(styles.button, styles.oval, className)}>
        {children}
    </button>
);

export default Basic.Default;