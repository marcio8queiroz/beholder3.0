import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import OrderRow from "./OrderRow";
import { getOrders } from "../../services/OrdersService";
import Pagination from "../../components/pagination";

export default function OrdersTable() {
    const location = useLocation();
    const page = new URLSearchParams(location.search).get("page") || "1";

    const [orders, setOrders] = useState([]);
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState("Loading orders...");

    useEffect(() => {
        let active = true;

        setMessage("Loading orders...");

        getOrders(page)
            .then(result => {
                if (!active) return;

                setOrders(result.rows);
                setCount(result.count);
                setMessage(
                    result.rows.length > 0 ? "" : "No orders found"
                );
            })
            .catch(err => {
                if (!active) return;

                console.error(err.response ? err.response.data : err);
                setMessage("Unable to load orders. Please try again.");
            });

        return () => {
            active = false;
        };
    }, [page]);

    return (
        <div className="card card-body border-0 shadow table-wrapper table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className="border-gray-200">Order</th>
                        <th className="border-gray-200">Date</th>
                        <th className="border-gray-200">Qty</th>
                        <th className="border-gray-200">Net</th>
                        <th className="border-gray-200">Status</th>
                        <th className="border-gray-200">View</th>
                    </tr>
                </thead>
                <tbody>
                    {message ? (
                        <tr>
                            <td colSpan={6}>{message}</td>
                        </tr>
                    ) : (
                        orders.map(order => (
                            <OrderRow key={order.id} data={order} />
                        ))
                    )}
                </tbody>
            </table>
            <Pagination count={count} />
        </div>
    );
}