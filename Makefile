#
# Makefile for the `saur` command
#

all: bin/saur tags docs

bin/saur:
	@mkdir -p bin
	@deno install --allow-run --allow-write -d bin saur cli.js

dist:
	@mkdir -p dist
	@git archive -o dist/saur.tar.gz HEAD

tags:
	@ctags -R .

docs:
	@esdoc

node_modules:
	@yarn install --check-files

html: docs
.PHONY: html

clean: distclean mostlyclean
.PHONY: clean

mostlyclean:
	@rm -rf bin docs node_modules
.PHONY: mostlyclean

maintainer-clean: clean
	@rm -f tags
.PHONY: maintainer-clean

check:
	@deno fmt **/*.js --check
	@deno test
.PHONY: check

fmt:
	@deno fmt **/*.js
.PHONY: fmt

distclean:
	@rm -rf dist
.PHONY: distclean

install:
	@install bin/saur /usr/local/bin
.PHONY: install

uninstall:
	@rm -f /usr/local/bin/saur
.PHONY: uninstall
