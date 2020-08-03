#!/bin/sh
set -e
# comma separated list of new tags to apply
NEW_TAGS=$1
echo $NEW_TAGS
for i in $(echo $NEW_TAGS | sed "s/,/ /g")
do
    echo $i
done

