import net from "net";

let url;

try {
  const address = process.argv.slice(2)[0];
  url = new URL(address);
} catch (err) {
  throw new Error("Must supply a valid URL");
}

const conn = net.createConnection(
  { timeout: 500, port: parseInt(url.port), host: url.hostname },
  () => {
    console.log("connected to server");

    conn.on("data", (data) => {
      console.log(data.toString("ascii"));
      conn.end();
    });

    conn.on("end", () => {
      console.log("disconnected from server");
    });

    conn.write(`GET ${url.pathname}\r\n`);
  }
);
