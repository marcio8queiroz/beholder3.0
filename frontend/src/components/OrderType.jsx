/**
 * props: 
 * - type
 * - onChange
 */
export default function SelectSide(props) {
    return (
        <div className="form-grup">
            <label htmlFor="side">Type</label>
            <select id="type" className="form-select" value={props.type} onChange={props.onChange}>
                <option value="LIMIT">Limit</option>
                <option value="MARKET">Market</option>
                <option value="STOP_LOSS">Stop Loss</option>
                <option value="STOP_LOSS_LIMIT">Stop Loss Limit</option>
                <option value="STOP_LOSS_LIMIT">Take Profit</option>
                <option value="STOP_LOSS_LIMIT">Take Profit Limit</option>
            </select>
        </div>
    )
}