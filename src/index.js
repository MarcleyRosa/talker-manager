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

  return res.status(200).json(talker);
});

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;
})
