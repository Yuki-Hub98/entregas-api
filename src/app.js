import express from "express";
const app = express();
const PORT = 3000;

app.use(express.json());

const entregas = [

];

app.get("/", (req, res) => {
  res.status(200).send("Servidor Express ativo");
});


app.get("/entregas", (req, res) => {
  res.status(200).json(entregas);
});


app.get("/entregas/ativas", (req, res) => {
  res.status(200).json(entregas.filter(e => e.status === "em_rota"));
});


app.get("/entregas/resumo", (req, res) => {
  res.status(200).json(entregas.map(e => ({ id: e.id, status: e.status })));
});


app.get("/pendentes", (req, res) => {
  res.status(200).json(entregas.filter(e => e.status === "pendente"));
});


app.get("/motoristas", (req, res) => {
  const nome = req.query.nome;

  if (nome) {
    return res.status(200).json(
      entregas.filter(e => e.motorista.toLowerCase() === nome.toLowerCase())
    );
  }

  const motoristas = [...new Set(entregas.map(e => e.motorista))];
  res.status(200).json(motoristas);
});


app.get("/relatorio", (req, res) => {
  const total = entregas.length;
  const emRota = entregas.filter(e => e.status === 'em_rota').length;
  const entregues = entregas.filter(e => e.status === 'entregue').length;

  const porMotorista = {};

  entregas.forEach(e => {
    porMotorista[e.motorista] = (porMotorista[e.motorista] || 0) + 1;
  });

  let motoristaTop = null;
  let maiorTotal = 0;

  for (const m in porMotorista) {
    if (porMotorista[m] > maiorTotal) {
      maiorTotal = porMotorista[m];
      motoristaTop = m;
    }
  }

  res.status(200).json({
    total,
    emRota,
    entregues,
    porMotorista,
    motoristaComMaisEntregas: motoristaTop
  });
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

  res.status(200).json({
    totais,
    motoristaComMaisEntregas: motoristaTop,
    totalDeEntregas: maiorTotal
  });
});

app.post("/entregas", (req, res) => {
  const { motorista, status, veiculo } = req.body;

  if (!motorista || !status || !veiculo) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  const novaEntrega = {
    id: Date.now(),
    motorista,
    status,
    veiculo
  };

  entregas.push(novaEntrega);
  res.status(201).json(novaEntrega);
});

app.put("/entregas/:id", (req, res) => {
  const id = Number(req.params.id);
  const entrega = entregas.find(e => e.id === id);

  if (!entrega) return res.status(404).json({ erro: "Entrega não encontrada" });

  const { motorista, status, veiculo } = req.body;

  if (motorista) entrega.motorista = motorista;
  if (status) entrega.status = status;
  if (veiculo) entrega.veiculo = veiculo;

  res.json(entrega);
});

app.delete("/entregas/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = entregas.findIndex(e => e.id === id);

  if (index === -1) return res.status(404).json({ erro: "Entrega não encontrada" });

  const removida = entregas.splice(index, 1);
  res.json(removida[0]);
});


app.use((req, res) => {
  res.status(404).send("Rota não encontrada");
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
