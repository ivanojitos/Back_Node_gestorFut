const { sql, getPool } = require('../config/db');

class Jugador {

    static async findByCorreo(correo) {
        const pool = await getPool(); 

        const result = await pool.request()
            .input('Correo', sql.VarChar, correo.trim())
            .query(`
                SELECT TOP 1 * 
                FROM Jugadores 
                WHERE LTRIM(RTRIM(Correo)) = @correo
            `);

        return result.recordset[0];
    }

    static async create(data) {
        const pool = await getPool();

        const result = await pool.request()
            .input('NombreCompleto', sql.VarChar, data.NombreCompleto)
            .input('Edad', sql.Int, data.Edad)
            .input('Numero', sql.Int, data.Numero)
            .input('Posicion', sql.VarChar, data.Posicion)
            .input('Id_Liga', sql.Int, data.Id_Liga)
            .input('Correo', sql.VarChar, data.Correo)
            .input('Estatura', sql.Decimal(10,2), data.Estatura)
            .input('Foto', sql.VarChar, data.Foto)
            .input('Password', sql.VarChar, data.Password)
            .input('Estatus', sql.VarChar, 'Activo')
            .input('Id_Equipo', sql.Int, 1)
            .input('NumCampeonatos', sql.Int, 0)
            .query(`
                INSERT INTO Jugadores
                (NombreCompleto, Edad, Numero, Posicion, Id_Liga, Correo,
                 Estatura, Foto, Password, Estatus, Id_Equipo, NumCampeonatos)
                OUTPUT INSERTED.*
                VALUES
                (@NombreCompleto, @Edad, @Numero, @Posicion, @Id_Liga, @Correo,
                 @Estatura, @Foto, @Password, @Estatus, @Id_Equipo, @NumCampeonatos)
            `);

        return result.recordset[0];
    }
}

module.exports = Jugador;