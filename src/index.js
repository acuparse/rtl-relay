/**
 * Acuparse RTL Relay Service
 * @copyright Copyright (C) 2015-2022 Maxwell Power
 * @author Maxwell Power <max@acuparse.com>
 * @link http://www.acuparse.com
 * @license MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the
 * Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
 * ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
 * THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * File: index.js
 * RTL SYSLOG Relay
 */

const SyslogServer = require("syslog-server");
const https = require('https');
const server = new SyslogServer();

const acuparse_server = process.env.ACUPARSE_HOSTNAME || null;
const acuparse_port = process.env.ACUPARSE_PORT || 443;

// Extract the JSON from the SYSLOG message
server.on("message", (value) => {
    let json_data = /{.+}/g;
    let reading;
    while (reading = json_data.exec(value.message)) {
        let data = reading[0];
        console.log(data);
        if (acuparse_server) {
            const options = {
                host: acuparse_server,
                port: acuparse_port,
                path: '/weatherstation/updateweatherstation?rtl',
                method: 'POST',
                rejectUnauthorized: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                console.log('Status Code:', res.statusCode);
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    console.log('Body: ', JSON.parse(data));
                });
            }).on("error", (err) => {
                console.log("Error: ", err.message);
            });
            req.write(data);
            req.end();
        }
    }
});

// Start the server
server.start().then(r => console.log("Relaying readings to " + acuparse_server + ":" + acuparse_port));
