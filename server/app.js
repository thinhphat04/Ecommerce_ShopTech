const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./middlewares/jwt');
const errorHandler = require('./middlewares/error_handler');
const authorizePostRequests = require('./middlewares/authorization');
const initWebSocketServer = require('./config/webSocket');

const {
  ChatRoute,
} = require('./routes');

require('dotenv').config();

const app = express();
const env = process.env;
const server = http.createServer(app);
const API = env.API_URL;

app.use(`${API}/checkout/webhook`, express.raw({ type: 'application/json' }));
// Middleware configurations // đòng này làm chặn stripe webhook // nếu không có dòng này thì stripe sẽ không gửi được webhook
app.use(cors({
  origin: 'http://localhost:3000', // React app
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));
app.use('/public', express.static('./public'));
app.use(express.json());
app.options('*', cors());

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(authorizePostRequests);
app.use(errorHandler);

// Route configurations
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const checkoutRouter = require('./routes/checkout');

app.use(`${API}/products`, productsRouter);
app.use(`${API}/categories`, categoriesRouter);
app.use(`${API}/orders`, ordersRouter);
app.use(`${API}/users`, usersRouter);
app.use(`${API}/`, authRouter);
app.use(`${API}/checkout`, checkoutRouter);
app.use(`${API}/admin`, adminRouter);
app.use('/api/v1/messages', ChatRoute); // Sử dụng route mới cho tin nhắn

// Khởi động WebSocket server
const wss = initWebSocketServer(server);

require('./helpers/cron_job');

// Connect to MongoDB
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

// Start the server
server.listen(PORT, IP, () => {
  console.log(`Server is running on http://${IP}:${PORT}`);
});
