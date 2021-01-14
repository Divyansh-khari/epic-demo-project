const express = require('express')
const path = require('path')
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
const PORT = process.env.PORT || 5000;

var app=express()
  app.use(express.json());
  app.use(express.urlencoded({extended:false}));
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs')
  app.get('/', (req, res) => res.render('pages/index'));
  app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });
  app.get('/times', (req, res) => res.send(showTimes()));
  showTimes = () => {
  let result = '';
  const times = process.env.TIMES || 5;
  for (i = 0; i < times; i++) {
    result += i + ' ';
  }
  return result;
}


app.post('/login', (req,res)=>{
  var user= req.body.uname;
  var password= req.body.upassword;
  if(user=='admin' && password=='123'){
    res.render('pages/image');
  }
  else{
    res.send("<h2>The username and password entered are incorrect. Please Try again!!</h2>")
  }
}

);
app.post('/register',(req, res)=>{
  var f1= req.body.uname;
  var f2=req.body.uemail;
  var f3= req.body.uaddress;
  if(f1=='' || f2=='' || f3==''){
    res.send("<h2>Please fill all the required fields in the form!!</h2>")
  }
  else{
    res.render("pages/login");
  }

  res.render('pages/login');
});
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
