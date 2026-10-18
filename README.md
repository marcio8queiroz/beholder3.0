# beholder3.0
Multicoin traderbot for Binance


cd ~/github/beholder3.0
docker compose up -d --build
docker logs -f binance_bot_app

# Para procurar apenas essa mensagem no histórico do container, rode:
 docker logs binance_bot_app 2>&1 | grep "WebSocket server has started"

 # confirmar que o servidor continua estavel
 docker ps --filter name=binance_bot_app

 # Para acompanhar apenas os logs recentes:
 docker compose logs --since=5m -f node_app 
 # para acompanhar somente novas mensagens:
 docker compose logs --tail=0 -f node_app 

 # Acompanhe em tempo real com:
 docker logs -f binance_bot_app 2>&1 | grep --line-buffered "app-ws"

# reiniciar o backend
docker compose restart node_app


# validar o docker-compose.yml #se nao apareccer nada o yaml está válido
docker compose config --quiet

# recriar os containers afetados e restaurar a rede, preservando o volume do banco
docker compose up -d --force-recreate mysqldb node_app
docker compose logs --tail=50 node_app

# na pasta frontend
docker compose exec frontend_app npm install react-select

# caso de erro no react-select
docker compose exec frontend_app npm ci
docker compose restart frontend_app