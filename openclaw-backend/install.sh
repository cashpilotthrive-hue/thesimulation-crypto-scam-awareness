#!/bin/bash
echo "🦀 Installing OpenClaw Backend..."

if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

npm install

if [ ! -f .env ]; then
    cp .env.example .env
fi

mkdir -p data

echo "✅ Done! Run 'npm start'"