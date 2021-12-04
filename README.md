# X11JS

My attempt at writing an X11 Server written in JS.

## Development

The server assumes:
* You have [xscope][xscope] running, which assists with debugging `$ xscope -v4`.
* You don't have an alternative xserver running on port 6000

To compile the Typescript in watch mode:

```shell
$ npm run-script build-client-side-code
```

Then in a separate terminal, run the server with:
```shell
$ npm run-script build-server-side-code && npm start
```

Then open in a browser, [http://localhost:8080/](http://localhost:8080/)

[xscope]: https://www.x.org/releases/X11R7.5/doc/man/man1/xscope.1.html
