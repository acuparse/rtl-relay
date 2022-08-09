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
 * RTL SYSLOG Relay Server Main Application
 */
const version = '1.0.0';

const MAC_ADDRESS = process.env.PRIMARY_MAC_ADDRESS;

if (MAC_ADDRESS === undefined) {
    console.error('PRIMARY_MAC_ADDRESS is not set.');
    process.exit(1);
}

const SyslogServer = require("syslog-server");
const https = require('https');

const RTL_SERVER = new SyslogServer();

const ACUPARSE_SERVER = process.env.ACUPARSE_HOSTNAME || 'acuparse';
const ACUPARSE_PORT = process.env.ACUPARSE_PORT || 443;

const JSON_REGEX = /{.+}/g;

// Extract the JSON Reading from the incoming SYSLOG message
RTL_SERVER.on("message", (value) => {
    let RAW_READING;
    while (RAW_READING = JSON_REGEX.exec(value.message)) {
        let ACUPARSE_DATA = RAW_READING[0];
        const REQUEST_OPTIONS = {
            host: ACUPARSE_SERVER,
            port: ACUPARSE_PORT,
            path: '/weatherstation/updateweatherstation?id=' + MAC_ADDRESS + '&realtime=1&softwaretype=rtl_433',
            method: 'POST',
            rejectUnauthorized: false,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': ACUPARSE_DATA.length,
                'User-Agent': 'Acuparse RTL Relay/' + version
            }
        };

        const req = https.request(REQUEST_OPTIONS, (res) => {
            let ACUPARSE_RESPONSE = '';
            res.setEncoding('utf-8');
            res.on('data', (chunk) => {
                ACUPARSE_RESPONSE += chunk;
            });
            res.on('end', () => {
                console.log("READING:", ACUPARSE_DATA);
                console.log("RESPONSE:", ACUPARSE_RESPONSE);
            });
        }).on('error', (err) => {
            console.log("ERROR: ", err.message);
        });
        req.write(ACUPARSE_DATA);
        req.end();
    }
});

// Start the server
RTL_SERVER.start().then(r => console.log("Relaying readings to " + ACUPARSE_SERVER + " on port " + ACUPARSE_PORT));
