import { useState } from "react";
import SelectSymbol from "../../components/SelectSymbol";
import FormPage from "../FormPage";

function NewOrder(){

    const [order, setOrder] = useState({});

    function onSymbolChange(evt){

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
            </div>
        </FormPage>
    )
}

export default NewOrder;