/**
 * Juan Luxury · servidor mínimo para el VPS
 * Sirve index.html y la carpeta fotos. Sin dependencias: solo Node.
 * El puerto lo asigna el servidor (process.env.PORT), como las demás apps.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const RAIZ = __dirname;
const PUERTO = process.env.PORT || 3000;
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".txt": "text/plain; charset=utf-8",
};

http.createServer((req, res) => {
  let ruta = decodeURIComponent(req.url.split("?")[0]);
  if (ruta === "/" || ruta === "") ruta = "/index.html";
  if (ruta === "/salud") { res.writeHead(200, { "Content-Type": "application/json" }); return res.end('{"ok":true}'); }

  const archivo = path.normalize(path.join(RAIZ, ruta));
  if (!archivo.startsWith(RAIZ)) { res.writeHead(403); return res.end("Prohibido"); }

  fs.readFile(archivo, (err, datos) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return res.end('<meta charset="utf-8"><body style="background:#1C0B20;color:#FFF3E3;font-family:sans-serif;text-align:center;padding:80px">' +
        '<h1>Página no encontrada</h1><p><a style="color:#F2C14E" href="/">Volver a la tienda</a></p>');
    }
    const ext = path.extname(archivo).toLowerCase();
    const cache = ext === ".html" ? "no-cache" : "public, max-age=604800";
    res.writeHead(200, { "Content-Type": TIPOS[ext] || "application/octet-stream", "Cache-Control": cache });
    res.end(datos);
  });
}).listen(PUERTO, () => console.log("Juan Luxury escuchando en el puerto " + PUERTO));
