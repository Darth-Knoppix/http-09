# HTTP/0.9 Experiment

Experiment on implementing an HTTP/0.9 compatible server which serves a single HTML file.

This is based on https://www.w3.org/Protocols/HTTP/AsImplemented.html and works over TCP using the Node.js net module.

## How does it work?

1. Start the server: `node server.mjs`
2. Start the client and make a request: `node client.mjs http://localhost:8080`

You should see the raw HTML respones.

_NOTE_: Modern browsers don't like HTTP/0.9 much and may just show the raw HTML or an error.
To see the file in a browser, uncomment line 58 of the server to get the bare minimum for HTTP/1.0 so browsers can display the page.

`conn.write("HTTP/1.0 200 OK\rContent-Type: text/html\n\n");`
