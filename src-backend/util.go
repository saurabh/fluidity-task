package main

import (
	"math/rand"
	"fmt"
)

func generateCookie() string {
	b := make([]byte, 5)

	if _, err := rand.Read(b); err != nil {
		panic(err)
	}

	return fmt.Sprintf("%x", string(b))
}

func generateFakeTrade() OrderbookUpdate {

	isAsk := rand.Intn(2) > 0

	var side string

	if isAsk {
		side = "ask"
	} else {
		side = "bid"
	}

	amount := rand.Intn(MaxAmount)

	price := rand.Intn(MaxPrice)

	orderbookUpdate := OrderbookUpdate{
		Side: side,
		Amount: amount,
		Price: price,
	}

	return orderbookUpdate
}
