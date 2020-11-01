#!/bin/bash

# Shutdown PM2 applicatoin and the manager
$PM2 kill

# Reset IP routing tables
for line_num in $(sudo iptables --line-numbers --list PREROUTING -t nat | awk '($11=="3000" || $11=="3001") {print $1}')
do
  # You can't just delete lines here because the line numbers get reordered
  # after deletion, which would mean after the first one you're deleting the
  # wrong line. Instead put them in a reverse ordered list.
  LINES="$line_num $LINES"
  echo $line_num
done

# Delete the lines, last to first.
for line in $LINES
do
  sudo iptables -t nat -D PREROUTING $line
done

unset LINES