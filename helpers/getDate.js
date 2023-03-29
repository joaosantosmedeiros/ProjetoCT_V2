module.exports.getDate = function (data) {
    let data_objeto = new Date(data);
    let dia = data_objeto.getDate().toString().padStart(2, '0');
    let mes = (data_objeto.getMonth() + 1).toString().padStart(2, '0');
    let ano = data_objeto.getFullYear().toString();
    let hora = data_objeto.getHours().toString().padStart(2, '0');
    let minutos = data_objeto.getMinutes().toString().padStart(2, '0');
    let segundos = data_objeto.getSeconds().toString().padStart(2, '0');
    let data_formatada = dia + '-' + mes + '-' + ano + ' ' + hora + ':' + minutos + ':' + segundos;

    return data_formatada
}