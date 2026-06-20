# API - Clínica de Reabilitação Equina 🏇

## 👥 Integrantes da Dupla
* **Denis Ferreira**
* **Ruan Pablo**

## 🎯 Tema Escolhido
O tema desenvolvido para este projeto foi um sistema back-end para gerenciar uma **Clínica de Reabilitação Equina**. O sistema permite registrar os cavalos que dão entrada na clínica, realizar seu acompanhamento financeiro/dados de aquisição, além de registrar e acompanhar o histórico das sessões de fisioterapia e reabilitação de cada animal.

---

## 🚀 Como Configurar e Rodar o Projeto

Para rodar este projeto na sua máquina local, você precisará ter o [Node.js](https://nodejs.org/) instalado.

1. **Clone o repositório e acesse a pasta do projeto.**
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Inicie o servidor (modo de desenvolvimento):**
   ```bash
   npm run start:dev
   ```

O NestJS irá inicializar e o TypeORM criará o banco de dados (`SQLite`) automaticamente no seu projeto de acordo com a estrutura das entidades criadas.

---

## 🔗 Principais Endpoints da API

Aqui estão os principais recursos disponíveis caso precise testá-los numa ferramenta como Postman ou Insomnia:

### 🐴 Módulo Cavalo

* **`POST /cavalo` - Cadastrar Cavalo**
  **Corpo da requisição (Exemplo):**
  ```json
  {
    "nome": "Pé de Pano",
    "nomeHaras": "Haras Eldorado",
    "dataAquisicao": "2023-05-10",
    "emTratamento": true,
    "valorCompra": 15000
  }
  ```
  *Nota: Não é possível cadastrar dois cavalos com o mesmo nome e o mesmo haras.*

* **`GET /cavalo` - Listar todos os Cavalos**
* **`GET /cavalo/:id` - Buscar um cavalo específico**
* **`PUT /cavalo/:id` - Atualizar dados do cavalo**
* **`DELETE /cavalo/:id` - Remover cavalo**

### 🩺 Módulo Sessão de Fisioterapia

* **`POST /sessao-fisio` - Inserir Sessão**
  **Corpo da requisição (Exemplo):**
  ```json
  {
    "focoLesao": "Ligamento anterolateral",
    "dataSessao": "2025-08-15",
    "progressoBoa": true,
    "duracaoMin": 45,
    "cavaloId": 1
  }
  ```
* **`GET /sessao-fisio` - Listar todas as Sessões**
* **`PUT /sessao-fisio/:id` - Editar uma sessão**
  *Nota: O campo `cavaloId` não é alterável via update por regra de negócio.*

---

## 🛠️ Divisão de Tarefas

Com base no histórico de commits e fluxo de desenvolvimento:

* **Denis Ferreira**: Ficou como o autor da estrutura principal ("commit inicial") no versionamento, sendo responsável formalmente pela elaboração do boilerplate através do NestJS, separação do padrão arquitetural das camadas hexagonais **e o desenvolvimento crucial das classes da modelagem e regras de negócios iniciais** (`feat: c classes e rngs`).
* **Ruan Pablo**: Responsável pelo apoio na estruturação, elaboração conceitual da modelagem da clínica veterinária em formato ER (Entidade-Relacionamento) e pair programming das lógicas de restrição das entidades, testes e validações das regras que operam junto das classes implementadas.
