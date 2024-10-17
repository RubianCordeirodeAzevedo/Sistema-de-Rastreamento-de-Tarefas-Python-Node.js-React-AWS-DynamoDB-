const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Simulação de envio de notificação quando uma tarefa é concluída
app.post('/notify', (req, res) => {
    const { task_id } = req.body;
    console.log(`Notificação: A tarefa ${task_id} foi concluída!`);
    res.status(200).send({ message: `Notificação enviada para a tarefa ${task_id}.` });
});

app.listen(3002, () => {
    console.log('Servidor de notificações rodando na porta 3002.');
});
