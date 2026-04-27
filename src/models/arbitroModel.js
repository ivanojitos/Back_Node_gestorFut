const { sql, getPool } = require("../config/db");

class Arbitro {
  // 🔥 CREAR ÁRBITRO
  static async create(data) {
    const pool = await getPool();
    const now = new Date();

    const result = await pool
      .request()
      .input("Nombre", sql.VarChar(100), data.nombre)
      .input("Edad", sql.Int, data.edad || null)
      .input("Estudios", sql.VarChar(100), data.estudios || null)
      .input("Direccion", sql.VarChar(150), data.direccion || null)
      .input("CP", sql.VarChar(10), data.cp || null)
      .input("Celular", sql.VarChar(10), data.celular || null)
      .input("Correo", sql.VarChar(100), data.correo)
      .input("Password", sql.VarChar(255), data.password) // 🔐 ya viene hasheado
      .input("Estatus", sql.VarChar(15), "Activo")
      .input("created_at", sql.DateTime, now)
      .input("updated_at", sql.DateTime, now).query(`
        INSERT INTO Arbitros
        (Nombre, Edad, Estudios, Direccion, CP, Celular, Estatus, Correo, Password, created_at, updated_at)
        OUTPUT INSERTED.*
        VALUES
        (@Nombre, @Edad, @Estudios, @Direccion, @CP, @Celular, @Estatus, @Correo, @Password, @created_at, @updated_at)
      `);

    return result.recordset[0];
  }

  // 🔍 BUSCAR POR CORREO (LOGIN)
  static async findByCorreo(correo) {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("correo", sql.VarChar(100), correo.trim()).query(`
        SELECT TOP 1 *
        FROM Arbitros
        WHERE LTRIM(RTRIM(Correo)) = @correo
      `);

    return result.recordset[0];
  }

  static async findById(id) {
    const pool = await getPool();

    const result = await pool.request().input("id", sql.Int, id).query(`
      SELECT * FROM Arbitros WHERE Id = @id
    `);

    return result.recordset[0];
  }

  static async update(id, data) {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("Nombre", sql.VarChar(100), data.Nombre)
      .input("Edad", sql.Int, data.Edad)
      .input("Estudios", sql.VarChar(100), data.Estudios)
      .input("Direccion", sql.VarChar(150), data.Direccion)
      .input("Celular", sql.VarChar(10), data.Celular)
      .input("Correo", sql.VarChar(100), data.Correo).query(`
      UPDATE Arbitros
      SET Nombre = @Nombre,
          Edad = @Edad,
          Estudios = @Estudios,
          Direccion = @Direccion,
          Celular = @Celular,
          Correo = @Correo
      OUTPUT INSERTED.*
      WHERE Id = @id
    `);

    return result.recordset[0];
  }
}

module.exports = Arbitro;
