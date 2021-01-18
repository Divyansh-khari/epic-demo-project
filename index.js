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
  app.get('/db',  async(req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM Customer');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });
  app.get('/times', async(req, res) => res.send(showTimes()));
  showTimes = () => {
  let result = '';
  const times = process.env.TIMES || 5;
  for (i = 0; i < times; i++) {
    result += i + ' ';
  }
  return result;
}


app.post('/login', async(req,res)=>{
  var user=req.body.uname;
  var password= req.body.upassword;
    var selectQuery= `SELECT name, password FROM Customer WHERE name='${user}'`;
    pool.query(selectQuery,(error,result) =>{
    if(error){res.send(error)}
    var results = {'rows': result.rows}
    if(results.name==user && result.password==password){
     res.render(pages/image);
    }
    else{
     res.send("<h2>You have enetered Wrong Password or Username. Try Again!! </h2>")
   }}
});


app.post('/register',async(req, res)=>{
  f1= req.body.uname;
  f2=req.body.uemail;
  f3= req.body.uaddress;
  f4=req.body.uaddress1;
  const client = await pool.connect();

  if(f1=='' || f2=='' || f3=='' || f4==''){
    res.send("<h2>Please fill all the required fields in the form!!</h2>");
  }
  else if (f3!=f4) {
    res.send("<h2>The two passwords supplied dont't match!!</h2>");
  }
  else{
    try{
    var insertQuery=`INSERT INTO Customer VALUES('${f1}','${f2}','${f3}')`;
    const result = await client.query(insertQuery);
    client.release();
       } catch (err) {
         console.error(err);
         res.send("Error here is : " + err);
       }
       res.render('pages/login');
     }
  });
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
