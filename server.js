// Local test server for testing direct downloads and curl/wget commands
// Mimics Vercel Edge routing and header injection
// Usage: node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ZIP_FILE = path.join(__dirname, 'file.zip');
const HTML_FILE = path.join(__dirname, 'index.html');

function serveZip(req, res) {
  if (!fs.existsSync(ZIP_FILE)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Error: file.zip not found in root directory.');
    return;
  }

  const stat = fs.statSync(ZIP_FILE);
  const fileSize = stat.size;
  const range = req.headers.range;

  const baseHeaders = {
    'Content-Type': 'application/zip',
    'Content-Disposition': 'attachment; filename="file.zip"',
    'Access-Control-Allow-Origin': '*',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000, immutable'
  };

  // Support range requests for curl / wget resuming
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;

    res.writeHead(206, {
      ...baseHeaders,
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Content-Length': chunksize
    });

    const fileStream = fs.createReadStream(ZIP_FILE, { start, end });
    fileStream.pipe(res);
  } else {
    res.writeHead(200, {
      ...baseHeaders,
      'Content-Length': fileSize
    });

    const fileStream = fs.createReadStream(ZIP_FILE);
    fileStream.pipe(res);
  }
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  console.log(`[${new Date().toISOString()}] ${req.method} ${urlPath} - UA: ${req.headers['user-agent'] || 'none'}`);

  if (urlPath === '/' || urlPath === '/index.html') {
    if (fs.existsSync(HTML_FILE)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(HTML_FILE).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('index.html not found');
    }
  } else if (urlPath === '/zip' || urlPath === '/file.zip' || urlPath === '/download') {
    serveZip(req, res);
  } else {
    // Check if other static files exist
    const potentialFile = path.join(__dirname, urlPath);
    if (fs.existsSync(potentialFile) && fs.statSync(potentialFile).isFile()) {
      res.writeHead(200);
      fs.createReadStream(potentialFile).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  }
});

server.listen(PORT, () => {
  console.log(`> Local server running at http://localhost:${PORT}`);
  console.log(`> Test in browser: http://localhost:${PORT}`);
  console.log(`> Test curl /zip: curl -L http://localhost:${PORT}/zip -o test-curl.zip`);
  console.log(`> Test curl /file.zip: curl -L http://localhost:${PORT}/file.zip -o test-curl2.zip`);
});
