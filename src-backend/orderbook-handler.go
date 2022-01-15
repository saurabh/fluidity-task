package main

import (
	"encoding/json"
	"net/http"
	"log"
)

func handleOrderbook(orderbookMessages chan<- OrderbookRequest) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		headerSetCors(w)

		updates := make(chan []OrderbookUpdate)

		orderbookMessages <- OrderbookRequest{
			UpdatesDrain: updates,
		}

		orderbook := <-updates

		err := json.NewEncoder(w).Encode(orderbook)

		if err != nil {
			log.Printf(
				"Failed to create a new JSON encoder for a user seeking the orderbook! %v",
				err,
			)

			w.WriteHeader(http.StatusInternalServerError)

			return
		}
	}
}
