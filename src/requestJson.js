const fs = require('fs').promises;
const path = require('path');

const route = path.resolve(__dirname, './talker.json');

const requestTalker = async () => {
    const response = await fs.readFile(route, 'utf-8');
    const responseParse = JSON.parse(response);

    return responseParse;
};

const newTalker = async (newPerson) => {
    const response = await fs.writeFile('./talker.json', JSON.stringify(newPerson));
    return response;
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
   const response = (message) => res.status(400).send({ message });
   const { headers: { authorization } } = req;
   const { talk } = req.body;
   if (!authorization) {
    return res.status(401).send({ message: 'Token não encontrado' });
   }
   if (authorization.length < 16 && authorization !== String) {
    return res.status(401).send({ message: 'Token inválido' });
   }
   if (!talk) {
    return response('O campo "talk" é obrigatório');
   }
   next();
};

const personValidate = (req, res, next) => {
    const { name, age } = req.body;
    const response = (message) => res.status(400).send({ message });

    switch (true) {
        case (!name): return response('O campo "name" é obrigatório');
        case (name.length < 3): return response('O "name" deve ter pelo menos 3 caracteres');
        case (!age): return response('O campo "age" é obrigatório');
        case (age < 18): return response('A pessoa palestrante deve ser maior de idade');
        default: next();
    }
};

const talkValidate = (req, res, next) => {
    const { talk: { watchedAt, rate } } = req.body;
    const response = (message) => res.status(400).send({ message });
    // const validate = (key, message) => {
    //     if (!key) return response(message);
    //     console.log(key);
    // };
    // validate(rate, 'O campo "rate" é obrigatório');
    // validate(watchedAt, 'O campo "watchedAt" é obrigatório');
    // validate(validDate, 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"');
    // validate(rateValid, 'O campo "rate" deve ser um inteiro de 1 à 5');
    if (!rate) return response('O campo "rate" é obrigatório');
    if (!watchedAt) return response('O campo "watchedAt" é obrigatório');
    return next();
};

const rateAndDateValidate = (req, res, next) => {
  const { talk: { watchedAt, rate } } = req.body;
  const regexTalk = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
  const validDate = regexTalk.test(watchedAt);
  const response = (message) => res.status(400).send({ message });
  const rateValid = rate >= 1 && rate <= 5;
  const isNumber = Number.isInteger(rate);

  if (!validDate) return response('O campo "watchedAt" deve ter o formato "dd/mm/aaaa"');
  if (!rateValid || !isNumber) return response('O campo "rate" deve ser um inteiro de 1 à 5');
  return next();
};

module.exports = {
requestTalker,
tokenValidate,
validation,
personValidate,
talkValidate,
newTalker,
rateAndDateValidate,
};
