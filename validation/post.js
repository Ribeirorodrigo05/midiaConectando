const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  
if(!Validator.isLength(data.text, {min:2, max:300})){
    errors.text = 'O comentário precisa ter entre 2 e 300 caracters  '
}


  if (Validator.isEmpty(data.text)) {
    errors.text = 'digite algo para começar';
  }

  
 

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
