Template de site statique
===========

Ceci est un template de site statique qui permet de minifier les resources.

Installation
-----------
```
npm install
npm run build
```
Le site est généré dans le répertoire `dist/`. Il ne reste plus qu'à l'héberger sur un serveur ou autre bucket pour que le site fonctionne

Notes de codage
-----------
Pour améliorer les performances et pour avoir un site agréable, voici quelques astuces concernant les images et les faviconsLe site [piggums.fr](https://piggums.fr) est ma première véritable intégration de maquette. Il me sert un peu de _Sandbox_ pour appréhender un peu plus le monde du Front End. Le CSS n'est certainement pas parfait, mais je ne manquerai pas de le faire évoluer à l'occasion, au gré de mon apprentissage. Je m'attache à être le moins dépendance à des frameworks. Si je peux le coder à la main, je le fais.

* [Les favicons](#favicon)
* [Les images](#les-images)

### Favicon
Pour les favicons, l'outil [realfavicongenerator](https://realfavicongenerator.net/) semble tout indiquer.

### Les images
Le **chargement des images peut se faire de manière adaptative**, en suivant les recommandations de [cet article](https://developer.mozilla.org/fr/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images). Cet outil, [responsivebreakpoints](https://www.responsivebreakpoints.com/), pourra être utilisé pour générer des images aux différentes résolutions (entre 320 et 1480 px) avec un maximum de 10 images et un minimum de 45Ko de différence entre chaque image. En complément, et pour des images encore plus légères qui facilitent le chargement de la page, pourquoi ne pas utiliser [tinyjpg](https://tinyjpg.com/).
