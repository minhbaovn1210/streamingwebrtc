var userRepo = require('../repos/user');
var jwtService = require('../utils/jwt');

module.exports = {
    test: async (req, res, next) => {
        //const data = await userRepo.findMany() || [];
        //const data = await userRepo.insertOne({name: 'tien'});
        //const data = await userRepo.insertMany([{name: 'A'}, {name:'B', age: 99}]);
        //const data = await userRepo.updateOne('5be13e422e90931a107dc7df', {age: 100})
        //const data = await userRepo.deleteOne('5be13f58d435f028c4167ba0')
        const data = await userRepo.findMany({name: 'tien'})
        res.json({
            status: 200,
            message: 'Sucess',
            data: data
        })
    },
    login: (req, res, next) => {
        const token = jwtService.signJWT({username: 'BaoTM2'});
        res.json({
            status: 200,
            message: 'login',
            data: {
            token
            }
        })
    },
    verifyToken: (req, res, next) => {
        res.json({
          status: 200,
          message: 'success',
          data: req.authInfo
        })
    }
}