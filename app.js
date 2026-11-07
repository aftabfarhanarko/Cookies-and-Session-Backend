const express = require('express');
const app = express()
const cookiParser = require('cookie-parser')
const port = 3000
app.use(cookiParser());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/cookies-set', (req, res) => {
  res.cookie('name', 'ARKO', { httpOnly: true });
  res.send('OK Saved')
})

app.get("/check", (req ,  res)  => {
  const {name} = req.cookies;
  console.log(name);
  if(name === "ARKO"){
    res.send("Success True");
  }else{
    res.send("Fack")
  }
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})