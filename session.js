//const cartFF = require('./factoryFunction');

module.exports = function userFunction() {
    const session = {};

    function getFunction(id){
     
        if(!session[id]){
            session[id] = cartFF();
            return session[id];
        } else {
            return session[id];
        }
    }
    
    return {
        getFunction
    }
}