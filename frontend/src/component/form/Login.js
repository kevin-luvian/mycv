import { useState } from 'react';
import styles from "./forms.module.scss";

import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";

import PersonOutlineRoundedIcon from "@material-ui/icons/PersonOutlineRounded";
import LockOpenRoundedIcon from "@material-ui/icons/LockOpenRounded";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

export const UsernameInput = ({ value, onChange }) => {
    return (
        <div className={styles.form}>
            <PersonOutlineRoundedIcon className={styles.icon} />
            <TextField
                className={styles.field}
                label="Username"
                value={value}
                onChange={(elem) => onChange(elem.target.value)}
            />
        </div>
    )
}

export const PasswordInput = ({ value, onChange }) => {
    const [show, setShow] = useState(false);
    return (
        <div className={styles.form}>
            <LockOpenRoundedIcon className={styles.icon} />
            <FormControl className={styles.field}>
                <InputLabel>Password</InputLabel>
                <Input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(elem) => onChange(elem.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShow(!show)}>
                                {show ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        </div>
    )
}