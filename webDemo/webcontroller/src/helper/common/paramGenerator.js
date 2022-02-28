function paramGenerator(params=[]){
  let param="";
  for(let par in params){
    if(!(params[par][1] === undefined)){
      if(param === ""){
        param="?"+params[par][0]+"="+params[par][1];
      } else {
        param=param+"&"+params[par][0]+"="+params[par][1];
      }
    }
  }
  return param;
}

module.exports = {
  paramGenerator
};