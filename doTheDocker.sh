BACKEND=${PWD}/backend
FRONTEND=${PWD}/frontend
VERSION=0.6
CONTAINER_NAME=downgoose:${VERSION}

docker build -t ${CONTAINER_NAME} ./