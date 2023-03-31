BACKEND=./backend
FRONTEND=./frontend
VERSION=0.7
CONTAINER_NAME=downgoose

dev: run-dev
run-dev: remove build-dev
	@echo Running Dev...
	docker run -d --env-file ./backend/.env -p 3000:3000 --restart=always --name $(CONTAINER_NAME) $(CONTAINER_NAME)-dev:$(VERSION)

prod: run-prod
run-prod: remove build-prod
	@echo Running Prod...
	docker run -d --env-file ./backend/.env.production -p 80:80 --restart=always --name $(CONTAINER_NAME) $(CONTAINER_NAME)-prod:$(VERSION)

build-dev:
	@echo Building Dev...
	docker build -t $(CONTAINER_NAME)-dev:$(VERSION) -f Dockerfile.dev .

build-prod:
	@echo Building Prod...
	docker build -t $(CONTAINER_NAME)-prod:$(VERSION) ./

build-gcrun:
	@echo Building GCrun...
	docker build -t $(CONTAINER_NAME)-prod:$(VERSION) ./

remove: stop
	@echo Removing...
	-docker rm $(CONTAINER_NAME)

stop:
	@echo Stopping...
	-docker stop $(CONTAINER_NAME)
