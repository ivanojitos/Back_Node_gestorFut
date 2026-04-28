const { sql, getPool } = require("../config/db");

class Admin {
  // 🔥 CREAR
  static async create(data) {
    const pool = await getPool();
    const now = new Date();

    const result = await pool
      .request()
      .input("Celular", sql.VarChar(15), data.Celular || null)
      .input("Id_Ligas", sql.Int, data.Id_Ligas || null)
      .input("Estatus", sql.VarChar(15), data.Estatus || "Activo")
      .input("Password", sql.VarChar(255), data.Password)
      .input("Correo", sql.VarChar(100), data.Correo)
      .input("created_at", sql.DateTime, now)
      .input("updated_at", sql.DateTime, now)
      .query(`
        INSERT INTO Administradores
        (Celular, Id_Ligas, Estatus, Password, Correo, created_at, updated_at)
        OUTPUT INSERTED.*
        VALUES
        (@Celular, @Id_Ligas, @Estatus, @Password, @Correo, @created_at, @updated_at)
      `);

    return result.recordset[0];
  }

  // 🔥 OBTENER TODOS
  static async getAll() {
    const pool = await getPool();

    const result = await pool
      .request()
      .query(`
        SELECT 
          a.*, 
          l.Nombre AS LigaNombre
        FROM Administradores a
        LEFT JOIN Ligas l ON a.Id_Ligas = l.Id
        ORDER BY a.Id DESC
      `);

    return result.recordset;
  }

  //OBTENER POR CORREO
  static async findByCorreo(correo) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("Correo", sql.VarChar, correo)
    .query("SELECT * FROM Administradores WHERE Correo = @Correo");

  return result.recordset[0];
}
}

module.exports = Admin;