up:
	docker compose up -d;
down:
	docker compose down;
restart:
	docker compose down && docker-compose up -d --remove-orphans;
stop_all:
	docker-stop $(docker ps -a -q) && docker rm $(docker ps -a -q);
rm:
	docker rmi $(docker images --filter "reference=commune-ai/gradio-flow/*" --format "{{.ID}}")
wipe:
	make down && make rm
build:
	docker compose build
env:
	docker exec -it backend bash