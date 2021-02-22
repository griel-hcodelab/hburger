/**
 * Para começar a configurar, usar uma conta do google
 * Adicionar um projeto novo
 * Criar uma conta e vincular no google analytics
 * No Dashboard é dividido por partes
 * Parte de criação 
 * @Autenticação
 * Clicar Primeiro Passos
 * Ativar E-mail/senha
 * 
 * Ir em configurações do projeto escolher html e colocar um alias
 * 
 * Instalar com o passo 3 npm install -g firebase-tools
 * Verificar se já está logado com o comando firebase login
 * 
 * Próximo passo fazer as configurações para novo projeto
 * Cuidado para as pastas novas que ele vai pedir para criar, se já tiver ele vai sobrescrever
 * 
 * @começando configuração do firebase no projeto local
 * 
 * firebase init
 * escolher sim
 * 
 * depois configurar o Hosting usando a tecla espaço para selecionar
 * depois selecione usar um projeto existente, já que foi criado anteriormente
 * selecione o projeto que deseja usar
 * depois dizer qual diretório ele vai usar 
 * depois configurar se é single data base ou não
 * depois se quer fazer as configurações altomatica com o github
 * depois não deixar sobrescrever o arquivo 404
 * depois não deixar sobrescrever o arquivo index
 * depois irá abrir uma tela pedindo acesso ao github para configurar o firebase
 * depois pegar o nome onde está o repositório e colar FabinhoFlauzino/ferrari-review
 * depois configurar o script do build depois do deploy 
 * depois configurar qual o comando irá executar para o build geralmente deixar o modo de produção como build no package.json
 * depois permitir o pull request para mesclar automaticamente os deploys do git com o firebase
 * depois setar o branch com o live channel por padrão vem com mastes, mas não é o correto
 *      criar outra branch para fazer essa alteração ou criar uma branch deploy que toda vez que mandar para essa brach
 *      ela fica responsavel de gerar os arquivos que vai para o firebase toda vez que chamar ela, ai pode usar a master para alterar os arquivos
 * subir os arquivos na branch deploy
 * verificar se terminou de fazer as configurações no site do firebase
 * executar o comando firebase deploy
 * para mesclar informações do master pro deploy tem que estar na branch que vai mandar
 * ex: estando na branch deploy usa git merge master
 * ex: estando na branch master usa git marge deploy
*/

/**
  * Depois de configurado o firebase é hora de integrar a api no aplicativo,
  * Indo em configurações e pegando o arquivo de Firebase SDK snippet, configuração
  * colando no firebase.json
  * feito isso instalar o firebase no projeto com o comando npm i firebase que vai adicionar como dependencia no package.json
  * depois disso criar um arquivo js onde irá ficar as configurações de chamada para o projeto
  * importar as configurações do firebase.json da raiz
  *         import firebaseConfig from '../../../firebase.json'
  * importar o firebase/app do node_modules
  *         import firebase from 'firebase/app'
  * importar o firebase/auth do node_modules
  *         import 'firebase/auth'
  * 
  * Depois verificar se já existe algum app inicializado com as configurações referenciadas 
  * se não existir inicia um app
  * e exporta o firebase
  *         if(!firebase.apps.length){
  *             firebase.initializeApp(firebaseConfig)
  *         } else {
  *             firebase.app()
  *         }
  * 
  *         export default firebase
*/

/**
 * Para usar o firebase dentro de uma classe, importar o firebase que irá usar no caso o que criamos firebase-app
 * 
 *      import firebase from 'firebase-app'
 * 
 * depois disso usar o auth do node_modules
 *      const auth = firebase.app() 
*/

/**
 * @fireStore @firebase
 * configurando e usando o firestore
 * 
 * Clicar em cloud store o menu lateral
 * criar um novo banco no projeto que deseja usar
 * escolher a região amreica do sul para o local
 * escolher o modo de teste ou produção
 * e criar um novo banco
 * criar o nome da coleção que no caso é uma tabela
 * Escolher chave e valores
 * 
 * Para vicunlar o firestore no projeto ir no firebase-app 
 * Adicionar o import da biblioteca que está no node_modules
 * import 'firebase/firestore'
 * 
 * Importar onde for usar o firebase-app
 * 
 */

 /**
  * @templates de @autenticação no firebase 
  * ir em @autenticação e ir na aba @templates
  * ir em @redefinição de senha para redefinir o template que o usuario ira receber
  * Clicar em editar e editar as configurações que desejar
  * Próximo passo é editar o html se caso não quiser usar o padrão do firebase
  * 
  */