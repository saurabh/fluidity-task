# Task notes

Hey Alex! The app is built with Next, Tanstack, Tailwind, Radix-ui, and D3 for charts. Was my first time using d3 so spent a bit figuring that out and also a bit processing the api data to sales. The .env is there so should be fairly simple to run the app. Looking forward to hearing back!


# Frontend Hiring Task

Thank you for applying for a frontend role with Fluidity Money!

In this task to test your Typescript Next JS capabilities, you are expected
to create a webapp with functionality similar to the following:

![Example image](mock.png)

You must use Typescript and Next JS to implement your solution for this
task. You may use as many tools as you are comfortable with that don't
detract from an honest skills assessment.

*Please see [CHECKLIST.md](CHECKLIST.md) for how we score your approaches
to specific problems.*

*Please fork this repo to get started!*

**Please keep the repo private!**

## Background

This repo contains the backend that should be coupled with your
frontend.

**You are being tasked to build a mock exchange.**

Orders are made up of simple "bids" and "asks". Bids correspond
to a user attempting to purchase an asset and asks correspond to users
attempting to sell theirs. These orders are collated with information
and correspond to an "orderbook", an aggregation at a given point in
time of the state of the outstanding orders.

As an example, this is what the orderbook might look like:

| Bid prices | Bid sizes | Ask prices | Ask sizes |
|------------|-----------|------------|-----------|
|     71     |     33    |     52     |    104    |
|     70     |     48    |     50     |    105    |
|     69     |     27    |     49     |    99     |
|     68     |     10    |     48     |    99     |
|     67     |     8     |     47     |    95     |
|     66     |     41    |     42     |    101    |
|     65     |     43    |     41     |    96     |
|     64     |     53    |     40     |    100    |
|     63     |     23    |     39     |    95     |
|     62     |     45    |     20     |    93     |
|     60     |     38    |     19     |    89     |

A bid with a size of 33 and a price of $71 would be a user trying to
buy 33 of an asset for $71 each.

When an order is made, it may be "fulfilled". A fulfillment happens when
an order is partially matched with an order made by another.

For example, if a user wants to buy 10 of the asset for $20 and Shahmeer
(Fluidity Grand Overseer) is selling 5 of the asset for $19, as the
user is willing to pay more or the same as Shahmeer's offering, they
are matched. But only partially! There are 5 outstanding orders! This
will become a new order!

**In this challenge, you should maintain an orderbook in memory and use it
to render the components on the webapp. Please don't take something off
the shelf for the orderbook!**

### An example:

The backend will randomly generate orders. The websocket will provide
the most recent of the updates. You should use the endpoints to fetch the
data for the first time that you load the application.

## API provided by the backend codebase

### Get up to 250 fake orders

	/api/orderbook

This API endpoint will grab up to 250 fake orders that were made
along with their side. This is useful in initially constructing
the orderbook!

The first value is the side, the second is the size and the third is
the price:

	[
		{
			"side": "ask",
			"amount": 1000,
			"price": 1000
		}
	]

## Update websocket

	/api/updates

As the application lives, it will receive updates from the following
websocket of the following kind:

	{
		"side": "bid",
		"amount": 500,
		"price": 200
	}

These are generated by the server and should be used to update the
orderbook. They are the same structure as what's provided by the last
orders endpoint.

## Building the backend

To build the backend, you should have the following installed:

- A Go compiler (https://go.dev/dl/)

At this point, if you have `make` installed and you're on a
Unix-derivative operating system, you could simply:

	make

And you would get a single binary at the roof of the directory,
`frontend-hiring-task`.

### Alternatively...

You could `cd` into the directory `src-backend`, and, with your Go
compiler, just:

	go build -o frontend-hiring-task

This is if you're on Windows and don't have access to Make tools. Even
then, if you're having trouble, don't hesitate to call Alex.

---

Good luck!

Please reach out to Alex at [telto:+61 467 883 944](+61 467 883 944)
if something happens, you need help, or you are unable to complete the
challenge due to an unforeseen event.
