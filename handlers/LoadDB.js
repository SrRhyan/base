const { connect, set, connection } = require('mongoose');
require("colors")
set("strictQuery", false);
const { delay } = require("../functions/functions")
const config = require("js-yaml").load(require('fs').readFileSync(`./config.yaml`, 'utf8'))

module.exports = async (client) => {
    return new Promise(async (res) => {
        console.log(`「📡 - Console」`.yellow, "Carregando o banco de dados...")
        
        let dat = new Date()
        connect(config.mongoUri).then(async (data) => { client.DataBases.set("Principal", new Date - dat) }).catch(err =>client.CapturarErro(new Error(err), "Erro"));
        var errer = 0;
        connection.on("error", async (err) => {
            client.CapturarErro("DB COM ERRO", "Erro")
            errer++;
            if (errer == 5) return client.CapturarErro("Não é possível reconectar, está acima do limite de tentativas", "Erro");
            await delay(2_000);
            await connect(config.mongoUri);
        })
        var fechado = 0;
        connection.on("close", async (err) => {
            client.CapturarErro("DB FECHADO", "Erro")
            fechado++;
            if (fechado == 5) return console.log(`Não é possível reconectar, está acima do limite de tentativa`.bgRed);
            await delay(2_000);
            await connect(config.mongoUri);
        })
        var desconectado = 0;
        connection.on("disconnected", async (err) => {
            client.CapturarErro("DB DESCONECTADO", "Erro")
            desconectado++;
            if (desconectado == 5) return console.log(`Não é possível reconectar, está acima do limite de tentativas`.bgRed);
            await delay(2_000);
            await connect(config.mongoUri);
        })
        connection.on("open", async () => {
            console.log(`「📡 - Console」`.blue, "Conectado ao banco de dados!")
    })
    })
}