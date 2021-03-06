const { connect } = require("http2");
const { builtinModules } = require("module");

let connection = null;
require("dotenv").config();

function getConnetion() {
    return connection;
}

async function init() {
    return new Promise((res, rej) => {
        const { Pool } = require('pg');
        const pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        connection = pool;
        pool.connect(function(err) {
            if (err) {
                return rej(err);
            }
            return res();
        });
    });
}
/**
 * @param {*} query Parametros de query a serem passados "UPDATE, CREATE, DELETE, INSERT"
 * @param {*} values Valores a serem inseridos ou modificados.
 * cada "?" representa um parametro para ser passado
 * Modelo referencia: const response = await execute("UPDATE user SET name = ? WHERE id = ?;", [nome, user]);
 * @returns
 */
async function execute(query, values) {
    return new Promise((res, rej) => {
        pool.query(query, values, function(err, result) {
            if (err) {
                return rej(err);
            }
            return res(result);
        })
    });
}

module.exports = { init, execute }