const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  

  if (Validator.isEmpty(data.school)) {
    errors.title = 'O campo é obrigatório';
  }

  if(Validator.isEmpty(data.degree)){
      errors.company ='O campo é obrigatório'
  }


  if(Validator.isEmpty(data.fieldofstudy)){
    errors.from ='O campo é obrigatório'
}

  if(Validator.isEmpty(data.from)){
    errors.from ='O campo é obrigatório'
}

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
