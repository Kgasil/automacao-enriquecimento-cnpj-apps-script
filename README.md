# Automação de Enriquecimento e Higienização de Base Cadastral (Google Apps Script)

<!-- kg-personal-portfolio-v1 -->

[KG Professional Portfolio 1.0 — Portfólio pessoal / Personal portfolio](https://kgasil.github.io/portfolio/) · [Estudo de caso / Case study](https://kgasil.github.io/portfolio/cases.html#enrichment) · [Demonstração ilustrativa / Illustrative demo](https://kgasil.github.io/portfolio/lab.html#quality)

<!-- kg-current-training -->
[Formação e experiência atualizadas / Updated education and experience](https://kgasil.github.io/portfolio/resume.html).


Projeto demonstrativo voltado à **governança de dados, higienização cadastral e automação de rotinas de backoffice** utilizando **Google Apps Script** e integração com APIs públicas (`BrasilAPI` e `Minha Receita`).
> 🌐 *English version available below:* [Jump to English Version](#english-version)
---

## 🎯 Contexto e Problema

Em rotinas operacionais e de qualificação de bases corporativas, o preenchimento manual de dados cadastrais a partir de listas de CNPJs gera lentidão, erros de digitação e inconsistência na padronização de informações.

## 🚀 Solução Implementada

O script em `Codigo.gs` automatiza o processamento em lote de CNPJs dentro do Google Sheets:
* **Normalização de entrada:** Remove máscaras e valida o formato de 14 dígitos do CNPJ.
* **Consulta com redundância (Fallback):** Busca os dados primariamente na **BrasilAPI** e, em caso de instabilidade ou indisponibilidade, realiza consulta secundária na **Minha Receita**.
* **Padronização e auditoria:** Preenche razão social, nome fantasia, situação cadastral, localização e CNAE principal, registrando status e carimbo de data/hora.
* **Controle de ritmo:** Aplica pausa configurável entre requisições (`Utilities.sleep`) para reduzir falhas por limite de taxa.

## 🛠️ Tecnologias Utilizadas

* **Google Apps Script (JavaScript)**
* **APIs REST & JSON** (BrasilAPI / Minha Receita)
* **Google Sheets**

## 📋 Estrutura Esperada na Planilha

Crie uma aba chamada `Base_CNPJs` com os seguintes cabeçalhos na linha 1:

| Coluna A | Coluna B | Coluna C | Coluna D | Coluna E | Coluna F | Coluna G | Coluna H |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CNPJ | Razão Social | Nome Fantasia | Situação Cadastral | Município | UF | CNAE Principal | Status Sincronização |
---

## Execução e limites

Crie a aba indicada acima, configure a coluna A como texto simples (para manter zeros à esquerda) e cole `Codigo.gs` em Extensões → Apps Script. Execute `enriquecerBaseCNPJs` em uma cópia de teste e autorize o acesso à planilha e às APIs. A validação é de formato numérico com 14 dígitos, não de dígitos verificadores. A coluna G contém a descrição do CNAE. Respeite quotas e limites dos provedores; não publique dados de clientes.

---

<a id="english-version"></a>

# Automated CNPJ Enrichment & Data Cleansing (Google Apps Script)

Demonstrative project focused on **data governance**, **master data cleansing**, and **backoffice workflow automation** using **Google Apps Script** integrated with public APIs (**BrasilAPI** and **Minha Receita**).

## 🎯 Context & Problem

In operational routines and corporate lead/account qualification, manually filling company registration data from CNPJ lists causes delays, typing errors, and inconsistent formatting.

## 🚀 Implemented Solution

The `Codigo.gs` script automates batch CNPJ processing inside **Google Sheets**:

* **Input Normalization:** Strips formatting masks and validates the 14-digit CNPJ structure.
* **Fallback Redundancy:** Queries **BrasilAPI** first and falls back to **Minha Receita** if the primary API is unstable or unavailable.
* **Standardization & Auditing:** Populates legal name, trade name, registration status, city, state, and main CNAE code, recording sync status and timestamp.
* **Rate-Limit Control:** Uses a configurable delay between requests (`Utilities.sleep`) to reduce rate-limit failures.

## 🛠️ Technologies Used

* **Google Apps Script (JavaScript)**
* **REST & JSON APIs (BrasilAPI / Minha Receita)**
* **Google Sheets**

## 📋 Expected Spreadsheet Structure

Create a tab named `Base_CNPJs` with the following headers in row 1:

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CNPJ | Legal Name | Trade Name | Registration Status | City | State (UF) | Main CNAE | Sync Status |

## Setup and limitations

Create the specified sheet, format column A as plain text to preserve leading zeros, paste `Codigo.gs` into Extensions → Apps Script, and run `enriquecerBaseCNPJs` on a test copy. Validation checks numeric length, not check digits. Column G contains the CNAE description. Respect API quotas; do not publish client data.
