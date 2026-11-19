# Automação de Enriquecimento e Higienização de Base Cadastral (Google Apps Script)

Projeto demonstrativo voltado à **governança de dados, higienização cadastral e automação de rotinas de backoffice** utilizando **Google Apps Script** e integração com APIs públicas (`BrasilAPI` e `Minha Receita`).

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
