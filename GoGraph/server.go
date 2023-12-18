package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	_ "github.com/jodios/gograph/db"
	"github.com/jodios/gograph/graph"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

const defaultPort = "4000"

var httpCounter = prometheus.NewHistogramVec(prometheus.HistogramOpts{
	Name:    "http_request_duration_seconds",
	Help:    "Duration of HTTP requests in seconds",
	Buckets: []float64{0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10},
}, []string{"method", "route", "code"})

func main() {
	prometheus.MustRegister(httpCounter)
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	mux := http.NewServeMux()

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	mux.Handle("/metrics", promhttp.Handler())
	mux.Handle("/", playground.Handler("GraphQL playground", "/graphql"))
	mux.Handle("/graphql", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, &PromMiddleWare{mux}))
}

type StatusRecorder struct {
	http.ResponseWriter
	statusCode int
}

func (sr *StatusRecorder) WriteHeader(statusCode int) {
	sr.statusCode = statusCode
	sr.ResponseWriter.WriteHeader(statusCode)
}

type PromMiddleWare struct {
	handler http.Handler
}

func (pm *PromMiddleWare) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	sr := &StatusRecorder{w, 200}
	pm.handler.ServeHTTP(sr, r)
	duration := time.Since(start)
	httpCounter.WithLabelValues(
		r.Method,
		r.URL.Path,
		strconv.Itoa(sr.statusCode),
	).Observe(duration.Seconds())
}
