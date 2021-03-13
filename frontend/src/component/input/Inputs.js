import React from 'react';
import PropTypes from 'prop-types';
import {
    Input,
    Select,
    InputLabel,
    InputAdornment,
    FormControl,
    TextField,
    MenuItem
} from "@material-ui/core";
import {
    HelpOutline,
    FileCopy
} from "@material-ui/icons";
import styles from "./styles.module.scss";
import { concat } from "../../util/utils";

export const TextInput = ({ className, label, value, onChange, ...attr }) =>
    <TextField
        {...attr}
        label={label}
        value={value}
        className={concat(styles.input, className)}
        onChange={(elem) => onChange(elem.target.value)} />

export const NumberInput = ({ value, step, inputProps, onChange, ...attr }) => {
    function sanitize(inputVal) {
        const regex = new RegExp("^[0-9]+$");
        if (regex.test(inputVal)) onChange(inputVal);
    }
    return (
        <TextInput
            {...attr}
            type="number"
            value={value}
            inputProps={{ step: step || 1, ...inputProps }}
            onChange={sanitize} />
    );
}

export const MultiTextInput = ({ rows, rowsMax, className, label, value, onChange, ...attr }) =>
    <TextField
        {...attr}
        multiline
        rows={rows || 3}
        rowsMax={rowsMax || 5}
        label={label}
        value={value}
        className={concat(styles.input, className)}
        onChange={(elem) => onChange(elem.target.value)} />

export const FileIconInput = ({ onClick, ...attr }) =>
    <IconInput
        {...attr}
        iconElement={<FileCopy className={styles.iconInput} onClick={onClick} />} />


export const HelpIconInput = ({ onClick, ...attr }) =>
    <IconInput
        {...attr}
        iconElement={<HelpOutline className={styles.iconInput} onClick={onClick} />} />

const IconInput = ({ className, label, value, onChange, onClick, iconElement, ...attr }) => {
    return (
        <FormControl
            {...attr}
            className={concat(styles.input, className)}>
            <InputLabel>{label}</InputLabel>
            <Input
                disabled
                value={value}
                onChange={(elem) => onChange(elem.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        {iconElement}
                    </InputAdornment>
                }
            />
        </FormControl>
    )
}

export const optionItem = (label, value) => {
    return {
        label: label,
        value: value
    }
}

export const OptionInput = ({ className, label, value, selections, onChange, ...attr }) =>
    <FormControl
        {...attr}
        className={concat(styles.input, className)}>
        <InputLabel>{label}</InputLabel>
        <Select
            value={value}
            onChange={(elem) => onChange(elem.target.value)}>
            {selections.map((item, index) => (
                <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
            ))}
        </Select>
    </FormControl>

const exported = { TextInput, MultiTextInput, OptionInput };
export default exported;