const { sql, getPool } = require("../config/db");

class Master {
  static async findByCorreo(correo) {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("Correo", sql.VarChar, correo.trim()).query(`
                SELECT TOP 1 * 
                FROM Master 
                WHERE LTRIM(RTRIM(Correo)) = @correo
            `);

    return result.recordset[0];
  }
}

module.exports = Master;
