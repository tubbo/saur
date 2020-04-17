all:
	@cd example; deno --allow-net --allow-read --allow-write index.js

app:
	@deno --allow-run --allow-write cli.js
