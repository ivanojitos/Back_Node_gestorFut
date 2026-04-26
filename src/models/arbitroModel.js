const { sql, getPool } = require("../config/db");

class Arbitro {
  static async create(data) {
    const pool = await getPool();

    const now = new Date();

    const result = await pool
      .request()
      .input("Nombre", sql.VarChar, data.Nombre)
      .input("Edad", sql.Int, data.Edad)
      .input("Estudios", sql.VarChar, data.Estudios)
      .input("Direccion", sql.VarChar, data.Direccion)
      .input("CP", sql.VarChar, data.CP)
      .input("Celular", sql.VarChar, data.Celular)
      .input("Correo", sql.VarChar, data.Correo)
      .input("Password", sql.VarChar, data.Password)
      .input("Estatus", sql.VarChar, "Activo")
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

  static async findByCorreo(correo) {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("correo", sql.VarChar, correo.trim()).query(`
                SELECT TOP 1 *
                FROM Arbitros
                WHERE LTRIM(RTRIM(Correo)) = @correo
            `);

    return result.recordset[0];
  }
}

module.exports = Arbitro;
