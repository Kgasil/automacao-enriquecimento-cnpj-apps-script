/**
 * Automação de Enriquecimento e Higienização de Base Cadastral via APIs Públicas
 * Autor: Kaio Gabriel da Silva
 * Objetivo: Consultar CNPJs em lote, normalizar dados JSON e atualizar planilha de forma segura.
 */

const CONFIG = {
  NOME_ABA: 'Base_CNPJs',
  COLUNA_CNPJ: 1,        // Coluna A
  COLUNA_RAZAO_SOCIAL: 2, // Coluna B
  COLUNA_NOME_FANTASIA: 3,// Coluna C
  COLUNA_SITUACAO: 4,     // Coluna D
  COLUNA_MUNICIPIO: 5,    // Coluna E
  COLUNA_UF: 6,           // Coluna F
  COLUNA_CNAE: 7,         // Coluna G
  COLUNA_STATUS_SYNC: 8,  // Coluna H
  PAUSA_MS: 650           // Intervalo entre requisições para respeitar limites da API
};

function enriquecerBaseCNPJs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.NOME_ABA);

  if (!sheet) {
    throw new Error(`Aba "${CONFIG.NOME_ABA}" não encontrada.`);
  }

  const ultimaLinha = sheet.getLastRow();
  if (ultimaLinha < 2) {
    Logger.log('Nenhum CNPJ encontrado para processar.');
    return;
  }

  const dados = sheet.getRange(2, 1, ultimaLinha - 1, CONFIG.COLUNA_STATUS_SYNC).getDisplayValues();

  for (let i = 0; i < dados.length; i++) {
    const linhaAtual = i + 2;
    const cnpjBruto = String(dados[i][CONFIG.COLUNA_CNPJ - 1] || '');
    const cnpjLimpo = normalizarCNPJ(cnpjBruto);

    if (!cnpjLimpo || cnpjLimpo.length !== 14) {
      sheet.getRange(linhaAtual, CONFIG.COLUNA_STATUS_SYNC).setValue('CNPJ inválido');
      continue;
    }

    try {
      const registro = consultarDadosCNPJ(cnpjLimpo);

      sheet.getRange(linhaAtual, CONFIG.COLUNA_RAZAO_SOCIAL, 1, 6).setValues([[
        registro.razaoSocial,
        registro.nomeFantasia,
        registro.situacaoCadastral,
        registro.municipio,
        registro.uf,
        registro.cnaePrincipal
      ]]);

      sheet.getRange(linhaAtual, CONFIG.COLUNA_STATUS_SYNC)
        .setValue(`Atualizado (${registro.fonte}) - ${formatarDataHora(new Date())}`);

    } catch (erro) {
      sheet.getRange(linhaAtual, CONFIG.COLUNA_STATUS_SYNC)
        .setValue(`Erro: ${erro.message}`);
    }

    Utilities.sleep(CONFIG.PAUSA_MS);
  }
}

function normalizarCNPJ(valor) {
  return valor.replace(/\D/g, '');
}

function consultarDadosCNPJ(cnpj) {
  // Tentativa 1: BrasilAPI
  try {
    const urlBrasilApi = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;
    const resposta = UrlFetchApp.fetch(urlBrasilApi, { muteHttpExceptions: true });

    if (resposta.getResponseCode() === 200) {
      const json = JSON.parse(resposta.getContentText());
      return {
        razaoSocial: json.razao_social || '',
        nomeFantasia: json.nome_fantasia || 'Não informado',
        situacaoCadastral: json.descricao_situacao_cadastral || '',
        municipio: json.municipio || '',
        uf: json.uf || '',
        cnaePrincipal: json.cnae_fiscal_descricao || '',
        fonte: 'BrasilAPI'
      };
    }
  } catch (e) {
    Logger.log(`Falha na BrasilAPI para ${cnpj}: ${e.message}`);
  }

  // Tentativa 2 (Fallback): Minha Receita
  const urlMinhaReceita = `https://minhareceita.org/${cnpj}`;
  const respostaFallback = UrlFetchApp.fetch(urlMinhaReceita, { muteHttpExceptions: true });

  if (respostaFallback.getResponseCode() === 200) {
    const json = JSON.parse(respostaFallback.getContentText());
    return {
      razaoSocial: json.razao_social || '',
      nomeFantasia: json.nome_fantasia || 'Não informado',
      situacaoCadastral: json.descricao_situacao_cadastral || '',
      municipio: json.municipio || '',
      uf: json.uf || '',
      cnaePrincipal: json.cnae_fiscal_descricao || '',
      fonte: 'Minha Receita'
    };
  }

  throw new Error('Falha na consulta em ambas as APIs');
}

function formatarDataHora(data) {
  return Utilities.formatDate(data, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
}
