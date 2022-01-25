import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Input,
  Select,
  InputLabel,
  InputAdornment,
  FormControl,
  TextField,
  MenuItem,
} from "@material-ui/core";
import { HelpOutline, FileCopy } from "@material-ui/icons";
import { Divider } from "../decoration/TileBreaker";
import { icons, ColoredIcon } from "../decoration/Icons";
import styles from "./styles.module.scss";
import { concat } from "../../util/utils";
import $ from "jquery";
import Notification from "../../component/notification/Notification";

export const TextInput = ({ className, label, value, onChange, ...attr }) => (
  <TextField
    {...attr}
    label={label}
    value={value}
    className={concat(styles.input, className)}
    onChange={(elem) => onChange(elem.target.value)}
  />
);

export const NumberInput = ({ value, step, inputProps, onChange, ...attr }) => {
  function sanitize(inputVal) {
    const regex = new RegExp("^[0-9]+[.]{0,1}[0-9]*");
    if (regex.test(inputVal)) onChange(inputVal);
  }
  return (
    <TextInput
      {...attr}
      type="number"
      value={value}
      inputProps={{ step: step || 1, ...inputProps }}
      onChange={sanitize}
    />
  );
};

export const MultiTextInput = ({
  rows,
  rowsMax,
  className,
  label,
  value,
  onChange,
  ...attr
}) => (
  <TextField
    {...attr}
    multiline
    minRows={rows || 3}
    maxRows={rowsMax || 5}
    label={label}
    value={value}
    className={concat(styles.input, className)}
    onChange={(elem) => onChange(elem.target.value)}
  />
);

export const FileIconInput = (props) => (
  <IconInput {...props} icon={FileCopy} />
);
export const HelpIconInput = (props) => (
  <IconInput {...props} icon={HelpOutline} />
);
export const IconInput = ({
  className,
  label,
  value,
  onChange,
  onClick,
  icon: Icon,
  ...attr
}) => (
  <FormControl className={concat(styles.input, className)}>
    <InputLabel>{label}</InputLabel>
    <Input
      {...attr}
      value={value}
      onChange={(elem) => onChange?.(elem.target.value)}
      endAdornment={
        <InputAdornment position="end">
          <div className={styles.iconInput} onClick={onClick}>
            <Icon />
          </div>
        </InputAdornment>
      }
    />
  </FormControl>
);

export const optionItem = (label, value) => {
  return {
    label: label,
    value: value,
  };
};

export const OptionInput = ({
  className,
  label,
  value,
  selections,
  onChange,
  ...attr
}) => (
  <FormControl {...attr} className={concat(styles.input, className)}>
    <InputLabel>{label}</InputLabel>
    <Select value={value} onChange={(elem) => onChange(elem.target.value)}>
      {selections.map((item, index) => (
        <MenuItem key={index} value={item.value}>
          {item.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export const SearchFilterInput = ({
  className,
  placeholder,
  onEnter,
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const inputRef = useRef();

  const enterIt = useCallback(() => onEnter?.(search), [onEnter, search]);

  useEffect(() => {
    const iRef = inputRef.current;
    $(iRef).on("keyup", (e) => {
      if (e.key === "Enter") enterIt();
    });
    return () => $(iRef).off("keyup");
  }, [enterIt]);

  const focusInput = () => {
    inputRef.current.focus();
    enterIt();
  };

  const openFilter = () => {
    Notification.create(`filter clicked`);
  };

  const updateSearch = (value) => {
    setSearch(value);
    onChange?.(value);
  };

  const clear = () => {
    updateSearch("");
    onEnter?.("");
  };

  return (
    <div className={concat(className, styles.searchFilterInput)}>
      <ColoredIcon
        className={styles.icon}
        icon={icons.search}
        onClick={focusInput}
      />
      <Divider orientation="vertical" />
      <div className={styles.inputField}>
        <input
          ref={inputRef}
          className={styles.search}
          placeholder={placeholder ?? "Search"}
          value={search}
          onChange={(e) => updateSearch(e.target.value)}
        />
        <i className="fa fa-times" onClick={clear} />
      </div>
      <Divider orientation="vertical" />
      <ColoredIcon
        className={styles.icon}
        icon={icons.filter}
        onClick={openFilter}
      />
    </div>
  );
};
