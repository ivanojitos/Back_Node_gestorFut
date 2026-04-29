const { sql, getPool } = require('../config/db');

class Categoria {
  // 🔥 CREAR
  static async create({ Nombre, Estatus, Id_Liga }) {
    const pool = await getPool();

    const result = await pool.request()
      .input("Nombre", Nombre)
      .input("Estatus", Estatus)
      .input("Id_Liga", Id_Liga)
      .query(`
        INSERT INTO Categorias (Nombre, Estatus, Id_Liga)
        OUTPUT INSERTED.*
        VALUES (@Nombre, @Estatus, @Id_Liga)
      `);

    return result.recordset[0];
  }

  // 🔥 OBTENER TODAS
  static async getAll() {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT 
        c.Id,
        c.Nombre,
        c.Estatus,
        c.Id_Liga,
        l.Nombre AS Liga
      FROM Categorias c
      INNER JOIN Ligas l ON l.Id = c.Id_Liga
      ORDER BY c.Id DESC
    `);

    return result.recordset;
  }

  // 🔥 OBTENER POR ID
  static async findById(id) {
    const pool = await getPool();

    const result = await pool.request()
      .input("Id", id)
      .query(`
        SELECT 
          c.Id,
          c.Nombre,
          c.Estatus,
          c.Id_Liga,
          l.Nombre AS Liga
        FROM Categorias c
        INNER JOIN Ligas l ON l.Id = c.Id_Liga
        WHERE c.Id = @Id
      `);

    return result.recordset[0];
  }

  // 🔥 ACTUALIZAR
  static async update(id, data) {
    const { Nombre, Estatus, Id_Liga } = data;

    const pool = await getPool();

    const result = await pool.request()
      .input("Id", id)
      .input("Nombre", Nombre)
      .input("Estatus", Estatus)
      .input("Id_Liga", Id_Liga)
      .query(`
        UPDATE Categorias
        SET 
          Nombre = @Nombre,
          Estatus = @Estatus,
          Id_Liga = @Id_Liga
        WHERE Id = @Id;

        SELECT * FROM Categorias WHERE Id = @Id;
      `);

    return result.recordset[0];
  }

  // 🔥 ELIMINAR (opcional pero PRO 🔥)
  static async delete(id) {
    const pool = await getPool();

    await pool.request()
      .input("Id", id)
      .query(`
        DELETE FROM Categorias WHERE Id = @Id
      `);

    return true;
  }
}

module.exports = Categoria;