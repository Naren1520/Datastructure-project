const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const cBackend = require('./backend/c-backend');

const PORT = process.env.PORT || 8080;

// Parse request body
function parseBody(req, callback) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const data = body ? JSON.parse(body) : {};
            callback(null, data);
        } catch (error) {
            callback(error, null);
        }
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // GET all products via C backend
    if (pathname === '/api/c/products' && req.method === 'GET') {
        const products = cBackend.readInventory().products;
        res.writeHead(200);
        res.end(JSON.stringify(products));
        return;
    }

    // POST - Add product via C backend
    if (pathname === '/api/c/product/add' && req.method === 'POST') {
        parseBody(req, (err, data) => {
            if (err) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
                return;
            }

            const { id, name, price, quantity } = data;
            
            if (!id || !name || price === undefined || quantity === undefined) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing required fields' }));
                return;
            }

            const result = cBackend.addProduct(id, name, price, quantity);
            
            if (result.success) {
                res.writeHead(201);
                res.end(JSON.stringify(result));
            } else {
                res.writeHead(409);
                res.end(JSON.stringify(result));
            }
        });
        return;
    }

    // DELETE - Delete product via C backend
    if (pathname === '/api/c/product/delete' && req.method === 'DELETE') {
        parseBody(req, (err, data) => {
            if (err) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
                return;
            }

            const { id } = data;
            
            if (!id) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Product ID required' }));
                return;
            }

            const result = cBackend.deleteProduct(id);
            
            if (result.success) {
                res.writeHead(200);
                res.end(JSON.stringify(result));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify(result));
            }
        });
        return;
    }

    // PUT - Update product via C backend
    if (pathname === '/api/c/product/update' && req.method === 'PUT') {
        parseBody(req, (err, data) => {
            if (err) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
                return;
            }

            const { id, name, price, quantity } = data;
            
            if (!id) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Product ID required' }));
                return;
            }

            const result = cBackend.updateProduct(id, name, price, quantity);
            
            if (result.success) {
                res.writeHead(200);
                res.end(JSON.stringify(result));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify(result));
            }
        });
        return;
    }

    // POST - Sell product via C backend
    if (pathname === '/api/c/product/sell' && req.method === 'POST') {
        parseBody(req, (err, data) => {
            if (err) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
                return;
            }

            const { productId, quantitySold } = data;
            
            if (!productId || !quantitySold || quantitySold <= 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Product ID and valid quantity required' }));
                return;
            }

            const result = cBackend.sellProduct(productId, quantitySold);
            
            if (result.success) {
                res.writeHead(200);
                res.end(JSON.stringify(result));
            } else {
                res.writeHead(400);
                res.end(JSON.stringify(result));
            }
        });
        return;
    }

    // GET - Search product via C backend
    if (pathname.startsWith('/api/c/product/search/') && req.method === 'GET') {
        const id = parseInt(pathname.split('/')[4]);
        const result = cBackend.searchProduct(id);
        
        if (result.success) {
            res.writeHead(200);
            res.end(JSON.stringify(result.product));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify(result));
        }
        return;
    }

    // GET - Sort products by ID
    if (pathname === '/api/c/product/sort/id' && req.method === 'GET') {
        const result = cBackend.sortByID();
        res.writeHead(200);
        res.end(JSON.stringify(result));
        return;
    }

    // GET - Sort products by name
    if (pathname === '/api/c/product/sort/name' && req.method === 'GET') {
        const result = cBackend.sortByName();
        res.writeHead(200);
        res.end(JSON.stringify(result));
        return;
    }

    // GET - Sort products by price
    if (pathname === '/api/c/product/sort/price' && req.method === 'GET') {
        const result = cBackend.sortByPrice();
        res.writeHead(200);
        res.end(JSON.stringify(result));
        return;
    }

    // POST - Record rental via C backend
    if (pathname === '/api/c/rental/record' && req.method === 'POST') {
        parseBody(req, (err, data) => {
            if (err) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
                return;
            }

            const { productId, renterName, returnDate, phoneNumber, address, amountPaid } = data;
            
            if (!productId || !renterName || !returnDate || !phoneNumber || !address || amountPaid === undefined) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'All rental fields are required' }));
                return;
            }

            const result = cBackend.recordRental(productId, renterName, returnDate, phoneNumber, address, amountPaid);
            
            if (result.success) {
                res.writeHead(201);
                res.end(JSON.stringify(result));
            } else {
                res.writeHead(400);
                res.end(JSON.stringify(result));
            }
        });
        return;
    }

    // GET - Get all rentals via C backend
    if (pathname === '/api/c/rentals' && req.method === 'GET') {
        const rentals = cBackend.getAllRentals();
        res.writeHead(200);
        res.end(JSON.stringify(rentals));
        return;
    }

    // PUT - Mark rental as returned via C backend
    if (pathname === '/api/c/rental/return' && req.method === 'PUT') {
        parseBody(req, (err, data) => {
            if (err) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
                return;
            }

            const { rentalId } = data;
            
            if (!rentalId) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Rental ID required' }));
                return;
            }

            const result = cBackend.markRentalReturned(rentalId);
            
            if (result.success) {
                res.writeHead(200);
                res.end(JSON.stringify(result));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify(result));
            }
        });
        return;
    }

    // Serve static files (frontend)
    let filePath = pathname === '/' ? '/frontend/index.html' : `/frontend${pathname}`;
    filePath = path.join(__dirname, filePath);

    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(path.normalize(path.join(__dirname, 'frontend')))) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    const ext = path.extname(filePath);
    let contentType = 'text/html';
    let isBinary = false;
    
    switch (ext) {
        case '.js':
            contentType = 'application/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            isBinary = true;
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            isBinary = true;
            break;
        case '.gif':
            contentType = 'image/gif';
            isBinary = true;
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            isBinary = true;
            break;
    }

    fs.readFile(filePath, isBinary ? null : 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT' && path.extname(filePath) === '') {
                fs.readFile(path.join(__dirname, 'frontend', 'index.html'), 'utf8', (err2, data2) => {
                    if (err2) {
                        res.writeHead(404);
                        res.end('File not found');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data2);
                });
                return;
            }

            res.writeHead(404);
            res.end('File not found');
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`\n  NexStock Server - C Backend running at http://localhost:${PORT}`);
    console.log(` Frontend: http://localhost:${PORT}/`);
    console.log(`Dashboard: http://localhost:${PORT}/dashboard.html`);
    console.log(`Products: http://localhost:${PORT}/products.html`);
    console.log(`\n   C Backend API Endpoints:`);
    console.log(`   GET    /api/c/products              - Get all products`);
    console.log(`   POST   /api/c/product/add           - Add new product`);
    console.log(`   DELETE /api/c/product/delete        - Delete product`);
    console.log(`   PUT    /api/c/product/update        - Update product`);
    console.log(`   POST   /api/c/product/sell          - Sell product (reduce quantity)`);
    console.log(`   GET    /api/c/product/search/:id    - Search product by ID`);
    console.log(`   GET    /api/c/product/sort/id       - Sort products by ID`);
    console.log(`   GET    /api/c/product/sort/name     - Sort products by name`);
    console.log(`   GET    /api/c/product/sort/price    - Sort products by price`);
    console.log(`   POST   /api/c/rental/record         - Record rental transaction`);
    console.log(`   GET    /api/c/rentals               - Get all rentals`);
    console.log(`   PUT    /api/c/rental/return         - Mark rental as returned`);
    console.log(`\n Data Storage: backend/inventory.json (C backend handles all read/write)`);
    console.log(`All operations use C backend via c-backend.js module`);
    console.log(`Press Ctrl+C to stop the server\n`);
});
