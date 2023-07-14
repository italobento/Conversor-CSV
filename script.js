import fs from 'fs';
import path from 'path';

const PASTA_TXT = 'Arquivos TXT/';
const PASTA_CSV = 'Arquivos CSV/';
const FORMATO_NOVO_ARQUIVO = '.csv';

iniciar();

function formatarArquivo(caminhoArquivo) {
    let conteudoArquivo = lerArquivo(caminhoArquivo);

    if (!conteudoArquivo) {
        return;
    }

    const REGEX_DATA = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g;
    const REGEX_HORA = /(?<=([0-9]{2}\:[0-9]{2})) -/g;
    const REGEX_NOME_PESSOA = /(?<=([0-9]{2}\:[0-9]{2}); )([^:|\n]*)/g;

    // Organizar arquivo para deixar cada mensagem em uma linha
    conteudoArquivo = replaceByRegex(conteudoArquivo, /;/g, ',');
    conteudoArquivo = replaceByRegex(conteudoArquivo, /(\r\n|\n|\r)/g, ', ');
    conteudoArquivo = replaceByRegex(conteudoArquivo, /, (?=([0-9]{2}\/[0-9]{2}\/[0-9]{4}))/g, '\n');

    // Organizar arquivo para formato CSV
    conteudoArquivo = replaceByRegex(conteudoArquivo, /;/g, ',');
    conteudoArquivo = replaceByRegex(conteudoArquivo, REGEX_DATA, '$&;');
    conteudoArquivo = replaceByRegex(conteudoArquivo, REGEX_HORA, ';');
    conteudoArquivo = replaceByRegex(conteudoArquivo, REGEX_NOME_PESSOA, '$&;');
    conteudoArquivo = replaceByRegex(conteudoArquivo, /;:/g, ';');

    let nomeArquivoExtensao = caminhoArquivo.replace(/^.*[\\\/]/, '');
    let nomeArquivoSemExtensao = nomeArquivoExtensao.substring(0, nomeArquivoExtensao.lastIndexOf('.'));

    let caminhoSaida = PASTA_CSV + nomeArquivoSemExtensao + FORMATO_NOVO_ARQUIVO
    gravarArquivo(conteudoArquivo, caminhoSaida);
}

function gravarArquivo(conteudo, caminhoSaida) {

    let diretorioSaida = path.dirname(caminhoSaida);

    if (!fs.existsSync(diretorioSaida)) {
        fs.mkdirSync(diretorioSaida);
    }

    fs.writeFile(caminhoSaida, conteudo, (err) => {
        if (err) throw err;

        console.log('\x1b[32m%s\x1b[0m', path.basename(caminhoSaida) + ' salvo com sucesso.');
    });
}

function iniciar() {
    let listaArquivos = fs.readdirSync(PASTA_TXT);

    listaArquivos.forEach(arquivo => {
        formatarArquivo(PASTA_TXT + arquivo);
    });
}

function lerArquivo(caminhoArquivo) {
    const ARQUIVO_ENTRADA = caminhoArquivo;

    if (!fs.existsSync(ARQUIVO_ENTRADA)) {
        console.log('\x1b[33m%s\x1b[0m', '[AVISO] Caminho incorreto do arquivo: ' + ARQUIVO_ENTRADA);
        return;
    }

    return fs.readFileSync(ARQUIVO_ENTRADA, { encoding: 'utf8' }, (err, data) => {
        if (err) throw err;
        if (data) return data;
    })
}

function replaceByRegex(conteudoArquivo, regex, caracter) {
    return conteudoArquivo.replace(regex, caracter);
}