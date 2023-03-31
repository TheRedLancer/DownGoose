BACKEND=./backend
FRONTEND=./frontend
VERSION=0.7
CONTAINER_NAME=downgoose
GCR_PROJECT_ID=downgoosetest
GCR_IO=gcr.io/$(GCR_PROJECT_ID)

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

push-gcrun: remove build-gcrun
	@echo Pushing to GCP...
	docker push $(GCR_IO)/$(CONTAINER_NAME):$(VERSION)

run-gcrun: remove build-gcrun
	@echo Running GCrun...
	docker run -d --env-file ./backend/.env.production -p 80:80 --restart=always --name $(CONTAINER_NAME) $(GCR_IO)/$(CONTAINER_NAME):$(VERSION)

build-gcrun:
	@echo Building GCrun...
	docker build -t $(GCR_IO)/$(CONTAINER_NAME):$(VERSION) ./

remove: stop
	@echo Removing...
	-docker rm $(CONTAINER_NAME)

stop:
	@echo Stopping...
	-docker stop $(CONTAINER_NAME)
