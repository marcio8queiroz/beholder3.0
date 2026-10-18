import MemoryInput from "./MemoryInput";

/**
 * props:
 * - id
 * - data
 * - disabled
 * - onChange
 */

export default function MemoryForm(props) {
    if(props.data == null) return <></>;

    function getType(value) {
        return parseFloat(value) || value === "0"  ? "number" : "text";
    }

    return (
        <>
            {
                props.data !== null && typeof props.data === "object"
                    ? Object.keys(props.data)
                        .sort()
                        .map(item => (
                            <MemoryInput
                                key={item}
                                id={item}
                                disabled={props.disabled}
                                type={getType(props.data[item])}
                                onChange={props.onChange}
                                data={props.data[item]} />
                        ))
                    : <MemoryInput
                                id={props.id}
                                disabled={props.disabled}
                                type={getType(props.data)}
                                onChange={props.onChange}
                                data={props.data} />
            }
        </>
    )
}
