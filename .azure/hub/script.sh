#!/bin/sh

echo "Installing MS GPG key..."
apt-get update && apt-get install -y gnupg software-properties-common
wget -O- https://packages.microsoft.com/keys/microsoft.asc |
    gpg --dearmor |
    tee /usr/share/keyrings/microsoft-archive-keyring.gpg

echo "Adding Azure CLI package sources..."
echo "deb [signed-by=/usr/share/keyrings/microsoft-archive-keyring.gpg] \
    https://packages.microsoft.com/repos/azure-cli/ $(lsb_release -cs) main" |
    tee /etc/apt/sources.list.d/azure-cli.list

echo "Installing Azure CLI..."
apt-get update && apt-get install -y azure-cli

echo "Installing Bicep..."
az bicep install 2>/dev/null

echo "Installing NodeSource GPG key..."
wget -O- https://deb.nodesource.com/gpgkey/nodesource.gpg.key |
    gpg --dearmor |
    tee /usr/share/keyrings/nodesource-archive-keyring.gpg

echo "Adding NodeSource package sources..."
echo "deb [signed-by=/usr/share/keyrings/nodesource-archive-keyring.gpg] \
    https://deb.nodesource.com/node_18.x $(lsb_release -cs) main" |
    tee /etc/apt/sources.list.d/nodesource.list

echo "Installing Node.js..."
apt-get update && apt-get install -y nodejs

echo "Installing Nx CLI..."
npm install -g nx@latest
