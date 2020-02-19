// a funcionalidade require() é uma função para pedir alguma coisa(minha percepção)
// configurando o servidor(instrutor)
const express = require('express')

// o express() é um servidor do nodejs para facilitar a criação de web apps(minha percepção)
// configurando o servidor(instrutor)
const server = express()

// configurando o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

// configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'user',
    password: 'password',
    host: 'host',
    port: 0000,
    database: 'database'
})

// configurando a template engine
const nunjucks = require('nunjucks')
nunjucks.configure('./', {
    express: server,
    noCache: true, 
})

// para mandar o servidor pegar o barra e, também, para executar funcionalidades(minha percepção)
// configurar a apresentação da página(instrutor)
server.get('/', function(req, res) {
     db.query('SELECT * FROM donors', function(err, result){
         if (err) return res.send('Erro de banco de dados.')
        

        const donors = result.rows
        return res.render('index.html', { donors })
     })
})

server.post('/', function(req, res){
    // pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == '' || email == '' || blood == ''){
        return res.send('todos os campos são obrigatórios.')

    }
        // os valores estão dentro do banco e dados
        const query = `
            INSERT INTO donors ("name", "email", "blood") 
            VALUES ('$1, $2, $3')`
        const values = [name, email, blood]
    

    db.query(query, values, function(err){
        // fluxo de erro
        if (err) {
            console.log(err)

            return res.send('erro no banco de dados.') 
        } 
        // fluxo ideal 
        return res.redirect('/')
    })
})

// a funcionalidade listen() funciona para informar em qual porta o servidor vai rodar(minha percepção)
// ligar o servidor e permitir o acesso na porta 3000(instrutor)
server.listen(3000, function() {
    console.log('iniciei o servidor')
})
