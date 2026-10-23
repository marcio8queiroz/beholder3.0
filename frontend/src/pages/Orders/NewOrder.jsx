import { useState } from "react";
import SelectSymbol from "../../components/SelectSymbol";
import FormPage from "../FormPage";
import SymbolInfo from "../../components/SymbolInfo";
import WalletSummary from "../../components/WalletSummary";
import SelectSide from "../../components/SelectSide";
import OrderType from "../../components/OrderType";

import { LIMIT_TYPES, STOP_TYPES } from "../../services/ExchangeService";
import QuantityInput from "../../components/QuantityInput";

function NewOrder() {

    const [error, setError] = useState("");
    const [order, setOrder] = useState({ side: "BUY", type: "MARKET" });

    function onSymbolChange(evt) {
        setOrder(prevState => ({ ...prevState, symbol: evt.target.value }));
    }

    function onInputChange(evt) {
        setOrder(prevState => ({ ...prevState, [evt.target.id]: evt.target.value }));
    }

    function getStopPriceClasses(orderType) {
        return STOP_TYPES.includes(orderType) ? "col-3" : "d-none";
    }

    function getLimitPriceClasses(orderType) {
        return LIMIT_TYPES.includes(orderType) ? "col-3" : "d-none";
    }

    function btnSendClick(){
        setError("");
        console.log(order);
    }

    return (
        <FormPage title="New Spot Order">
            <div className="row">
                <div className="col-3 mb-3">
                    <div className="form-group">
                        <label>Symbol:</label>
                        <SelectSymbol symbol={order.symbol} disabled={false} onChange={onSymbolChange} />
                    </div>
                </div>
                <div className="col-3">
                    {
                        order.symbol
                            ? <SymbolInfo symbol={order.symbol} />
                            : <></>
                    }
                </div>
            </div>
            <div className="row">
                <label>You have:</label>
                <div className="col-6">
                    <WalletSummary symbol={order.symbol} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-3">
                    <SelectSide side={order.side} onChange={onInputChange} />
                </div>
                <div className="col-9 text-nowrap overflow-auto">
                    <OrderType type={order.type} onChange={onInputChange} />
                </div>
            </div>
            <div className="row mb-3">
                <div className={getStopPriceClasses(order.type)}>
                    <label htmlFor="stopPrice">Stop Price:</label>
                    <input className="form-control" id="stopPrice" type="number" value={order.stopPrice || ""} onChange={onInputChange} placeholder="0" />
                </div>
                <div className={getStopPriceClasses(order.type)}>
                    <label htmlFor="trailingDelta">Trailing Delta:</label>
                    <input className="form-control" id="trailingDelta" type="number" value={order.trailingDelta || ""} onChange={onInputChange} placeholder="0" />
                </div>
            </div>
            <div className="row mb-3">
                <div className={getLimitPriceClasses(order.type)}>
                    <label htmlFor="limitPrice">Limit Price:</label>
                    <input className="form-control" id="limitPrice" type="number" value={order.limitPrice || ""} onChange={onInputChange} placeholder="0" />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-12">
                    <QuantityInput symbol={order.symbol} quantity={order.quantity} isQuote={order.isQuote} allowQuote={order.type === "MARKET"} onChange={onInputChange} />
                </div>
            </div>
            <div className="row">
                <div className="col-3">
                    <button type="button" className="btn btn-primary" onClick={btnSendClick}>Send Order</button>
                    <a href="/orders" className="btn btn-light">Cancel</a>
                </div>
                {
                    error
                    ? <div className="alert alert-danger mt-1 col-6 py-1">{error}</div>
                    : <></>
                }
            </div>
        </FormPage>
    )
}

export default NewOrder;
