#!/bin/sh
set -eu

echo "Aplicando migrações..."
npx prisma migrate deploy

echo "Populando dados iniciais..."
npx prisma db seed

echo "Iniciando a aplicação..."
exec npm start -- -H 0.0.0.0 -p 3000
