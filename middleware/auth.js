const jwt = require('jsonwebtoken');

exports.authenticate = (req,res,next) => {
    const authToken = req.get('cookie');
    if(!authToken) {
        req.isAuth = false;
        next();
    }
    const token = req.cookies.jwtToken;
    if(!token) {
        req.isAuth = false;
        next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token,process.env.SECRET_KEY);
    }
    catch(err) {
        req.isAuth = false;
        next();
    }
    if(!decodedToken) {
        req.isAuth = false;
        next();
    }
    req.isAuth = true;
    req.id = decodedToken.id;
    next();

}