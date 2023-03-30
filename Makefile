BACKEND=./backend
FRONTEND=./frontend
VERSION=0.6
CONTAINER_NAME=downgoose

run: remove build
	@echo Running...
	docker run -d --env-file ./backend/.env -p 3000:3000 -p 8000:8000 --restart=always --name $(CONTAINER_NAME) $(CONTAINER_NAME):$(VERSION)

build:
	@echo Building...
	docker build -t downgoose:0.6 ./

remove: stop
	@echo Removing...
	-docker rm $(CONTAINER_NAME)

stop:
	@echo Stopping...
	-docker stop $(CONTAINER_NAME)
