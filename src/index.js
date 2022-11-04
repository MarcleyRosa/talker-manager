const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { requestTalker } = require('./requestJson');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

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

app.get('/talker', async (_req, res) => {
  const talker = await requestTalker();

  return res.status(HTTP_OK_STATUS).json(talker);
});

app.get('/talker/:id', async (req, res) => {
  const talker = await requestTalker();
  const { id } = req.params;
  try {
  const person = talker.filter((pers) => pers.id === Number(id));
  if (!person[0]) throw new Error('Pessoa palestrante não encontrada');
  return res.status(200).json(person[0]);
  } catch (error) {
    return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
  }
});

app.post('/login', validation, (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');

  return res.status(HTTP_OK_STATUS).json({ token });
});
