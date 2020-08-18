const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next){
    var token = req.headers['authorization'];

    console.log(req.headers)

    if (!token) return res.status(401).json({ auth: false, message: 'Usuário não autenticado.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {

        console.log(err, decoded)
      if (err) return res.status(500).json({ auth: false, message: 'Falha ao autorizar o token.' });
      req.userId = decoded.user;
      next();
    });
}

module.exports = verifyJWT;