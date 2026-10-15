import Select from "react-select";
import { useState } from "react";

/**
 * props:
 * - data
 */
function BeholderTest(props) {

    const [select, setSelect] = useState("");
    const [index, setIndex] = useState([]);
    const [indexValue, setIndexValue] = useState({});

    function onIndexChange(evt) {
        setSelect({ label: evt.label, value: evt.value });
        setIndex(evt.value);
        setIndexValue(props.data[evt.value]);
    }

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: 300
        })
    }

    return (
        <>
            <div className="row">
                <div className="col-4">
                <Select
                        value={select}
                        styles ={customStyles}
                        onChange={onIndexChange}
                        options={Object.keys(props.data).map(item => {
                            return { label: item, value: item }
                        })}
                    />
                </div>
            </div>
        </>
    )
}

export default BeholderTest;