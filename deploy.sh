#!/bin/bash

# OOT Frontend 배포 스크립트
# Usage: ./deploy.sh

set -e

SERVER_IP="13.124.47.243"
SERVER_USER="ubuntu"
SSH_KEY="${1:-~/.ssh/your-key.pem}"  # SSH 키 경로를 첫 번째 인자로 받거나 기본값 사용
REMOTE_DIR="/home/ubuntu/OOT-Frontend"
REPO_URL="https://github.com/Princess-Maker-s-OOT/OOT-Frontend.git"
BRANCH="dev"

echo "🚀 OOT Frontend 배포 시작..."
echo "📍 서버: $SERVER_IP"
echo "👤 사용자: $SERVER_USER"
echo ""

# SSH 연결 테스트
echo "🔍 SSH 연결 테스트..."
if ssh -i "$SSH_KEY" -o ConnectTimeout=5 "$SERVER_USER@$SERVER_IP" "echo 'SSH 연결 성공!'" 2>/dev/null; then
    echo "✅ SSH 연결 확인됨"
else
    echo "❌ SSH 연결 실패. 다음을 확인하세요:"
    echo "   1. SSH 키 경로: $SSH_KEY"
    echo "   2. 사용자명: $SERVER_USER"
    echo "   3. 서버 IP: $SERVER_IP"
    echo ""
    echo "사용법: ./deploy.sh /path/to/your-key.pem"
    exit 1
fi

# 서버에서 실행할 명령들
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
set -e

echo ""
echo "📦 Node.js 및 pnpm 설치 확인..."

# Node.js 설치 확인
if ! command -v node &> /dev/null; then
    echo "📥 Node.js 설치 중..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# pnpm 설치 확인
if ! command -v pnpm &> /dev/null; then
    echo "📥 pnpm 설치 중..."
    sudo npm install -g pnpm
fi

# PM2 설치 확인
if ! command -v pm2 &> /dev/null; then
    echo "📥 PM2 설치 중..."
    sudo npm install -g pm2
fi

echo "✅ 필수 도구 설치 완료"
echo ""

# 프로젝트 디렉토리로 이동 또는 클론
if [ -d "/home/ubuntu/OOT-Frontend" ]; then
    echo "📂 기존 프로젝트 업데이트..."
    cd /home/ubuntu/OOT-Frontend
    git fetch origin
    git checkout dev
    git pull origin dev
else
    echo "📂 프로젝트 클론..."
    cd /home/ubuntu
    git clone https://github.com/Princess-Maker-s-OOT/OOT-Frontend.git
    cd OOT-Frontend
    git checkout dev
fi

echo ""
echo "🔧 의존성 설치..."
pnpm install

echo ""
echo "🏗️  프로덕션 빌드..."
pnpm build

echo ""
echo "🚀 애플리케이션 시작/재시작..."

# PM2로 실행 중인 프로세스 확인
if pm2 list | grep -q "oot-frontend"; then
    echo "🔄 기존 프로세스 재시작..."
    pm2 restart oot-frontend
else
    echo "✨ 새 프로세스 시작..."
    pm2 start npm --name "oot-frontend" -- start
    pm2 save
fi

echo ""
echo "✅ 배포 완료!"
echo ""
echo "📊 애플리케이션 상태:"
pm2 list

echo ""
echo "🌐 접속 URL:"
echo "   - 프론트엔드: http://13.124.47.243:3000"
echo "   - 백엔드 API: http://13.124.47.243:8080"

ENDSSH

echo ""
echo "🎉 배포가 완료되었습니다!"
echo ""
echo "다음 단계:"
echo "1. Nginx 설정 (80번 포트로 서비스)"
echo "2. SSL 인증서 설정 (HTTPS)"
echo "3. 도메인 연결"
