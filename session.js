const authFF = require('./test');

module.exports = function userFunction() {
    const session = {};

    function getFunction(id){
     
        if(!session[id]){
            session[id] = authFF();
            return session[id];
        } else {
            return session[id];
        }
    }
    
    return {
        getFunction
    }
}