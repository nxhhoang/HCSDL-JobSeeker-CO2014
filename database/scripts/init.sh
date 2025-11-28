#!/bin/bash
set -e

# Start SQL Server
/opt/mssql/bin/sqlservr &

echo "Waiting for SQL Server to start..."
until /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P 'admin@123' -Q "SELECT 1" -C &>/dev/null; do
  echo "waiting..."
  sleep 1
done

# Run all .sql scripts
# Start from 00 to 04 ensure the order of execution
for f in /scripts/*.sql; do
  echo "Execute $f"
  /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P 'admin@123' -i "$f" -C
done

# Keep container running
wait
