all:
	@cd example; deno install --allow-net --allow-read --allow-write index.js
