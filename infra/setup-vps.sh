
#!/bin/bash

# ZenithMail VPS Provisioning Script
# Target: AlmaLinux 8.9 / RHEL 8
# Optimized for 4GB RAM

set -e

echo "🚀 Starting ZenithMail Environment Setup for AlmaLinux..."

# 1. Update System
dnf update -y

# 2. Create Swap File (Crucial for 4GB RAM)
if [ ! -f /swapfile ]; then
    echo "📦 Creating 4GB Swap space..."
    dd if=/dev/zero of=/swapfile bs=1M count=4096
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
fi

# 3. Install Docker
echo "🐳 Installing Docker Engine..."
dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and Enable Docker
systemctl start docker
systemctl enable docker

# 4. Security: Firewalld (AlmaLinux default)
echo "🛡️ Hardening Firewall (firewalld)..."
systemctl start firewalld
systemctl enable firewalld
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=22/tcp
firewall-cmd --reload

# 5. Reverse Proxy Tools
dnf install -y epel-release
dnf install -y certbot python3-certbot-nginx

# 6. Optimization: Docker Log Rotation
mkdir -p /etc/docker
cat <<EOF > /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
systemctl restart docker

echo "✅ AlmaLinux Environment Ready!"
