#!/bin/bash
# ZenithMail Production Provisioning
set -e

echo "🚀 Provisioning Ubuntu/AlmaLinux VPS for ZenithMail..."

# 1. Update and Essentials
if command -v apt-get &> /dev/null; then
    apt-get update && apt-get upgrade -y
    apt-get install -y curl git ufw certbot python3-certbot-nginx
else
    dnf update -y
    dnf install -y curl git firewalld certbot python3-certbot-nginx
fi

# 2. Swap Space (Vital for 4GB RAM)
if [ ! -f /swapfile ]; then
    echo "💾 Creating 4GB Swap..."
    fallocate -l 4G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=4096
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# 3. Docker Installation
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable --now docker
fi

# 4. Firewall
echo "🛡️ Configuring Firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
else
    systemctl enable --now firewalld
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --permanent --add-port=22/tcp
    firewall-cmd --reload
fi

# 5. Log Rotation
cat <<EOF > /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" }
}
EOF
systemctl restart docker

echo "✅ VPS Infrastructure Ready. Run 'deploy.sh' to launch."
