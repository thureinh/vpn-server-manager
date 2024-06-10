#!/bin/bash

# Accept a parameter
name=$1

# Run the easyrsa command
cd /home/ubuntu/easy-rsa/
./easyrsa --batch --req-cn=${name} gen-req ${name} nopass

# Copy the key to the specified directory
cd /home/ubuntu/
mkdir -p mnt/efs/client/${name}
cp easy-rsa/pki/private/${name}.key mnt/efs/client/${name}/
cp easy-rsa/pki/reqs/${name}.req mnt/efs/client/${name}/
