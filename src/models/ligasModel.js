const { sql, getPool } = require('../config/db');

class Liga {

  // 🔥 CREAR
  static async create(data) {
    const pool = await getPool();
    const now = new Date();

    const result = await pool.request()
      .input("Nombre", sql.VarChar(50), data.Nombre)
      .input("Logo", sql.VarChar(255), data.Logo || null)
      .input("Direccion", sql.VarChar(150), data.Direccion || null)
      .input("Celular", sql.VarChar(10), data.Celular || null)
      .input("Estatus", sql.VarChar(15), data.Estatus || "Activo")
      .input("created_at", sql.DateTime, now)
      .input("updated_at", sql.DateTime, now)
      .query(`
        INSERT INTO Ligas
        (Nombre, Logo, Direccion, Celular, Estatus, created_at, updated_at)
        OUTPUT INSERTED.*
        VALUES
        (@Nombre, @Logo, @Direccion, @Celular, @Estatus, @created_at, @updated_at)
      `);

    return result.recordset[0];
  }

  // 🔥 OBTENER TODAS
  static async getAll() {
    const pool = await getPool();

    const result = await pool.request()
      .query(`SELECT * FROM Ligas ORDER BY Id DESC`);

    return result.recordset;
  }

  // 🔥 OBTENER UNA
  static async getById(id) {
    const pool = await getPool();

    const result = await pool.request()
      .input("Id", sql.Int, parseInt(id))
      .query(`SELECT * FROM Ligas WHERE Id = @Id`);

    return result.recordset[0];
  }
}

module.exports = Liga;