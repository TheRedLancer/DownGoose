BACKEND=./backend
FRONTEND=./frontend
VERSION=0.7
CONTAINER_NAME=downgoose

run-dev: remove build-dev
	@echo Running Dev...
	docker run -d --env-file ./backend/.env -p 3000:3000 --restart=always --name $(CONTAINER_NAME) $(CONTAINER_NAME)-dev:$(VERSION)

run-prod: remove build-prod
	@echo Running Prod...
	docker run -d --env-file ./backend/.env.production -p 80:80 --restart=always --name $(CONTAINER_NAME) $(CONTAINER_NAME)-prod:$(VERSION)

build-dev:
	@echo Building Dev...
	docker build -t $(CONTAINER_NAME)-dev:$(VERSION) ./

build-prod:
	@echo Building Prod...
	docker build -t $(CONTAINER_NAME)-prod:$(VERSION) ./

remove: stop
	@echo Removing...
	-docker rm $(CONTAINER_NAME)

stop:
	@echo Stopping...
	-docker stop $(CONTAINER_NAME)
