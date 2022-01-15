package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var websocketUpgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handleUpdates(orderbookServer chan<- OrderbookRequest) func(http.ResponseWriter, *http.Request) {

	return func(w http.ResponseWriter, r *http.Request) {

		headerSetCors(w)

		conn, err := websocketUpgrader.Upgrade(w, r, nil)

		if err != nil {
			log.Printf(
				"Failed to upgrade a connecting user to a websocket! %v",
				err,
			)

			w.WriteHeader(http.StatusBadRequest)

			return
		}

		var (
			orderbookUpdates = make(chan OrderbookUpdate, 1)
			orderbookCookie  = make(chan string)
		)

		orderbookServer <- OrderbookRequest{
			Updates:       orderbookUpdates,
			CookieRequest: orderbookCookie,
		}

		cookie := <-orderbookCookie

		defer conn.Close()

		for update := range orderbookUpdates {

			err := conn.WriteJSON(update)

			if err != nil {
				log.Printf(
					"Failed to write an orderbook update to a connected user! %v",
					err,
				)

				// disconnect this goroutine from the orderbook server...

				orderbookServer <- OrderbookRequest{
					CookieClose: cookie,
				}

				close(orderbookUpdates)

				return
			}
		}
	}
}
