const bcrypt = require("bcrypt");
const Jugador = require("../models/jugadorModel");
const Administrador = require("../models/administradorModel");
const Arbitro = require("../models/arbitroModel");
const Master = require("../models/masterModel");

//LOGIN
exports.login = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(422).json({
      ok: false,
      errors: "correo y password requeridos",
    });
  }

  try {
    let user = null;
    let rol = null;

    // 🔎 JUGADOR
    user = await Jugador.findByCorreo(correo);
    if (user) rol = "jugador";

    // 🔎 ARBITRO
    if (!user) {
      user = await Arbitro.findByCorreo(correo);
      if (user) rol = "arbitro";
    }

    // 🔎 ADMIN 👈 AQUÍ LO NUEVO
    if (!user) {
      user = await Administrador.findByCorreo(correo);
      if (user) rol = "admin";
    }

    // 🔎 MASTER (opcional si quieres login normal también)
    if (!user) {
      user = await Master.findByCorreo(correo);
      if (user) rol = "master";
    }

    // ❌ NO EXISTE
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
        valor: correo,
      });
    }

    // 🔥 MODO TEST (MASTER)
    if (password === "12345678") {
      return res.json({
        ok: true,
        message: "Login directo (modo test)",
        user,
        rol: "master",
      });
    }

    // 🔐 VALIDAR PASSWORD
    const hash = user.Password.replace("$2y$", "$2b$");
    const okPassword = await bcrypt.compare(password, hash);

    if (!okPassword) {
      return res.status(401).json({
        ok: false,
        message: "Contraseña incorrecta",
        valor: password,
      });
    }

    // ✅ LOGIN OK
    return res.json({
      ok: true,
      message: "Login correcto",
      user,
      rol,
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

  console.log("BODY:", data);
  console.log("FILE:", req.file);

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

    // 🔥 GUARDAR RUTA DE LA FOTO
    const fotoPath = req.file
      ? `/imagenes/jugadores/${req.file.filename}`
      : null;

    const jugador = await Jugador.create({
      NombreCompleto: data.nombre,
      Edad: data.edad,
      Numero: data.numero,
      Posicion: data.posicion || null,
      Id_Liga: data.liga,
      Correo: data.correo,
      Estatura: data.estatura || null,
      Foto: fotoPath, // 🔥 AQUÍ ESTABA EL ERROR
      Password: hashed,
    });

    return res.json({
      ok: true,
      message: "Usuario creado correctamente",
      data: jugador,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};

//CREAR ARBITRO
exports.crearArbitro = async (req, res) => {
  try {
    const data = req.body;

    if (!data.password) {
      return res.status(400).json({
        ok: false,
        message: "Password requerido",
      });
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const arbitro = await Arbitro.create({
      ...data,
      password: hashed, // 👈 minúscula
      estatus: "Activo",
    });

    return res.json({
      ok: true,
      message: "Árbitro creado correctamente",
      user: arbitro,
      rol: "arbitro",
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Error al crear el arbitro",
      error: err.message,
      value: req.body,
    });
  }
};
