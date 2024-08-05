const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

require('./routes/htmlRoutes')(app);
require('./routes/apiRoutes')(app);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
