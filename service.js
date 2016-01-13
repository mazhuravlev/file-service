var express = require('express');
var multer = require('multer');
var uuid = require('node-uuid');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v4());
    }
});
var upload = multer({storage: storage});
var app = express();

app.get('/file/:id', function (req, res) {
    var file = 'uploads/' + req.params.id;
    if (fs.existsSync(file)) {
        fs.createReadStream(file).pipe(res);
        console.log('file downloaded:', req.params.id);
    } else {
        res.status(404);
        res.end('file not found');
        console.warn('file not found:', req.params.id);
    }
});

app.post('/file', upload.single('file'), function (req, res) {
    res.json({
        id: req.file.filename
    });
    console.log('file uploaded:', req.file.filename)
});

var port = argv.port || 8080;
app.listen(port, function () {
    console.log('listening on port ', port);
});