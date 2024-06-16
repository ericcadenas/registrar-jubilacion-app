const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
const port = 3000;

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'registrar_jubilacion.sqlite'
});

// Define a model for Retirement
const Retirement = sequelize.define('Retirement', {
  dniAfiliado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellidoAfiliado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nombreAfiliado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entidadFondoPensiones: {
    type: DataTypes.STRING,
    allowNull: false
  },
  montoJubilacion: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  modalidadPension: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Sync the database
sequelize.sync();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML file for /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/save-retirement', async (req, res) => {
  const { dniAfiliado, apellidoAfiliado, nombreAfiliado, entidadFondoPensiones, montoJubilacion, modalidadPension } = req.body;

  try {
    await Retirement.create({
      dniAfiliado,
      apellidoAfiliado,
      nombreAfiliado,
      entidadFondoPensiones,
      montoJubilacion,
      modalidadPension
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Handle search
app.get('/search-retirement', async (req, res) => {
  const { dniAfiliado } = req.query;

  try {
    const results = await Retirement.findAll({
      where: {
        dniAfiliado
      }
    });
    res.json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Registrar Jubilacion app listening at http://localhost:${port}`);
});
