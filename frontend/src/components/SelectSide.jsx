/**
 * 
 * props: 
 * - side
 * - onChange
 */
export default function SelectSide(props) {
    return (
        <div className="form-grup">
            <label htmlFor="side">Side</label>
            <select id="side" className="form-select" value={props.side} onChange={props.onChange}>
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
            </select>
        </div>
    )
}