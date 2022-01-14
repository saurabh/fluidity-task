package main

import "time"

const (
	// TradeInterval between sending out a new trade that should be processed
	TradeInterval = 5 * time.Second

	// OrderbookMaxSize to contain before starting to overwrite the state
	OrderbookMaxSize = 500
)

const (
	OrderbookUpdateAsk = "ask"
	OrderbookUpdateBid = "bid"
)

type (
	// OrderbookRequest contains a simple way to talk to the orderbook server
	// via its channel. Fields may be set to use different features.
	OrderbookRequest struct {

		// Updates may be set to specify a channel to receive updates down.
		// Should be paired with CookieRequest to receive the cookie to
		// deregister when connected.
		Updates chan<- OrderbookUpdate

		// CookieRequest is a field to be set to request that a cookie is to
		// sent down to a connected user to facilitate them disconnecting
		// with a message.
		CookieRequest chan<- string

		// CookieClose can be set with the field that should disconnect a
		// user from the server using their cookie.
		CookieClose string

		// UpdatesDrain can be set with a channel to get a copy of the current
		// connected state of the orderbook copied
		UpdatesDrain chan<- []OrderbookUpdate
	}

	// OrderbookUpdate is used by the server to send updates generated
	// by the internal goroutine that generates mock trades.
	OrderbookUpdate struct {
		Side   string `json:"side"`
		Amount int    `json:"amount"`
		Price  int    `json:"price"`
	}

	OrderbookServer struct {
		connected    map[string]chan<- OrderbookUpdate
		trades       []OrderbookUpdate
		tradeUpdates chan OrderbookUpdate
		messages     chan OrderbookRequest
	}
)

func NewOrderbookServer() OrderbookServer {
	return OrderbookServer{
		connected:    make(map[string]chan<- OrderbookUpdate),
		trades:       make([]OrderbookUpdate, OrderbookMaxSize),
		tradeUpdates: make(chan OrderbookUpdate),
		messages:     make(chan OrderbookRequest),
	}
}

func NewOrderbookUpdate(side string, amount, price int) OrderbookUpdate {
	return OrderbookUpdate{
		Side:   side,
		Amount: amount,
		Price:  price,
	}
}

func (server OrderbookServer) Messages() chan<- OrderbookRequest {
	return server.messages
}

func (server OrderbookServer) Run() {

	var (
		connected    = server.connected
		trades       = server.trades
		messages     = server.messages
		tradeUpdates = server.tradeUpdates
	)

	go server.runTradesServer(TradeInterval)

	var counter int = 0

	for {
		select {
		case request := <-messages:

			var (
				updates       = request.Updates
				cookieRequest = request.CookieRequest
				cookieClose   = request.CookieClose
				updatesDrain  = request.UpdatesDrain
			)

			shouldSubscribeUser := updates != nil && cookieRequest != nil

			if shouldSubscribeUser {
				cookie := generateCookie()
				cookieRequest <- cookie
				connected[cookie] = updates
			}

			shouldDisconnectUser := cookieClose != ""

			if shouldDisconnectUser {
				delete(connected, cookieClose)
			}

			shouldSendOrderbook := updatesDrain != nil

			if shouldSendOrderbook {
				updatesDrain <- trades[:counter]
			}

		case trade := <-tradeUpdates:

			// circuit breaker to prevent the user from leaving this running overnight
			// and run out of memory

			if counter >= OrderbookMaxSize {
				counter = 0
			}

			trades[counter] = trade

			for _, connected := range connected {

				// if the channel cannot be read at the time, we skip it

				select {
				case connected <- trade:
				default:
				}
			}

			counter++
		}
	}
}

func (server OrderbookServer) runTradesServer(frequency time.Duration) {

	updates := server.tradeUpdates

	ticker := time.Tick(frequency)

	for _ = range ticker {
		updates <- generateFakeTrade()
	}
}
