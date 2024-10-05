const express = require('express'); 
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Configurações para o body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Rota para receber dados do formulário de freteiros
app.post('/add-freteiro', (req, res) => {
    const freteiroData = req.body;

    // Verifica se os dados estão corretos antes de prosseguir
    if (!freteiroData.codigo || !freteiroData.freteiro || !freteiroData.motivo || !freteiroData.nota || !freteiroData.valor) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    // Lê o arquivo existente ou cria um novo se não existir
    fs.readFile('freteiros.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).send('Erro ao ler o arquivo de dados.');
        }

        // Parseia os dados existentes ou cria um array vazio se o arquivo estiver vazio
        const freteiros = data ? JSON.parse(data) : [];

        // Adiciona o novo freteiro ao array
        freteiros.push(freteiroData);

        // Salva os dados de volta no arquivo
        fs.writeFile('freteiros.json', JSON.stringify(freteiros, null, 2), (err) => {
            if (err) {
                console.error('Erro ao salvar os dados:', err);
                return res.status(500).send('Erro ao salvar os dados.');
            }
            res.send('Freteiro cadastrado com sucesso!');
        });
    });
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
