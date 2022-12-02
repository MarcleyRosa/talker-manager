const fs = require('fs').promises;
const path = require('path');

const route = path.resolve(__dirname, './talker.json');

const requestReadJson = async () => {
    const response = await fs.readFile(route, 'utf-8');
    const responseParse = JSON.parse(response);

    return responseParse;
};

const writeJson = async (newPerson) => {
  await fs.writeFile(route, JSON.stringify(newPerson, null, 2));
};

const validation = (req, res, next) => {
    const { email, password } = req.body;
    const regex = /^\S+@\S+\.\S+$/;
    const validEmail = regex.test(email);
    if (email === undefined) {
     return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    }
    if (password === undefined) {
      return res.status(400).json({ message: 'O campo "password" é obrigatório' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
    }
    if (!validEmail) {
      return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
    }
    return next();
  };

const tokenValidate = (req, res, next) => {
  //  const response = (message) => res.status(400).send({ message });
   const { headers: { authorization } } = req;
   if (!authorization) {
    return res.status(401).send({ message: 'Token não encontrado' });
   }
   if (authorization.length < 16 && authorization !== String) {
    return res.status(401).send({ message: 'Token inválido' });
   }
   next();
};

const personValidate = (req, res, next) => {
  const { name, age } = req.body;
  const response = (message) => res.status(400).send({ message });
  
  if (!name) return response('O campo "name" é obrigatório');
  if (name.length < 3) return response('O "name" deve ter pelo menos 3 caracteres');
  if (!age) return response('O campo "age" é obrigatório');
  if (age < 18) return response('A pessoa palestrante deve ser maior de idade');
        
  return next();
};

const watchedAtValidate = (req, res, next) => {
    const { talk: { watchedAt } } = req.body;
    const response = (message) => res.status(400).send({ message });
    const regexTalk = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
    const validDate = regexTalk.test(watchedAt);

    // const validate = (key, message) => {
    //   if (!key) {
    //     return res.status(400).send({ message });
    //   }
    // };
    // return validate(watchedAt, 'O campo "watchedAt" é obrigatório') ||
    // validate(validDate, 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"')
    // || next();

    if (!watchedAt) return response('O campo "watchedAt" é obrigatório');
    if (!validDate) return response('O campo "watchedAt" deve ter o formato "dd/mm/aaaa"');
    return next();
};

const rateValidate = (req, res, next) => {
  const { talk } = req.body;
  const response = (message) => res.status(400).send({ message });
  const rateValid = talk.rate >= 1 && talk.rate <= 5;
  const isNumber = Number.isInteger(talk.rate);
  
  if (talk.rate === undefined) return response('O campo "rate" é obrigatório');
  if (!rateValid || !isNumber) return response('O campo "rate" deve ser um inteiro de 1 à 5');
  return next();
};

const talkValidate = (req, res, next) => {
  const { talk } = req.body;
  const response = (message) => res.status(400).send({ message });
  if (!talk) return response('O campo "talk" é obrigatório');
  return next();
};

module.exports = {
requestReadJson,
tokenValidate,
validation,
personValidate,
watchedAtValidate,
writeJson,
rateValidate,
talkValidate,
};
