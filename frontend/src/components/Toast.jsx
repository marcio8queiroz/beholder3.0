import { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";

function Toast() {
    const notyfRef = useRef(null);

    const { lastJsonMessage } = useWebSocket(import.meta.env.VITE_WS_URL, {
        onOpen: () => console.log("Connected to App WS."),
        queryParams: { token: localStorage.getItem("token") },
        onError: (err) => console.error(err),
        shouldReconnect: () => true,
        reconnectInterval: 6000,
    });

    useEffect(() => {
        notyfRef.current = new window.Notyf({
            position: { x: "right", y: "top" },
            duration: 5000,
            types: [
                {
                    type: "success",
                    background: "green",
                    dismissible: true
                },
                {
                    type: "error",
                    background: "red",
                    dismissible: true
                }
            ]
        });
    }, []);

    useEffect(() => {
        const notification = lastJsonMessage?.notification;

        if (!notification?.text || !notyfRef.current) return;

        notyfRef.current.open({
            type: notification.type,
            message: notification.text
        });
    }, [lastJsonMessage]);

    return null;
}

export default Toast;
