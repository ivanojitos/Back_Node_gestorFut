const { sql, getPool } = require('../config/db');

class Arbitro {

    static async create(data) {
        const pool = await getPool();

        const now = new Date();

        const result = await pool.request()
            .input('Nombre', sql.VarChar, data.nombre)
            .input('Edad', sql.Int, data.edad)
            .input('Estudios', sql.VarChar, data.estudios)
            .input('Direccion', sql.VarChar, data.direccion)
            .input('CP', sql.VarChar, data.cp)
            .input('Celular', sql.VarChar, data.celular)
            .input('Correo', sql.VarChar, data.correo)
            .input('Password', sql.VarChar, data.password)
            .input('Estatus', sql.VarChar, 'Activo')
            .input('created_at', sql.DateTime, now)
            .input('updated_at', sql.DateTime, now)
            .query(`
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

        const result = await pool.request()
            .input('correo', sql.VarChar, correo.trim())
            .query(`
                SELECT TOP 1 *
                FROM Arbitros
                WHERE LTRIM(RTRIM(Correo)) = @correo
            `);

        return result.recordset[0];
    }
}

module.exports = Arbitro;