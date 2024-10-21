# Prérequis

Outils nécessaires
Node.js (et npm ou yarn)

Installer Node.js (npm est installé avec Node.js)
Vérifier l'installation :

node -v
npm -v

Composer

Installer Composer
Vérifier l'installation :

composer -v
Symfony CLI

Installer Symfony CLI
Vérifier l'installation :

symfony -v
Git (pour la gestion de version)

Installation du Back-end : Symfony
Créer un projet Symfony

Ouvrez un terminal et exécutez la commande suivante pour créer votre projet Symfony :

symfony new backend --full
Cela créera un dossier nommé backend contenant un projet Symfony complet.

Démarrer le serveur Symfony

Une fois le projet créé, naviguez dans le répertoire et démarrez le serveur de développement Symfony :

``cd backend``
``symfony serve``
Le serveur sera accessible par défaut sur http://localhost:8000.

Configurer la base de données

Dans le fichier .env de votre projet Symfony, configurez votre base de données. Par exemple, pour une base de données MySQL :

.env
DATABASE_URL="mysql://db_user:db_password@127.0.0.1:3306/db_name?serverVersion=5.7"
Exécutez ensuite les commandes suivantes pour créer et migrer la base de données :

php bin/console doctrine:database:create
php bin/console make:migration
php bin/console doctrine:migrations:migrate
Installation du Front-end : Vue.js
Créer un projet Vue.js

Dans un autre terminal, créez le projet Vue.js avec Vue CLI :

vue create frontend
Suivez les instructions pour choisir les options nécessaires (vous pouvez par exemple choisir Vue 3 avec Vue Router et Vuex si besoin).

Démarrer le serveur de développement Vue.js

Une fois le projet créé, naviguez dans le répertoire et démarrez le serveur de développement Vue :

`cd frontend`
`npm run serve`
Le serveur Vue.js sera accessible par défaut sur http://localhost:8080.

Configurer la communication entre Front-end et Back-end
1. CORS (Cross-Origin Resource Sharing) dans Symfony
Pour permettre à Vue.js de communiquer avec votre API Symfony, il est nécessaire de configurer le CORS. Installez le bundle nelmio/cors-bundle dans votre projet Symfony :

`composer require nelmio/cors-bundle`
Ensuite, configurez le bundle dans config/packages/nelmio_cors.yaml :

nelmio_cors:
    defaults:
        allow_origin: ['http://localhost:8080']
        allow_methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE']
        allow_headers: ['Content-Type', 'Authorization']
        expose_headers: ['Link']
        max_age: 3600
    paths:
        '^/': ~
Cela autorisera les requêtes provenant de http://localhost:8080 (le serveur Vue.js) vers votre API Symfony.

2. Appeler l'API Symfony depuis Vue.js
Dans vos composants Vue, utilisez axios ou fetch pour effectuer des requêtes vers l'API Symfony. Installez axios dans le projet Vue.js :


`npm install axios`
Puis, dans un fichier Vue :


`import axios from 'axios';`

export default {
  data() {
    return {
      products: []
    };
  },
  mounted() {
    axios.get('http://localhost:8000/api/products')
      .then(response => {
        this.products = response.data;
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }
};
Assurez-vous de bien remplacer l'URL par celle de votre serveur Symfony.

Commandes utiles
Symfony
Démarrer le serveur Symfony : symfony serve
Créer une entité : php bin/console make:entity
Créer une migration : php bin/console make:migration
Exécuter les migrations : php bin/console doctrine:migrations:migrate
Générer un CRUD : php bin/console make:crud
Vue.js
Démarrer le serveur de développement : npm run serve
Ajouter un package : npm install <package_name>
Compiler pour la production : npm run build


## Installer PrimeVue

`npm install primevue primeicons primefle`

Importer PrimeVue dans le projet

import { createApp } from 'vue';
import App from './App.vue';

// Importation de PrimeVue et de ses ressources
import PrimeVue from 'primevue/config';

// Importation d'un thème PrimeVue (au choix)
import 'primevue/resources/themes/saga-blue/theme.css'; // Vous pouvez changer le thème si vous le souhaitez
import 'primevue/resources/primevue.min.css'; // Styles principaux de PrimeVue
import 'primeicons/primeicons.css'; // Icônes
import 'primeflex/primeflex.css'; // Pour les classes flex de PrimeFlex

// Exemple d'import d'un composant PrimeVue (comme Button)
import Button from 'primevue/button';

// Création de l'application
const app = createApp(App);

// Configuration de PrimeVue
app.use(PrimeVue);

// Enregistrement global des composants PrimeVue si nécessaire
app.component('Button', Button);

// Montage de l'application
app.mount('#app');