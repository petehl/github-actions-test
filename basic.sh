#!/bin/sh
set -e
# comma separated list of new tags to apply
NEW_TAGS=$1
echo $NEW_TAGS
for i in ${NEW_TAGS//,/}
do
    echo $i
done

