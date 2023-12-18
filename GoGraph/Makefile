build:
	env GOOS=linux GOARCH=amd64 go build -o out github.com/jodios/gograph
docker:
	make build && docker build -t jodios/gograph . && docker push jodios/gograph
gen: 
	go run github.com/99designs/gqlgen generate