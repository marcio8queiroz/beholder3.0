import Select from "react-select";
import MemoryForm from "./MemoryForm";
import { useState } from "react";
import { updateMemory } from "../../services/BeholderService";

/**
 * props:
 * - data
 */
function BeholderTest(props) {

    const [select, setSelect] = useState(null);
    const [index, setIndex] = useState("");
    const [indexValue, setIndexValue] = useState({});

    function onIndexChange(evt) {
        setSelect({ label: evt.label, value: evt.value });
        setIndex(evt.value);
        setIndexValue(props.data[evt.value]);
    }

    function btnUpdateClick() {
        updateMemory(index, indexValue.current ? indexValue.current : indexValue)
            .then(results => alert("Memory update:\n" + JSON.stringify(results)))
            .catch(err => alert(err.response ? JSON.stringify(err.response.data) : err.message));
    }

    function onIndexValueChange(hasCurrent, evt){
        const value = /^[\d\.\,]+$/.test(evt.target.value) ? parseFloat(evt.target.value) : evt.target.value;
        if(!hasCurrent){
            if(typeof indexValue === "object")
                setIndexValue(prevState => ({...prevState, [evt.target.id]: value}));
            else
                setIndexValue(value);
        }
        else {
            setIndexValue(prevState => ({
                ...prevState,
                current: prevState.current !== null && typeof prevState.current === "object"
                    ? {...prevState.current, [evt.target.id]: value}
                    : value
            }));
        }
    }

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: 300
        })
    }


    return (
        <>
            <div className="row mb-3 pt-3">
                <div className="col-4">
                    <Select
                        value={select}
                        styles={customStyles}
                        onChange={onIndexChange}
                        options={Object.keys(props.data).map(item => {
                            return { label: item, value: item }
                        })}
                    />
                </div>
            </div>
            <div className="mb-3" style={{ overflow: "auto", maxHeight: "500px" }}>
                <div className="row mb-3">
                    {
                        indexValue != null && indexValue.previous !== undefined
                            ? (
                                <div className="col-6">
                                    <h1 className="h5 mb-3">Previous Value:</h1>
                                    <MemoryForm disabled={true} data={props.data[index].previous} />
                                </div>
                            )
                            : <></>
                    }
                    {
                        index
                            ? (
                                <div className="col-6">
                                    <h1 className="h5 mb-3">Current Value:</h1>
                                    {
                                        indexValue != null && typeof indexValue === "object" && Object.hasOwn(indexValue, "current")
                                            ? <MemoryForm id={index} disabled={false} data={indexValue.current} onChange={evt => onIndexValueChange(true, evt)} />
                                            : <MemoryForm id={index} disabled={false} data={indexValue} onChange={evt => onIndexValueChange(false, evt)} />
                                    }

                                </div>
                            )
                            : <></>
                    }
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-2">
                   <button type="button" className="btn btn-primary" onClick={btnUpdateClick}>Update Memory</button>
                </div>
            </div>
        </>
    )
}

export default BeholderTest;
