const http = require('http');

const app = http.createServer(function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ a: 1 }, null, 3));
});
app.listen(8082);
