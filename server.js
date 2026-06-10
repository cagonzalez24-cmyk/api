const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

// Función para leer los datos del archivo JSON
const obtenerClientes = () => {
    try {
        const data = fs.readFileSync('./clientes.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error leyendo el archivo JSON:", error);
        return [];
    }
};

// Endpoint 1: /creditos (Todos los créditos activos)
app.get('/creditos', (req, res) => {
    const clientes = obtenerClientes();
    const creditosActivos = clientes.filter(cliente => cliente.activo === true);
    res.json(creditosActivos);
});

// Endpoint 2: /creditos/:importe (Créditos activos mayores al importe)
app.get('/creditos/:importe', (req, res) => {
    const importeLimite = parseFloat(req.params.importe);
    
    if (isNaN(importeLimite)) {
        return res.status(400).json({ error: "El importe debe ser un número válido." });
    }

    const clientes = obtenerClientes();
    const creditosFiltrados = clientes.filter(cliente => 
        cliente.activo === true && cliente.credito > importeLimite
    );
    res.json(creditosFiltrados);
});

// Endpoint 3: /creditos-cliente/:id (Todos los créditos de un cliente por ID)
app.get('/creditos-cliente/:id', (req, res) => {
    const clienteId = req.params.id;
    const clientes = obtenerClientes();
    const clienteEncontrado = clientes.find(cliente => cliente.id === clienteId);

    if (!clienteEncontrado) {
        return res.status(404).json({ error: `No se encontró el cliente con ID: ${clienteId}` });
    }

    res.json({
        id: clienteEncontrado.id,
        nombre: clienteEncontrado.nombre,
        credito: clienteEncontrado.credito,
        activo: clienteEncontrado.activo
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});