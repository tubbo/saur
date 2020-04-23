#
# Makefile for the `saur` command
#

all: bin/saur tags docs/api

bin/saur:
	@mkdir -p bin
	@deno install --allow-run --allow-write --allow-read -d bin saur cli.js

dist:
	@mkdir -p dist
	@git archive -o dist/saur.tar.gz HEAD

tags:
	@ctags -R .

docs/api:
	@yarn run esdoc
.PHONY: docs/api

node_modules:
	@yarn install --check-files

html: docs
.PHONY: html

clean: distclean mostlyclean
.PHONY: clean

mostlyclean:
	@rm -rf bin docs/api
.PHONY: mostlyclean

maintainer-clean: clean
	@rm -f tags
.PHONY: maintainer-clean

check:
	@deno fmt **/*.js --check
	@deno test
.PHONY: check

# fmt:
# 	@setopt extendedglob; deno fmt ^(node_modules|example)/**/*.js
# .PHONY: fmt

distclean:
	@rm -rf dist
.PHONY: distclean

install:
	@install bin/saur /usr/local/bin
.PHONY: install

uninstall:
	@rm -f /usr/local/bin/saur
.PHONY: uninstall

start:
	@cd example; bin/server
