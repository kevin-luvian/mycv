import { useRef, useCallback } from "react";
import { SelectableModal } from "../modal/Modal";
import { IconInput } from "../../component/input/Inputs";
import { icons } from "../../component/decoration/Icons";
import favicons from "../../util/favicons";

const iconElements = favicons.map(value => {
    return { title: value.replace("fa-", ""), value }
});

const ChooseIconInput = ({ className, label = "fav-icon", value, onChange }) => {
    const modalRef = useRef();

    const renderElement = index =>
        <p style={{ fontSize: "0.8rem" }}>
            <i className={"fa " + iconElements[index].value} /> {iconElements[index].title}
        </p>

    const valueIndex = useCallback(() =>
        iconElements.findIndex(e => e.value === value.replace("fa ", "")), [value]);

    const handleContinue = index => onChange?.("fa " + iconElements[index].value);

    return (
        <div className={className}>
            <IconInput
                label={label}
                icon={icons.info}
                value={value}
                onChange={onChange}
                onClick={() => modalRef.current.open()} />

            <SelectableModal
                ref={modalRef}
                title="Find Icon"
                data={iconElements}
                titleKey={"title"}
                perPage={100}
                valueIndex={valueIndex()}
                onContinue={handleContinue}
                renderElement={renderElement} />
        </div>
    )
}

export default ChooseIconInput;