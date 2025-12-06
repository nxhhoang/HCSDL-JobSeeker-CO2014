docker stop jobseeker_backend sql_server
docker start jobseeker_backend sql_server

Reset Database
docker compose down -v
docker compose up -v --build