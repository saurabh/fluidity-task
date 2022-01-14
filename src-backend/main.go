package main

import (
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"
)

const (
	// DefaultListen address to use when serving the local client
	DefaultListen = ":8080"

	// MaxAmount to send in an orderbook update
	MaxAmount = 500

	// MaxPrice to set in the orderbook update
	MaxPrice = 500
)

func main() {

	rand.Seed(time.Now().Unix())

	var listenAddress string

	if len(os.Args) > 1 {
		listenAddress = os.Args[1]
	} else {
		listenAddress = DefaultListen
	}

	orderbookServer := NewOrderbookServer()

	go orderbookServer.Run()

	orderbookMessages := orderbookServer.Messages()

	var (
		updatesHandler   = handleUpdates(orderbookMessages)
		orderbookHandler = handleOrderbook(orderbookMessages)
	)

	http.HandleFunc("/api/updates", updatesHandler)

	http.HandleFunc("/api/orderbook", orderbookHandler)

	log.Printf("Listening on on %#v!", listenAddress)

	if err := http.ListenAndServe(listenAddress, nil); err != nil {
		log.Fatalf(
			"Failed to listen on %#v! %v",
			listenAddress,
			err,
		)
	}
}
