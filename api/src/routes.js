const { Router } = require('express');

const db = require('./connection')

const jwtVerify = require('./middleware/jwt')

var multer = require('multer');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const routes = Router();

var upload = multer({ dest: 'uploads/' })

routes.get('/', (req, res) => {
    res.json({ message: "Tudo ok por aqui!" });
})

routes.get('/clientes', jwtVerify, (req, res) => {
    res.json([{ id: 1, nome: 'luiz' }]);
})

routes.post('/login', (req, response) => {

    const { email, password } = req.body;

    console.log(email, password)

    if (email, password) {

        db.query('SELECT * FROM users WHERE email = ?', [email],
            function (error, results) {
                if (results && results.length > 0) {

                    console.log(password, results[0].password)
                    bcrypt.compare(password, results[0].password, function (err, res) {
                        if (res) {
                            const user = results[0].id;

                            const token = jwt.sign({ user }, process.env.SECRET, {
                                expiresIn: 300 // expires in 5min
                            });
                            console.log(user)

                            return response.status(200).json({
                                auth: true, token: token,
                                messsage: "Login realizado com sucesso!"
                            });

                        }
                        else {
                            return response.send('Usuário ou senha Incorretos!')
                        }
                    })

                } else {
                    return response.send('Usuário não encontrado no banco de dados!')
                }
            })
    }
    else {
        return res.send('Informe E-mail e Senha.')
    }

})

routes.post('/create/user', (req, res) => {

    const { email, password, name } = req.body;

    if (email && password && name) {

        db.query('SELECT * FROM users WHERE email = ?', [email],
            function (err, results) {
                if (results && results.length > 0) {
                    res.send('Já existe um usuário com este e-mail!')
                }
                else {
                    bcrypt.hash(password, 10, function (err, hash) {

                        const insert = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${hash}', now())`;

                        db.query(insert, function (err, result) {
                            if (err) throw err;
                            return res.send('Usuário criado com sucesso!')
                        });
                    });
                }
            })
    }
    else {
        return res.send('Informe todos os dados solicitados para continuar.')
    }

})

routes.post('/logout', jwtVerify, function (req, res) {

    res.json({ auth: false, token: null });
})

routes.post('/post', jwtVerify, upload.single('avatar'), function (req, res) {

    console.log(req.body)

    const { title } = req.body

    const user_id = req.userId

    const insert = `INSERT INTO posts (user_id, title, image_url, created_at)
 VALUES ('${user_id}', '${title}', '${req.file.filename}', now())`;

    db.query(insert, function (err, result) {
        if (err) throw err;
        return res.send('Post criado com sucesso!')
    });

})

module.exports = routes;