#!/bin/bash

# Set up IP routing for HTTP/S
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 3001

# Restart PM2 and the web server application
$PM2 resurrect
$PM2 start app