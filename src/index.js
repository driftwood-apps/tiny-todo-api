import { createServer } from "node:http";
import chalk from "chalk";
import { addTodo, listTodos } from "./store.js";

const port = Number(process.env.PORT ?? 3000);

function send(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

createServer((req, res) => {
  if (req.url !== "/todos") return send(res, 404, { error: "not found" });
  if (req.method === "GET") return send(res, 200, listTodos());
  if (req.method !== "POST") return send(res, 405, { error: "method not allowed" });
  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 10_000) req.destroy();
  });
  req.on("end", () => {
    try {
      const { title } = JSON.parse(raw);
      if (typeof title !== "string" || !title.trim()) return send(res, 400, { error: "title is required" });
      send(res, 201, addTodo(title.trim()));
    } catch {
      send(res, 400, { error: "invalid JSON" });
    }
  });
}).listen(port, () => console.log(chalk.green(`listening on ${port}`)));
