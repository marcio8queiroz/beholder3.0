/**
 * props:
 * - id
 * - data
 * - type
 * - disabled
 * - onChange
 */
export default function MemoryInput(props) {
    return (
        <div className="row mb-3">
            <div className="col-4 ms-3">
                {props.id}
            </div>
            <div className="col-6">
                <input
                    type={props.type || "text"}
                    id={props.id}
                    disabled={props.disabled}
                    className="form-control form-control-sm"
                    onChange={props.onChange}
                    value={props.data ?? ""} />
            </div>
        </div>
    )
}
