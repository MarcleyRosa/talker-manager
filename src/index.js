const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { requestTalker, validation, tokenValidate, personValidate,
   talkValidate, newTalker, rateAndDateValidate } = require('./requestJson');

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

app.post('/login', validation, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');

  res.header({ authorization: token });
  return res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker', tokenValidate, personValidate, talkValidate,
 rateAndDateValidate, async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talker = await requestTalker();
  const newId = talker[talker.length - 1].id + 1;

  const newPerson = {
      id: newId,
      name,
      age,
      talk: {
        watchedAt,
        rate,
      },
  };
  const test = [...talker, newPerson];
  const fist = talker.filter((e) => e.id === newId);
  await newTalker(test);
  console.log(fist);
  res.status(201).json(newPerson);
});

app.put('/talker/:id', tokenValidate, personValidate, talkValidate,
 rateAndDateValidate, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const talker = await requestTalker();

  talker[Number(id) - 1].name = name;
  talker[Number(id) - 1].age = age;
  talker[Number(id) - 1].talk = talk;
  console.log(talker);
  return res.status(HTTP_OK_STATUS).json(talker);
});
