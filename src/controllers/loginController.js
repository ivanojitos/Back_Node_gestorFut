const bcrypt = require("bcrypt");
const Jugador = require("../models/jugadorModel");

// LOGIN
exports.login = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(422).json({
      ok: false,
      errors: "correo y password requeridos",
    });
  }

  try {
    const jugador = await Jugador.findByCorreo(correo);

    if (!jugador) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado como vez loco",
      });
    }

    const okPassword = await bcrypt.compare(password, jugador.Password);

    if (!okPassword) {
      return res.status(401).json({
        ok: false,
        message: "Contraseña incorrecta",
        debug: {
          input_password: password,
          hash_bd: jugador.Password,
        },
      });
    }

    return res.json({
      ok: true,
      message: "Login correcto",
      user: jugador,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};

// CREAR JUGADOR
exports.crearJugador = async (req, res) => {
  const data = req.body;

  const required = ["nombre", "numero", "edad", "correo", "liga", "password"];

  for (let f of required) {
    if (!data[f]) {
      return res.status(422).json({
        ok: false,
        error: `Falta ${f}`,
      });
    }
  }

  try {
    const hashed = await bcrypt.hash(data.password, 10);

    const jugador = await Jugador.create({
      NombreCompleto: data.nombre,
      Edad: data.edad,
      Numero: data.numero,
      Posicion: data.posicion || null,
      Id_Liga: data.liga,
      Correo: data.correo,
      Estatura: data.estatura || null,
      Foto: null,
      Password: hashed,
    });

    return res.json({
      ok: true,
      message: "Usuario creado correctamente,aprobado mi niño",
      data: jugador,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};
