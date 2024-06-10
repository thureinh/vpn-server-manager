#!/bin/bash
 
# First argument: Client identifier
 
KEY_DIR=/home/ubuntu/client-configs/keys
CLIENT_DIR=/home/ubuntu/mnt/efs/client/${1}/
OUTPUT_DIR=/home/ubuntu/client-configs/files
BASE_CONFIG=/home/ubuntu/client-configs/base.conf
 
cat ${BASE_CONFIG} \
    <(echo -e '<ca>') \
    ${KEY_DIR}/ca.crt \
    <(echo -e '</ca>\n<cert>') \
    ${CLIENT_DIR}/${1}.crt \
    <(echo -e '</cert>\n<key>') \
    ${CLIENT_DIR}/${1}.key \
    <(echo -e '</key>\n<tls-crypt>') \
    ${KEY_DIR}/ta.key \
    <(echo -e '</tls-crypt>') \
    > ${CLIENT_DIR}/${1}.ovpn

aws s3 cp ${CLIENT_DIR}/${1}.ovpn s3://openvpn-client-config/ --region ap-northeast-1