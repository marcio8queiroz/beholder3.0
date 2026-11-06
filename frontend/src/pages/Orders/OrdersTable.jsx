import OrderRow from "./OrderRow";
import { useState, useEffect }from "react";
import { getOrders } from "../../services/OrdersService";

export default function OrdersTable(){

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getOrders()
            .then(result => {
                setOrders(result.rows);
            })
            .catch(err => {
                console.error(err);
                setError("Unable to load orders. Please try again.");
            })
            .finally(() => setLoading(false));
    }, [])

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
                    {
                        loading
                        ? <tr><td colSpan={6}>Loading orders...</td></tr>
                        : error
                        ? <tr><td colSpan={6} role="alert">{error}</td></tr>
                        : orders.length > 0
                        ? orders.map(order => <OrderRow key={order.id} data={order} />)
                        : <tr><td colSpan={6}>No orders found</td></tr>
                    }
                </tbody>
            </table>
        </div>
    )
}
