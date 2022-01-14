
REPO := frontend-hiring-task

.PHONY: build

all: build

build: ${REPO}

${REPO}: $(shell find src-backend)
	@cd src-backend && go build -o ../${REPO}
