const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  

  
if(!Validator.isLength(data.handle,{min:2, max:50})){
    errors.handle = "minimum of 2 and maximum of 50 characters"
}

if(Validator.isEmpty(data.handle)){
    errors.handle = "O Profile é obrigatório"
}

if(Validator.isEmpty(data.status)){
    errors.status = "O campo é obrigatório"
}

if(Validator.isEmpty(data.skills)){
    errors.skills = "As habilidades são obrigatórias"
}

if(!isEmpty(data.website)){
    if(!Validator.isURL(data.website)){
        errors.website = 'URL não válida'
    }
}

//validade media social
if(!isEmpty(data.youtube)){
    if(!Validator.isURL(data.youtube)){
        errors.youtube = 'URL não válida'
    }
}

if(!isEmpty(data.twitter)){
    if(!Validator.isURL(data.twitter)){
        errors.twitter = 'URL não válida'
    }
}

if(!isEmpty(data.facebook)){
    if(!Validator.isURL(data.facebook)){
        errors.facebook = 'URL não válida'
    }
}

if(!isEmpty(data.linkedin)){
    if(!Validator.isURL(data.linkedin)){
        errors.linkedin = 'URL não válida'
    }
}

if(!isEmpty(data.instagram)){
    if(!Validator.isURL(data.instagram)){
        errors.instagram = 'URL não válida'
    }
}

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
