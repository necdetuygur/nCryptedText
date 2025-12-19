const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const MARKDOWN_DIR = path.join(__dirname, "markdowns");

if (!fs.existsSync(MARKDOWN_DIR)) {
  fs.mkdirSync(MARKDOWN_DIR);
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === "/" || req.url.startsWith("/?")) {
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error loading page");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
    return;
  }

  if (
    req.url.indexOf(".png") !== -1 ||
    req.url.indexOf(".ico") !== -1 ||
    req.url.indexOf(".webmanifest") !== -1
  ) {
    fs.readFile(path.join(__dirname, req.url), (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error loading page");
        return;
      }
      const contentType =
        req.url.indexOf(".png") !== -1
          ? "image/png"
          : req.url.indexOf(".ico") !== -1
          ? "image/x-icon"
          : req.url.indexOf(".webmanifest") !== -1
          ? "application/manifest+json"
          : "text/plain";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
    return;
  }

  if (req.url.startsWith("/check/")) {
    const filename = decodeURIComponent(req.url.replace("/check/", ""));
    const filepath = path.join(MARKDOWN_DIR, `${filename}.md`);

    fs.access(filepath, fs.constants.F_OK, (err) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ exists: !err }));
    });
    return;
  }

  if (req.url.startsWith("/load/")) {
    const filename = decodeURIComponent(req.url.replace("/load/", ""));
    const filepath = path.join(MARKDOWN_DIR, `${filename}.md`);

    fs.readFile(filepath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(data);
    });
    return;
  }

  if (req.url === "/save" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const { filename, content } = JSON.parse(body);
        const filepath = path.join(MARKDOWN_DIR, `${filename}.md`);

        fs.writeFile(filepath, content, "utf8", (err) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error saving file");
            return;
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        });
      } catch (error) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid request");
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`nCryptedText server running at http://localhost:${PORT}/`);
  console.log(`Markdown files will be saved in: ${MARKDOWN_DIR}`);
});
