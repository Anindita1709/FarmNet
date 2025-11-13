import http from "http";
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({});
const servers = [
  "http://localhost:5000",
  "http://localhost:5001",
  "http://localhost:5002"
];

let current = 0;

const server = http.createServer((req, res) => {
  // Round-robin: pick next server
  const target = servers[current];
  console.log(`Forwarding request to: ${target}${req.url}`);

  proxy.web(req, res, { target });

  current = (current + 1) % servers.length;
});

server.listen(4000, () => {
  console.log("FarmNet Load Balancer running on port 4000");
});
