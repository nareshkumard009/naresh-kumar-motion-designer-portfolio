param(
    [int]$Port = 3000
)

$source = @"
using System;
using System.IO;
using System.Net;
using System.Threading;
using System.Collections.Generic;

public class PortfolioServer {
    private HttpListener _listener;
    private string _root;
    private volatile bool _running;
    private static readonly Dictionary<string, string> Mimes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {
        { ".html", "text/html; charset=utf-8" },
        { ".css", "text/css; charset=utf-8" },
        { ".js", "application/javascript; charset=utf-8" },
        { ".json", "application/json; charset=utf-8" },
        { ".svg", "image/svg+xml" },
        { ".png", "image/png" },
        { ".jpg", "image/jpeg" },
        { ".jpeg", "image/jpeg" },
        { ".webp", "image/webp" },
        { ".mp4", "video/mp4" },
        { ".ico", "image/x-icon" }
    };

    public static void Run(int port, string root) {
        var server = new PortfolioServer();
        server._root = root;
        server._listener = new HttpListener();
        try {
            server._listener.Prefixes.Add("http://localhost:" + port + "/");
            server._listener.Start();
        } catch {
            port++;
            server._listener = new HttpListener();
            server._listener.Prefixes.Add("http://localhost:" + port + "/");
            server._listener.Start();
        }

        server._running = true;
        Console.WriteLine("Local portfolio server running at http://localhost:" + port + "/");
        Console.WriteLine("Press Ctrl+C to stop.");

        while (server._running) {
            try {
                var ctx = server._listener.GetContext();
                ThreadPool.QueueUserWorkItem(state => server.ProcessRequest((HttpListenerContext)state), ctx);
            } catch {
                if (!server._running) break;
            }
        }
    }

    private void ProcessRequest(HttpListenerContext ctx) {
        try {
            var req = ctx.Request;
            var res = ctx.Response;
            var path = req.Url.LocalPath.TrimStart('/');
            if (string.IsNullOrWhiteSpace(path)) path = "index.html";
            path = Uri.UnescapeDataString(path).Replace('/', Path.DirectorySeparatorChar);
            var fullPath = Path.Combine(_root, path);

            if (!File.Exists(fullPath)) {
                res.StatusCode = 404;
                var err = System.Text.Encoding.UTF8.GetBytes("404 Not Found: " + path);
                res.ContentType = "text/plain";
                res.OutputStream.Write(err, 0, err.Length);
                res.OutputStream.Close();
                return;
            }

            var ext = Path.GetExtension(fullPath);
            string mime;
            if (!Mimes.TryGetValue(ext, out mime)) mime = "application/octet-stream";
            res.ContentType = mime;
            res.Headers.Add("Access-Control-Allow-Origin", "*");
            res.Headers.Add("Accept-Ranges", "bytes");

            var fi = new FileInfo(fullPath);
            long total = fi.Length;
            var rangeHeader = req.Headers["Range"];

            if (!string.IsNullOrEmpty(rangeHeader) && rangeHeader.StartsWith("bytes=")) {
                var parts = rangeHeader.Substring(6).Split('-');
                long start = long.Parse(parts[0]);
                long end = (parts.Length > 1 && !string.IsNullOrEmpty(parts[1])) ? long.Parse(parts[1]) : total - 1;
                if (end >= total) end = total - 1;
                long len = end - start + 1;

                res.StatusCode = 206;
                res.Headers.Add("Content-Range", "bytes " + start + "-" + end + "/" + total);
                res.ContentLength64 = len;

                using (var fs = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite, 65536)) {
                    fs.Seek(start, SeekOrigin.Begin);
                    byte[] buf = new byte[65536];
                    long rem = len;
                    while (rem > 0) {
                        int read = fs.Read(buf, 0, (int)Math.Min(buf.Length, rem));
                        if (read <= 0) break;
                        res.OutputStream.Write(buf, 0, read);
                        rem -= read;
                    }
                }
            } else {
                res.ContentLength64 = total;
                using (var fs = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite, 65536)) {
                    byte[] buf = new byte[65536];
                    int read;
                    while ((read = fs.Read(buf, 0, buf.Length)) > 0) {
                        res.OutputStream.Write(buf, 0, read);
                    }
                }
            }
            res.OutputStream.Close();
        } catch {
            // Client abort / socket close
        }
    }
}
"@

Add-Type -TypeDefinition $source -Language CSharp
[PortfolioServer]::Run($Port, $PSScriptRoot)
