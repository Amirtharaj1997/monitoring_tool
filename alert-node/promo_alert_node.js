const express = require('express');
const protobuf = require('protobufjs');
const app = express();
const PORT = 7777;
const snappy = require('snappy');
const bodyParser = require('body-parser')
const root = protobuf.loadSync('metrics.proto');
const TimeSeries = root.lookupType('prompb.WriteRequest');
app.use((req, res, next) => {
    if (req.headers['content-type'] === 'application/x-protobuf') {
      let chunks = [];
      req.on('data', chunk => chunks.push(chunk));
        req.on('end', async () => {
            const compressedBuffer = Buffer.concat(chunks);
            try {
                // Decompress the Snappy data
                const uncompressedBuffer = await snappy.uncompress(compressedBuffer);
                // Decode the Protobuf data
                const message = TimeSeries.decode(uncompressedBuffer);
                req.body = TimeSeries.toObject(message , {
                    longs: String, // Convert int64 to string
                    enums: String, // Convert enums to string names
                    bytes: String  // Convert bytes to base64 strings
                });
                console.log('Decoded Protobuf message:', message);
                next();
            } catch (decodeErr) {
                res.status(400).send('Invalid Protobuf data ' + decodeErr.getMessage());
            }
        });
    } else {
      next();
    }
  });
  app.post('/write', (req, res) => {
    console.log(JSON.stringify(req.body));
    res.sendStatus(200);
  });
  app.post('/event', bodyParser.json(), (req, res) => {
    console.log("/event ======================================================");
    console.log(JSON.stringify(req.body));
    console.log(req);
    console.log("/event ======================================================");
    res.sendStatus(200);
  });
  app.get('/', (req, res) => {
    res.send("hello site24x7 !!!!!");
  });
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
// Load the protobuf schema
// protobuf.load('metrics.proto', (err, root) => {
//     if (err) throw err;
//     const WriteRequest = root.lookupType('WriteRequest');
//     const TimeSeries = root.lookupType('TimeSeries');
//     const Label = root.lookupType('Label');
//     const Sample = root.lookupType('Sample');
//     // Middleware to parse binary data
//     app.get('/', (req, res) => {
//         try {
//             res.sendStatus(200);
//         } catch (error) {
//             console.error('Failed to parse WriteRequest:', error);
//             res.sendStatus(400);
//         }
//     });
//     // Endpoint to receive metrics
//     app.post('/write', (req, res) => {
//         try {
//             // Decode the protobuf message
//             const WriteRequestMessage = WriteRequest.decode(req.body);
//             const WriteRequestMetric = WriteRequest.toObject(WriteRequestMessage, {
//                 longs: String,
//                 enums: String,
//                 bytes: String,
//             });
//             const TimeSeriesMessage = TimeSeries.decode(req.body);
//             const TimeSeriesMetric = TimeSeries.toObject(TimeSeriesMessage, {
//                 longs: String,
//                 enums: String,
//                 bytes: String,
//             });

//             const LabelMessage = Label.decode(req.body);
//             const LabelMetric = Label.toObject(LabelMessage, {
//                 longs: String,
//                 enums: String,
//                 bytes: String,
//             });
//             const SampleMessage = Sample.decode(req.body);
//             const SampleMetric = Sample.toObject(SampleMessage, {
//                 longs: String,
//                 enums: String,
//                 bytes: String,
//             });

//             // Log the received metrics
//                 console.log(`WriteRequest metric: ${WriteRequestMetric} TimeSeries metric: ${TimeSeriesMetric}  Label metric: ${LabelMetric} Sample metric:  ${SampleMetric} `);

//             res.sendStatus(200);
//         } catch (error) {
//             console.error('Failed to parse WriteRequest:', error);
//             res.sendStatus(400);
//         }
//     });

//     // Start the server

// });
