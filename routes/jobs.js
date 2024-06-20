const express   = require('express');
const router    = express.Router();
const Job       = require('../models/Job');

//Rota teste
router.get('/test',(req,res)=>{
    res.send("deu certo");
})

//detalhe da vaga
router.get('/view/:id',(req,res)=>{
    Job.findOne({
        where: {id: req.params.id }
    }).then(job => {
        res.render('view',{job})
    }).catch(error => console.log(error))
})

//Add job via post
router.post('/add',(req,res)=>{

    let {titulo,salary,company,description,email,new_job} = req.body

    Job.create({
        titulo,
        description,
        salary,
        company,
        email,
        new_job
    })
    .then(()=>{
        res.redirect('/');
    })
    .catch((error)=>{
        console.log(error);
    })
});

module.exports = router;

