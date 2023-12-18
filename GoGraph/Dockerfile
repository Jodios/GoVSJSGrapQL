FROM alpine:3.19.0
WORKDIR /app
COPY ./out ./runner
RUN apk add gcompat

EXPOSE 4000 

CMD ["./runner"]