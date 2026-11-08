import { useState, useEffect } from "react";
import FormPage from "../FormPage";
import { useNavigate, useParams } from "react-router-dom";
import { getOrder } from "../../services/OrdersService";
import { ORDER_STATUS } from "../../services/ExchangeService";

function ViewOrder() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [order, setOrder] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return navigate("/orders");
        getOrder(id)
            .then(order => setOrder(order))
            .catch(err => {
                console.error(err.response ? err.response.data : err);
                setError(err.response ? JSON.stringify(err.response.data) : err.message);
            });
    }, [])

    function getStatusClass(status) {
        switch (status) {
            case ORDER_STATUS.PARTIALLY_FILLED: return "badge bg-info";
            case ORDER_STATUS.FILLED: return "badge bg-success";
            case ORDER_STATUS.EXPIRED:
            case ORDER_STATUS.REJECTED:
            case ORDER_STATUS.CANCELED: return "badge bg-danger"
            default: return "badge bg-primary"
        }

    }

    function getDate(timestamp) {
        if (timestamp == null || String(timestamp).trim() === "") return "—";
        const date = new Date(Number(timestamp));
        if (!Number.isFinite(date.getTime())) return "—";
        return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "medium" }).format(date);
    }

    return (
        <FormPage title="Order Details">
            <div className="row mb-3">
                <div className="col-3">
                    <b>Symbol:</b> {order.symbol}
                </div>
                <div className="col-3">
                    <span className={getStatusClass(order.status)}>{order.status}</span>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-3">
                    <b>Beholder Order ID:</b> {order.id}
                </div>
                {
                    order.automationId
                        ? <div className="col-3">
                            <b>Automation:</b>{order.automation.name}
                        </div>
                        : <></>
                }
            </div>
            <div className="row mb-3">
                <div className="col-3">
                    <b>Binance Order ID:</b> {order.orderId}
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-3">
                    <b>Date:</b> {getDate(order.transactTime)}
                </div>
            </div>
             <div className="row mb-3">
                <div className="col-3">
                    <b>Side:</b> {order.side}
                </div>
                 <div className="col-3">
                    <b>Type:</b> {order.type}
                </div>
            </div>
        </FormPage>
    )
}

export default ViewOrder;
