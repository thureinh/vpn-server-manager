#!/bin/bash

name=$1

cd /home/ubuntu/easy-rsa
./easyrsa import-req /home/ubuntu/mnt/efs/client/${name}/${name}.req ${name}
echo yes | ./easyrsa sign-req client $name
cd /home/ubuntu
cp easy-rsa/pki/issued/${name}.crt mnt/efs/client/${name}/
