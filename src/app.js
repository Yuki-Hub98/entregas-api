import express from "express";
const app = express();
const PORT = 3000;

app.use(express.json());

const entregas = [
  { id: 1, motorista: 'Carlos', status: 'em_rota', veiculo: 'Caminhão 01' },
  { id: 2, motorista: 'Ana', status: 'entregue', veiculo: 'Van 03' },
  { id: 3, motorista: 'João', status: 'pendente', veiculo: 'Caminhão 02' },
  { id: 4, motorista: 'Carlos', status: 'em_rota', veiculo: 'Van 01' }
];

app.get("/", (req, res) => {
  res.send("Servidor Express ativo");
});


app.get("/entregas", (req, res) => {
  res.json(entregas);
});


app.get("/entregas/ativas", (req, res) => {
  res.json(entregas.filter(e => e.status === "em_rota"));
});


app.get("/entregas/resumo", (req, res) => {
  res.json(entregas.map(e => ({ id: e.id, status: e.status })));
});


app.get("/pendentes", (req, res) => {
  res.json(entregas.filter(e => e.status === "pendente"));
});


app.get("/motoristas", (req, res) => {
  const nome = req.query.nome;

  if (nome) {
    return res.json(
      entregas.filter(e => e.motorista.toLowerCase() === nome.toLowerCase())
    );
  }

  const motoristas = [...new Set(entregas.map(e => e.motorista))];
  res.json(motoristas);
});


app.get("/relatorio", (req, res) => {
  const total = entregas.length;
  const emRota = entregas.filter(e => e.status === 'em_rota').length;
  const entregues = entregas.filter(e => e.status === 'entregue').length;

  res.json({ total, emRota, entregues });
});

app.get("/status-entregas", (req, res) => {
  const totais = {};

  entregas.forEach(e => {
    totais[e.motorista] = (totais[e.motorista] || 0) + 1;
  });

  let motoristaTop = null;
  let maiorTotal = 0;

  for (const m in totais) {
    if (totais[m] > maiorTotal) {
      maiorTotal = totais[m];
      motoristaTop = m;
    }
  }

  res.json({
    totais,
    motoristaComMaisEntregas: motoristaTop,
    totalDeEntregas: maiorTotal
  });
});

app.use((req, res) => {
  res.status(404).send("Rota não encontrada");
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
