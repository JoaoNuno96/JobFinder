const express    = require('express'); //exportar express
const exphbs     = require('express-handlebars'); //Express handlebars trabalha com as views,
const app        = express(); //chamar frameworks express
const path       = require('path'); //Pacote Path que vem com o Node.js
const db         = require('./db/connection'); //exportar caminho do script da conecção
const bodyParser = require('body-parser'); //usar bodyparser buscar requisições
const job        = require('./models/Job');
const sequelize  = require('sequelize'); //aceder db
const op         = sequelize.Op; //operadores de verificação de queries (neste caso usamos Like)

const PORT = 8000;

//LOCALHOST PORT
app.listen(PORT,function(){
    console.log("LocalHost: Porta 8000");
})

//BODY PARSER
app.use(bodyParser.urlencoded({extended:false}));

//HANDLE BARS
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars',exphbs.engine({defaultLayout: 'main'}));
app.set('view engine','handlebars'); //view engine que vai redarizar a view

//static folder
app.use(express.static(path.join(__dirname,'public')))

//DATABASE CONNECTION
db
    .authenticate()
    .then(()=>{
        console.log("Conectou ao banco com sucesso");
    })
    .catch((erro)=>{
        console.log("Ocorreu um erro ao conectar. Erro: " + erro)
    })

//ROUTES
app.get('/',function(req,res){

    let search = req.query.job;
    let query = '%' + search + '%'; //PH => PHP , PRESS => WORDPRESS

    if(!search)
    {
        job.findAll({
            order:[
                ['createdAt','DESC']
            ]
        })
        .then(Jobs => {
            res.render('index',{Jobs});
        })
        .catch(error => console.log(error));
    }
    else
    {
        job.findAll({
            where:{titulo:{[op.like]:query}},
            order:[
                ['createdAt','DESC']
            ]
        })
        .then(Jobs => {
            res.render('index',{Jobs,search});
        })
        .catch(error => console.log(error));
    }
})

app.get('/jobs/add',function(req,res){
    res.render('add');
})

//JOBS ROUTES
app.use('/jobs',require('./routes/jobs'));




