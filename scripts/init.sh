#!/bin/bash
set -e

echo "⏳ Waiting for database to be ready..."
sleep 5

echo "🔄 Running database migrations..."
npx prisma migrate deploy 2>&1 || npx prisma migrate dev --name init 2>&1 || {
  echo "⚠️  Migration failed, trying to generate client anyway..."
}

echo "📦 Generating Prisma Client..."
npx prisma generate

echo "🌐 Seeding database with Pokemon from PokeAPI..."
echo "   This may take a few minutes (fetching 151 Pokemon)..."
npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed.ts || echo "⚠️  Seed failed or already completed (continuing...)"

echo ""
echo "✅ Initialization complete!"

