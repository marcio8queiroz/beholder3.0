import { useState } from "react";
import SelectSymbol from "../../components/SelectSymbol";
import FormPage from "../FormPage";
import SymbolInfo from "../../components/SymbolInfo";
import WalletSummary from "../../components/WalletSummary";
import SelectSide from "../../components/SelectSide";
import OrderType from "../../components/OrderType";

function NewOrder() {

    const [order, setOrder] = useState({ side: "BUY", type: "MARKET" });

    function onSymbolChange(evt) {
        setOrder(prevState => ({ ...prevState, symbol: evt.target.value }));
    }

    function onInputChange(evt){
        setOrder(prevState => ({...prevState, [evt.target.id]: evt.target.value}));
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
                            ? <SymbolInfo symbol={order.symbol}/>
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
                    <OrderType type={order.type} onChange={onInputChange}/>
                </div>
            </div>
        </FormPage>
    )
}

export default NewOrder;
