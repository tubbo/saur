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

html: docs
.PHONY: html

clean: distclean mostlyclean
.PHONY: clean

mostlyclean:
	@rm -rf bin docs
.PHONY: mostlyclean

maintainer-clean: clean
	@rm -f tags
.PHONY: maintainer-clean

check:
	@deno test
.PHONY: check

distclean:
	@rm -rf dist
.PHONY: distclean

install:
	@install bin/saur /usr/local/bin
.PHONY: install

uninstall:
	@rm -f /usr/local/bin/saur
.PHONY: uninstall
