const path = require("path");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { Console } = require("console");
const app = express();
const PORT = 8000

const fileStore = new Map();

const uploadDir = path.resolve(__dirname, "upload");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render("homepage");
});

app.get('/:URLs', (req, res) => {
    const URLs = req.params.URLs;
    const fileInfo = fileStore.get(URLs);

    if (fileInfo) {
        res.render("homepage", { URLs, fileInfo });
    } else {
        res.render("homepage", { URLs, fileInfo: null });
    }
});

app.post('/upload', upload.single('profileImage'), (req, res) => {
    const URLs = req.body.URLs;
    const fileInfo = {
        originalName: req.file.originalname,
        path: req.file.path,
        mimeType: req.file.mimetype,
    };
    console.log(fileInfo);
    console.log(fileStore)
    console.log(storage)
    fileStore.set(URLs, fileInfo);

    console.log(`File uploaded and accessible at /${URLs}`);
    res.redirect(`/${URLs}`);
});

app.get('/download/:URLs', (req, res) => {
    const URLs = req.params.URLs;
    const fileInfo = fileStore.get(URLs);
    
    if (fileInfo) {
        res.download(fileInfo.path, fileInfo.originalName);
    } else {
        res.status(404).send("File not found");
    }
});
document.querySelector('.file-input-button').addEventListener('click', function() {
    document.getElementById('profileImage').click();
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
