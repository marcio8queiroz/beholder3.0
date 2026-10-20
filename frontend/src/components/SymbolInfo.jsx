import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { getSymbol } from "../services/SymbolsService";

/**
 *
 * props:
 * - symbol
 */

function SymbolInfo(props) {

    const [info, setInfo] = useState({
        yesterday: 0,
        now: 0,
        minNotional: 10,
        minLotSize: 10
    })

    useEffect(() => {
        if(!props.symbol) return;

        getSymbol(props.symbol)
            .then(symbolObject => setInfo(prevState => ({...prevState, minLotSize: symbolObject.minLoteSize,
                minNotional: symbolObject.minNotional})))
            .catch(err => console.error(err.response ? err.response.data : err.message));
    }, [props.symbol])

    function getBinanceWSUrl() {
        if (!props.symbol) return null;
        return `${import.meta.env.VITE_BWS_URL}/ws/${props.symbol.toLowerCase()}@ticker`;
    }

    const {lastJsonMessage} = useWebSocket(getBinanceWSUrl(), {
        onOpen: () => console.log(`connected to Binance Stream ${props.symbol}@ticker`),
        onMessage: () => {
            if (lastJsonMessage)
                setInfo(prevState => ({...prevState, yesterday: lastJsonMessage.o, now: lastJsonMessage.c}));
    },

        onError: (err) => console.error(err),
        shouldReconnect: () => true,
        reconnectInterval: 10000
    })

    return (
        <div className="row">
            <div className="col-6">
                <div className="form-group">
                    <label>Market Price:</label><br />
                    Yesterday:<br />{`${info.yesterday}`.substring(0, 10)}<br />
                    Now:<br />{`${info.now}`.substring(0, 10)}
                </div>
            </div>
            <div className="col-6">
                <div className="form-group">
                    <label>Trade Info:</label><br />
                    Min.Notional:<br />{info.minNotional}<br />
                    Min. Lot Size:<br />{info.minLotSize}
                </div>
            </div>
        </div>
    )
}

export default SymbolInfo
