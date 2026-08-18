# beholder3.0
Multicoin traderbot for Binance


cd ~/github/beholder3.0
docker compose up -d --build
docker logs -f binance_bot_app

# Para procurar apenas essa mensagem no histórico do container, rode:
 docker logs binance_bot_app 2>&1 | grep "WebSocket server has started"

 # confirmar que o servidor continua estavel
 docker ps --filter name=binance_bot_app

 # Acompanhe em tempo real com:
 docker logs -f binance_bot_app 2>&1 | grep --line-buffered "app-ws"

# reiniciar o backend
docker compose restart node_app