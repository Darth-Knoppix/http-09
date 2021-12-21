import net from "net";
import { readFile, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseRequest(request) {
  const rawLine = request.split("\r\n", 1)[0];
  const [action, path] = rawLine.split(" ", 2);
  return { action, path };
}

function getStaticPage(path) {
  if (path.endsWith("/")) {
    return join(__dirname, "static", path, "index.html");
  }

  return join(__dirname, "static", path);
}

const server = net.createServer((conn) => {
  conn.setTimeout(500);
  console.log("client connected");

  conn.on("end", () => {
    console.log("client disconnected");
  });

  conn.on("data", (data) => {
    conn.setEncoding("ascii");
    const { action, path } = parseRequest(data.toString("ascii"));

    // HTTP/0.9 supports only support GET
    if (action !== "GET" || !path.startsWith("/")) {
      conn.write("<html><body><h1>Malformed request</h1></html>");
      conn.end();
      return;
    }

    const targetDocument = getStaticPage(path);

    if (!existsSync(targetDocument)) {
      conn.write("<html><body><h1>Failed to find document</h1></html>");
      conn.end();
      return;
    }

    readFile(targetDocument, (err, document) => {
      if (err) {
        console.error(err);
        conn.write("<html><body><h1>Failed to read document</h1></html>");
        conn.end();
        return;
      }
      // 1.0 support for headers
      // conn.write("HTTP/1.0 200 OK\rContent-Type: text/html\n\n");
      conn.write(document);
      conn.end();
    });
  });
});

server.on("error", (err) => {
  throw err;
});

server.listen(8080, () => {
  console.log("server bound");
});
