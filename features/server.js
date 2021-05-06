const express = require('express')

module.exports = () => {
    const app = express();
    const port = 3000;
    app.listen(port, () => console.log(`\nСервер запущен на порту ${port}\n`))
}