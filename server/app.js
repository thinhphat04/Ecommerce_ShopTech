const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./middlewares/jwt');
const errorHandler = require('./middlewares/error_handler');
const authorizePostRequests = require('./middlewares/authorization');
const initializeWebSocket = require('./utils/websocket');

require('dotenv').config();

const app = express();
const env = process.env;
const server = http.createServer(app);
const wss = initializeWebSocket(server);  // Initialize WebSocket server

const API = env.API_URL;

app.use(cors());
app.options('*', cors());
app.use(`${API}/checkout/webhook`, express.raw({ type: 'application/json' }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(authorizePostRequests);
app.use(errorHandler);

const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const checkoutRouter = require('./routes/checkout');
const chatRouter = require('./routes/chat');

app.use(`${API}/products`, productsRouter);
app.use(`${API}/categories`, categoriesRouter);
app.use(`${API}/orders`, ordersRouter);
app.use(`${API}/users`, usersRouter);
app.use(`${API}/`, authRouter);
app.use(`${API}/checkout`, checkoutRouter);
app.use(`${API}/admin`, adminRouter);
app.use(`${API}/chat`, chatRouter);
app.use('/public', express.static(__dirname + '/public'));

require('./helpers/cron_job');

mongoose
  .connect(env.CONNECTION_STRING)
  .then(() => {
    console.log('Connected to Database');
  })
  .catch((error) => {
    console.log(error);
  });

const PORT = env.PORT;
const IP = env.IP;

server.listen(PORT, IP, () => {
  console.log(`Server is running on http://${IP}:${PORT}`);
});