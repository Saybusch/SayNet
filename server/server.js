import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;

const statsPath = "/usr/share/nginx/html/stats/snapshot.json";

function parseSnapshot(file) {
  if (!fs.existsSync(file)) return {};

  const lines = fs.readFileSync(file, "utf-8")
    .split("\n")
    .filter(Boolean);

  const result = {};

  for (const line of lines) {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }

    if (!entry?.fields || !entry?.tags?.name) continue;

    const id = entry.tags.id ?? "";
    if (!id.startsWith("/system.slice/docker-")) continue;

    const container = entry.tags.name;

    result[container] = {
      cpu: entry.fields.container_cpu_usage_seconds_total ?? 0,
      memNow: entry.fields.container_memory_usage_bytes ?? 0,
      memMax: entry.fields.container_spec_memory_limit_bytes ?? 1,
      isRunning: true
    };
  }

  return result;
}

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write("retry: 2000\n\n");

  let lastData = "";

  const interval = setInterval(() => {
    if (!fs.existsSync(statsPath)) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: "file missing" })}\n\n`);
      return;
    }

    const data = parseSnapshot(statsPath);
    const json = JSON.stringify(data);

    if (json !== lastData) {
      res.write(`event: stats\ndata: ${json}\n\n`);
      lastData = json;
    }

    res.write(`: ping\n\n`);
  }, 1000);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});