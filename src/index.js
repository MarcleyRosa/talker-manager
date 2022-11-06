const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { requestReadJson, validation, tokenValidate, personValidate,
   watchedAtValidate, writeJson, rateValidate, talkValidate } = require('./requestJson');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (_req, res) => {
  const talker = await requestReadJson();

  return res.status(HTTP_OK_STATUS).json(talker);
});

app.get('/talker/search', tokenValidate, async (req, res) => {
  try {
  const { q } = req.query;
  const talker = await requestReadJson();

  if (q) {
    const serach = talker.filter((tal) => tal.name.includes(q));
    res.status(200).json(serach);
  } else {
    res.status(200).json(talker);
  }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

app.get('/talker/:id', async (req, res) => {
  const talker = await requestReadJson();
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

app.post('/talker', tokenValidate, personValidate, talkValidate, watchedAtValidate,
 rateValidate, async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talker = await requestReadJson();
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
  const postAllTalker = [...talker, newPerson];
  await writeJson(postAllTalker);
  res.status(201).json(newPerson);
});

app.put('/talker/:id', tokenValidate, personValidate, talkValidate, watchedAtValidate,
 rateValidate, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const talker = await requestReadJson();

  talker[Number(id) - 1].id = Number(id);
  talker[Number(id) - 1].name = name;
  talker[Number(id) - 1].age = age;
  talker[Number(id) - 1].talk = talk;
  await writeJson(talker);
  return res.status(HTTP_OK_STATUS).json(talker[Number(id) - 1]);
});

app.delete('/talker/:id', tokenValidate, async (req, res) => {
  const talker = await requestReadJson();
  const { id } = req.params;

  const deletePerson = talker.filter((del) => del.id !== Number(id));

  await writeJson(deletePerson);
  return res.status(204).end();
});

app.use((err, _req, _res, next) => {
  console.error(err.stack);
  next(err);
});

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: `Algo deu errado! Mensagem: ${err.message}` });
});
