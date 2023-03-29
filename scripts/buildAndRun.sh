#!/bin/bash
root=$1
if [ -z ${root} ]; then
    echo Missing root dir
    exit
fi