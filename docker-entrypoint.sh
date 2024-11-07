#!/bin/sh

echo "Waiting for Postgres to start..."
wget -qO- https://raw.githubusercontent.com/eficode/wait-for/v2.2.4/wait-for | sh -s -- postgres:5432

echo "Migrating the databse..."
npx prisma migrate deploy --schema=/app/dist/prisma/schema.prisma

echo "Starting the server..."
node dist/main.js