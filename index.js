const {app} = require('./server');

var bodyParser = require('body-parser');
const cors=require('cors');
const db=require('./config/mongoose');
const io=require('./socket');
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());


app.use('/',require('./routes'));
