up:
	docker-compose up -d --remove-orphans;
down:
	docker-compose down;
uninstall:
	docker image rm -f 80e5f1196647 && docker image rm -f cacdc0cdd804;
restart:
	docker-compose down && docker-compose up -d --remove-orphans;
stop_all:
	docker-stop $(docker ps -a -q) && docker rm $(docker ps -a -q);
build:
	docker-compose build
environment:
	docker exec -it backend bash