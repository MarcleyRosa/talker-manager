const express = require('express');
const bodyParser = require('body-parser');
const requestTalker = require('./requestJson');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
// PR do projeto
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
  const person = talker.filter((pers) => pers.id === Number(id) )
  if (!person[0]) throw new Error('Pessoa palestrante não encontrada')
  return res.status(200).json(person[0]);
  } catch (error) {
    return res.status(404).send({ message: 'Pessoa palestrante não encontrada'})
  }
})
