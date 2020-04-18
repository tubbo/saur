# Deno Saur

A rapid development web framework for [deno][]. This README is for
developers of the project, for more information on the framework, check
out the [main site][] or [reference docs][].

## Building From Source

To build Deno Saur locally, clone this repo and run `make`:

    git clone https://github.com/tubbo/saur.git
    cd saur
    make

This will install a `bin/saur` command-line interface from the code in
the repo. Use this to run CLI commands, generate apps/code, etc.

## Running Tests

To run all tests:

    make check

To run a single test:

    deno test tests/path/to/the/test.js

## Code Formatting

This project uses `deno fmt` to format code. Make sure you run this
command before committing:

    make fmt

## Contributing

Please make contributions using a pull request, and follow our code of
conduct. In order for your contributions to be accepted, all tests must
pass. Thanks for contributing to open-source!

[deno]: https://deno.land
[main site]: https://denosaur.org
[reference docs]: https://api.denosaur.org
