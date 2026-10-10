# privacy-email-profile-image

[English](README.md) | [Deutsch](README.de.md) | Français

Un badge d'adresse e-mail pour le README de votre profil GitHub, qui affiche votre adresse sous forme d'image plutôt que de texte, et qui vous permet de passer à une nouvelle adresse dès que l'ancienne commence à attirer du spam.

<p align="center">
  <img src="https://readmes.pages.dev/email/caption-email/ears" alt="Démo : un badge d'adresse e-mail avec des oreilles de renard, dessiné comme une image">
</p>
<p align="center">
  <img src="https://readmes.pages.dev/email/card/caption-contact" alt="Démo : le même badge en style carte avec la légende Contact">
</p>

Les adresses de la démo ci-dessus sont inventées. Rechargez la page et regardez bien : les lettres se placent chaque fois à des hauteurs légèrement différentes, car le badge est redessiné à chaque requête.

Mots-clés : badge e-mail, README de profil GitHub, cacher son e-mail aux robots, e-mail en image, antispam, e-mail jetable, e-mail temporaire, alias e-mail, vie privée, badge de contact, badge SVG, Cloudflare Pages Functions, serverless, changer d'adresse e-mail, protection contre le spam.

## Pourquoi afficher un e-mail sous forme d'image

Écrire une adresse e-mail en clair dans un README public, c'est lancer une invitation. Les robots d'indexation lisent GitHub en permanence, et une adresse écrite en texte finit dans des listes de spam en quelques jours. Les parades habituelles sont maladroites. Écrire « nom arobase exemple point com » agace justement les personnes dont vous voulez recevoir des messages, et ralentit à peine un robot moderne.

Ce badge prend une autre voie. L'adresse est dessinée côté serveur dans une petite image matricielle, puis placée en pixels à l'intérieur d'un SVG. Le code source du SVG ne contient aucun texte d'adresse, si bien que les outils qui cherchent dans le code d'une page quelque chose qui ressemble à un e-mail ne trouvent rien. Les humains lisent pourtant l'adresse d'un coup d'œil et peuvent la saisir dans leur messagerie.

Une image n'est pas un coffre-fort. La reconnaissance de caractères (OCR) sait lire des pixels, et une personne peut toujours recopier une adresse à la main. C'est pourquoi le badge repose sur une seconde idée, plus importante que la première.

## Changer dès que ça fuit

Cacher une adresse ne fait que retarder le moment où elle fuit. J'ai donc imaginé une autre approche, que j'appelle le modèle « swap as it leaks » (changer dès que ça fuit) : accepter que toute adresse publique finira par fuir, et rendre son remplacement facile.

Au lieu d'essayer de garder une seule adresse secrète pour toujours, vous tenez une liste d'adresses. Ce sont généralement des adresses jetables ou des alias fournis par un service de transfert, mais n'importe quelle adresse convient. Le badge en affiche une. Quand cette adresse commence à recevoir du spam, vous ouvrez un lien secret, et le badge passe à l'adresse suivante de la liste. Vous désactivez ou supprimez ensuite l'alias compromis dans votre service de messagerie.

Chaque profil, site web ou document qui intègre le badge se met à jour automatiquement, car ils pointent tous vers la même URL d'image. Il n'y a rien à modifier dans votre README et rien à committer. Les anciennes copies de l'adresse récoltées par les spammeurs cessent de fonctionner dès que vous désactivez cet alias.

Une fuite d'adresse passe ainsi d'un problème permanent à une petite tâche de routine qui prend quelques secondes.

## Démarrage rapide avec la démo

Vous pouvez voir le badge dans votre propre README tout de suite en collant cette ligne :

```markdown
![Email address](https://readmes.pages.dev/email/caption-email)
```

La démo n'affiche que des adresses inventées. Elle sert donc à essayer les styles, pas à publier de vraies coordonnées. Pour afficher vos propres adresses, déployez votre propre copie. La section « Installer votre propre instance » ci-dessous vous guide pas à pas, et cela prend environ dix minutes avec un compte Cloudflare gratuit.

Un générateur d'URL avec aperçu en direct est disponible sur [readmes.pages.dev/email/help](https://readmes.pages.dev/email/help).

## Options

Les options sont des segments de chemin écrits après `/email/`, dans n'importe quel ordre. Un `.svg` final est accepté et la casse n'a pas d'importance. Si vous faites une faute de frappe, le badge devient une petite notice rose qui indique la position de l'option inconnue, ce qui rend les erreurs faciles à repérer.

### Style

| Option | Effet |
|---|---|
| `pill` | Pilule arrondie (par défaut) |
| `card` | Carte, avec la légende sur sa propre ligne au-dessus de l'adresse |
| `plain` | Pas de fond, seulement l'icône et l'adresse |
| `caption-email`, `caption-contact`, `caption-mail-me` | Légende « Email », « Contact » ou « Mail me » |
| `noicon` | Masquer l'icône d'enveloppe |
| `ears` | Petites oreilles de renard au-dessus du badge |

### Taille et couleur

| Option | Effet |
|---|---|
| `size-N`, `size-Nrem` | Taille de police en pixels, de 10 à 40 (16 par défaut) |
| `px` | Pixels exacts au lieu de rem (voir ci-dessous) |
| `border-N` | Largeur de bordure en pixels, de 0 à 8 (0 par défaut) |
| `accent-RRGGBB` | Couleur de l'icône, de la légende et de la bordure en hexadécimal, sans `#` |
| `auto` | Suit la préférence claire ou sombre du visiteur (par défaut) |
| `light`, `dark` | Imposer un thème |
| `transparent` | Pas de fond lorsqu'il n'y a ni légende ni bordure |
| `warm` | Palette chaude de readmes au lieu des couleurs de texte de GitHub (par défaut) |

### Résistance aux robots

| Option | Effet |
|---|---|
| `jitter-N` | Décalage aléatoire de chaque lettre, de 0 à 3 (1 par défaut) |
| `noise-N` | Légers points aléatoires, de 0 à 3 (1 par défaut) |

Le décalage et le bruit changent à chaque requête. Aux niveaux par défaut, ils sont difficiles à remarquer à l'œil nu, mais ils garantissent que deux copies de l'image ne sont jamais identiques. Cela déjoue la comparaison d'images simple et rend la lecture automatique un peu moins fiable. Les niveaux plus élevés donnent un aspect plus dessiné à la main. Le niveau 0 désactive chaque effet si vous préférez un rendu parfaitement net.

La couleur du texte suit toujours le thème. En mode automatique, l'adresse est foncée sur fond clair et claire sur fond sombre, en accord avec le thème GitHub de chaque visiteur.

### Tailles en rem

Chaque badge est dimensionné en rem, où 1rem vaut 16 pixels. Avec les réglages par défaut du navigateur, le rendu est identique à une taille en pixels. Lorsqu'un lecteur a augmenté la taille de police par défaut de son navigateur, souvent pour lire plus facilement, le badge et l'adresse grandissent avec elle, comme le texte qui les entoure. Vous pouvez aussi écrire les tailles en rem, par exemple `size-1.5rem`. Ajoutez `px` lorsqu'un badge doit garder une taille exacte en pixels.

## Comment fonctionne le changement d'adresse

Chaque déploiement possède une liste d'adresses et un jeton secret de changement, tous deux stockés comme secrets Cloudflare chiffrés. Un minuscule stockage clé-valeur retient quelle adresse est actuellement active, et rien d'autre.

Ouvrir `/email/swap/<token>` passe à l'adresse suivante de la liste, en revenant à la première après la dernière. Ouvrir `/email/swap/<token>/<n>` va directement à l'adresse numéro n, en comptant à partir de 1. Ouvrir `/email/status/<token>` indique quelle adresse est active, sans rien changer.

Les réponses sont de courts messages en texte brut, comme « ok, showing address 3 of 12 ». Elles contiennent une version partiellement masquée de l'adresse, comme `m****-l******-q***@protonmail.com`, pour que vous puissiez confirmer le changement sans que l'adresse complète apparaisse dans l'historique de votre navigateur.

Un mauvais jeton reçoit exactement le même « 404 Not Found » que n'importe quelle page inexistante. Personne ne peut savoir de l'extérieur si un déploiement a activé le changement d'adresse. Les jetons de moins de 32 caractères sont refusés d'office, et la vérification prend le même temps, que la tentative soit proche ou non.

Le badge lui-même est envoyé sans mise en cache, si bien que le proxy d'images de GitHub en demande une nouvelle copie à chaque affichage du profil. Après un changement, la nouvelle adresse apparaît partout en une minute environ.

## Installer votre propre instance

Il vous faut un compte Cloudflare gratuit, Node.js 20 ou plus récent, et `make`. Il n'y a pas de `npm install`, car le projet n'a aucune dépendance. Wrangler, l'outil en ligne de commande de Cloudflare, s'exécute via `npx` la première fois que vous l'utilisez.

### 1. Créer votre copie

Cliquez sur « Use this template » sur GitHub, puis sur « Create a new repository ». Un dépôt privé fonctionne très bien. Clonez-le sur votre ordinateur.

Modifiez `site.config.json` pour y mettre votre nom et le lien de votre dépôt. Ces informations apparaissent dans le pied de page de la page d'aide et dans le commentaire de copyright du badge.

### 2. Créer le projet Pages et le stockage d'état

```sh
npx wrangler pages project create my-badges --production-branch production
npx wrangler kv namespace create email-state
```

La seconde commande affiche un identifiant. Copiez `wrangler.toml.example` vers `wrangler.toml` et renseignez le nom de votre projet ainsi que cet identifiant. Le vrai `wrangler.toml` figure dans `.gitignore` et reste donc sur votre ordinateur.

### 3. Enregistrer vos adresses

Écrivez vos adresses dans un fichier texte, une par ligne, en dehors du dépôt. Enregistrez-les ensuite comme secret chiffré :

```sh
npx wrangler pages secret put EMAILS --project-name my-badges < ~/private/emails.txt
```

Les virgules, points-virgules et espaces fonctionnent aussi comme séparateurs. Les doublons sont supprimés, et tout ce qui ne ressemble pas à une adresse valide est ignoré. La page d'état indique combien d'entrées ont été ignorées.

### 4. Créer un jeton de changement

Générez un long jeton aléatoire et enregistrez-le lui aussi comme secret :

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
npx wrangler pages secret put EMAIL_SWAP_TOKEN --project-name my-badges
```

Conservez le jeton en lieu sûr, par exemple dans votre gestionnaire de mots de passe. Quiconque le possède peut changer l'adresse affichée par votre badge, sans pour autant voir la liste complète des adresses.

### 5. Déployer et intégrer

```sh
make test
make deploy PROJECT=my-badges
```

Votre badge se trouve maintenant à `https://my-badges.pages.dev/email`. Ajoutez-le au README de votre profil avec un texte alternatif générique, jamais avec l'adresse elle-même :

```markdown
![Email address](https://my-badges.pages.dev/email/caption-email)
```

Ouvrez une fois `https://my-badges.pages.dev/email/status/<token>` pour vérifier que tout est bien connecté.

### Aperçu local

Copiez `.dev.vars.example` vers `.dev.vars`, adaptez-le et lancez `make dev`. Ce fichier est ignoré par Git. Utilisez-y si possible des adresses inventées, afin que les vraies ne se retrouvent jamais dans un dossier de projet.

## Gérer la liste d'adresses

### Combien d'adresses tiennent

Cloudflare limite chaque variable d'environnement ou secret à 5 Kio. Un alias typique comme `maple-lantern-q7x2@protonmail.com` occupe environ 30 à 35 octets avec le saut de ligne, donc une variable contient environ 150 à 170 adresses. Les longs domaines personnalisés réduisent ce nombre.

S'il vous en faut davantage, ajoutez `EMAILS_2`, `EMAILS_3` et ainsi de suite jusqu'à `EMAILS_9`. Elles sont lues dans l'ordre et réunies en une seule liste, ce qui permet bien plus d'un millier d'adresses. La plupart des gens n'en auront jamais besoin de plus d'une poignée.

### Choisir ses adresses

Les services d'alias et de transfert sont le choix naturel. De nombreux fournisseurs de messagerie et outils de confidentialité créent une nouvelle adresse de transfert en un clic, et la supprimer plus tard coupe complètement le spam sans toucher à votre vraie boîte de réception. Une adresse ordinaire fonctionne aussi, si vous préférez alterner entre des boîtes qui vous appartiennent.

Avant le `@`, les adresses peuvent contenir des lettres, des chiffres, des points, des tirets, des tirets bas et des signes plus. Les caractères rares hors de cet ensemble ne peuvent pas être dessinés. Les entrées qui en contiennent sont donc ignorées et comptées sur la page d'état.

### Modifier la liste en production

Vous pouvez remplacer le secret `EMAILS` à tout moment ; redéployez ensuite pour que la nouvelle valeur soit prise en compte. La position active est mémorisée sous forme de nombre. Si vous raccourcissez la liste, ce nombre reboucle sans danger. Si vous réordonnez la liste, consultez la page d'état et utilisez `/email/swap/<token>/<n>` pour choisir l'adresse voulue.

Une bonne habitude consiste à garder quelques alias inutilisés en fin de liste. Quand l'un d'eux fuit, changez d'adresse, désactivez l'ancien alias et ajoutez-en un nouveau en fin de liste quand cela vous arrange.

## Plusieurs listes dans un seul déploiement

Un même projet Pages peut servir plusieurs badges indépendants sur des chemins différents, ce qui évite de créer un nouveau projet pour chacun. Cloudflare limite le nombre de projets Pages par compte, c'est donc bon à savoir.

Chaque badge supplémentaire s'appelle une instance. Elle a sa propre liste d'adresses, son propre jeton de changement, et mémorise sa propre position active. Ses secrets utilisent un préfixe de votre choix, par exemple `WORK_EMAILS` et `WORK_EMAIL_SWAP_TOKEN`. Pour en ajouter une, créez un dossier de route à côté de `functions/email/` qui appelle les mêmes gestionnaires avec ce préfixe :

```js
// functions/email-work/[[params]].js
import { badge } from "../../src/email/handler.js";
export const onRequest = ({ request, env, params }) =>
  badge(request.method, env, [].concat(params.params ?? []), { prefix: "WORK_", key: "work" });
```

Ajoutez dans ce dossier les fichiers correspondants `swap/[[params]].js` et `status/[[params]].js`, qui appellent `swap` et `status` de la même manière. Le jeton d'une instance ne contrôle jamais une autre, et les positions sont stockées sous des clés distinctes dans le même stockage d'état.

Une route qui n'est liée nulle part n'est pas un secret, puisque toute personne qui voit votre profil peut lire l'adresse de l'image. Elle garde simplement votre badge personnel hors de la liste publique.

## Protéger le jeton

Le lien de changement est une adresse web ordinaire qui contient le jeton. C'est pratique, mais cela a quelques effets secondaires à connaître.

Les applications de discussion et certains clients de messagerie ouvrent automatiquement les liens pour afficher un aperçu. Si vous collez votre lien de changement dans une discussion, cette récupération d'aperçu suffit à changer l'adresse. Gardez ce lien hors des messageries, ou utilisez le lien d'état quand vous voulez seulement consulter.

Les navigateurs mémorisent les adresses visitées. Si vous partagez un ordinateur, utilisez une fenêtre privée ou appelez plutôt le lien depuis un terminal :

```sh
curl https://my-badges.pages.dev/email/swap/<token>
```

Cloudflare peut conserver pour votre compte des journaux de requêtes qui incluent le chemin. C'est votre propre compte, mais c'est un endroit de plus où le jeton apparaît. Si vous pensez que quelqu'un d'autre a vu le jeton, générez-en un nouveau et enregistrez-le exactement comme à l'étape 4 de l'installation. L'ancien jeton cesse aussitôt de fonctionner.

## Contre quoi il protège

Le badge est conçu pour déjouer la collecte d'adresses massive et bon marché. Les robots qui lisent le code source des pages, suivent les liens `mailto:` ou appliquent des motifs de texte au HTML ne trouvent rien, car il n'y a aucun texte à trouver. Chaque réponse diffère au niveau des pixels, si bien que l'empreinte d'image simple n'aide pas non plus.

Il n'est pas conçu pour arrêter une personne qui veut votre adresse, ni un robot qui applique l'OCR à chaque image qu'il rencontre. Aucune image ne le peut, puisque tout ce qu'un humain peut lire, une machine peut le lire aussi. La vraie défense, c'est le changement d'adresse : une adresse compromise vous coûte quelques secondes plutôt que des années de spam.

N'utilisez pas ce badge pour quoi que ce soit qui doit rester confidentiel. Considérez chaque adresse de la liste comme une adresse qui pourrait un jour devenir publique.

## Accessibilité

Les lecteurs d'écran annoncent le badge comme « Email address, shown as an image » et ne peuvent pas lire l'adresse elle-même, car l'exposer aux technologies d'assistance l'exposerait aussi aux robots. Si l'accessibilité compte pour votre public, proposez un autre moyen de vous joindre à côté du badge, comme un formulaire de contact ou un profil sur une plateforme avec messages privés.

La couleur du texte suit la préférence claire ou sombre du visiteur. Le contraste respecte le niveau AA des WCAG dans les deux thèmes à la taille par défaut, et les pages d'aide prennent en charge la navigation au clavier et la réduction des animations.

## Pages web

En plus du badge, chaque déploiement sert deux petites pages.

| Chemin | Contenu |
|---|---|
| `/email/help` | Toutes les options et un générateur d'URL avec aperçu en direct |
| `/email/agents` | Guide Markdown pour les agents d'IA et les outils |

Elles comportent des balises Open Graph et du JSON-LD schema.org, et les déploiements de prévisualisation sont automatiquement marqués noindex. Les scripts ne sont autorisés que par empreinte, au moyen d'une politique de sécurité du contenu (CSP) stricte.

### Organisation du projet

```
functions/email/           Pages Functions : badge, changement, état, aide, agents
src/email/                 options, rastériseur, encodeur PNG, SVG, pages
src/email/font.generated.js  images des glyphes (DejaVu Sans Mono Bold)
scripts/build.mjs          site.config.json -> src/email/site.generated.js
scripts/build-font.mjs     regénérer la table des glyphes (ImageMagick)
test/                      tests unitaires node:test
wrangler.toml.example      modèle pour la liaison KV (à copier vers wrangler.toml)
.dev.vars.example          modèle pour les secrets locaux (à copier vers .dev.vars)
```

Tout se trouve sous un chemin `email`, ce qui permet à ce projet de partager un projet Pages avec d'autres applications de badges sans conflit de noms de fichiers.

## Questions fréquentes

### Puis-je faire du badge un lien mailto cliquable ?

Vous pouvez l'entourer d'un lien, mais un lien `mailto:` remet l'adresse en texte dans votre README, ce qui annule tout l'intérêt. La plupart des gens recopient de toute façon l'adresse en la lisant.

### Pourquoi ne pas utiliser simplement un formulaire de contact ?

Les formulaires sont très bien et fonctionnent parfaitement à côté de ce badge. Certaines personnes préfèrent tout simplement l'e-mail, et une adresse visible reste le moyen le plus universel d'être joignable.

### Est-ce que cela fonctionne en dehors de GitHub ?

Oui. Partout où une URL d'image peut s'afficher, le badge peut s'afficher aussi, y compris sur des sites personnels, d'autres hébergeurs de code et dans des signatures de forum.

### En combien de temps un changement est-il visible ?

En général en moins d'une minute. Le stockage d'état se met à jour dans le monde entier en une soixantaine de secondes, et le badge lui-même n'est jamais mis en cache.

### Ai-je besoin du stockage clé-valeur ?

Seulement pour changer d'adresse par lien. Sans lui, vous pouvez définir une variable `EMAIL_INDEX` (en comptant à partir de 1) pour choisir l'adresse, et la modifier en redéployant. Cela fonctionne, mais le lien est bien plus rapide quand une adresse fuit.

### La démo peut-elle afficher mon adresse ?

Non. La démo n'affiche que des adresses inventées et n'accepte aucune saisie. Vos vraies adresses ont leur place dans un déploiement que vous contrôlez.

## Dépannage

### Le badge indique « no address configured »

Le déploiement ne voit aucune adresse valide. Vérifiez que le secret s'appelle exactement `EMAILS` et qu'il appartient au même projet Pages que celui où vous avez déployé. Les secrets n'atteignent que les nouveaux déploiements, donc redéployez une fois après les avoir enregistrés ou modifiés. Si la liste est présente mais que toutes les entrées sont ignorées, cherchez des caractères inhabituels autour du `@`.

### Le lien de changement renvoie 404

Un 404 signifie que le jeton ne correspondait pas, qu'il manquait, ou qu'il fait moins de 32 caractères. Recopiez le jeton depuis votre gestionnaire de mots de passe, en surveillant une espace parasite au début ou à la fin. N'oubliez pas que le secret doit s'appeler `EMAIL_SWAP_TOKEN` et que, comme tout secret, il ne prend effet qu'après un nouveau déploiement.

### Le lien de changement renvoie 503

Le jeton est correct, mais le déploiement n'a pas de stockage d'état. Vérifiez que votre `wrangler.toml` contient la liaison `EMAIL_STATE` avec l'identifiant de votre espace de noms clé-valeur, puis redéployez depuis le dossier qui contient ce fichier.

### Mon profil affiche encore l'ancienne adresse

Attendez d'abord une minute, car le stockage d'état met jusqu'à une soixantaine de secondes pour atteindre chaque emplacement. Si elle est toujours ancienne ensuite, votre navigateur garde peut-être sa propre copie ; un rechargement forcé règle généralement le problème. Le proxy d'images de GitHub respecte normalement les en-têtes anti-cache envoyés par le badge, mais il peut parfois accuser un léger retard.

### L'adresse paraît floue ou trop petite

Utilisez une valeur `size-N` plus grande plutôt que de redimensionner l'image avec les attributs de largeur HTML. L'image est dessinée en haute résolution, donc les tailles jusqu'à 40 restent nettes sur la plupart des écrans. Si les lettres paraissent irrégulières, baissez le niveau de décalage ou désactivez-le avec `jitter-0`.

## Confidentialité

Le service stocke un seul nombre : la position de l'adresse active dans votre liste. Votre liste d'adresses et votre jeton se trouvent dans des secrets Cloudflare chiffrés et n'apparaissent jamais dans le dépôt. Le badge ne lit aucun cookie et n'accepte aucun envoi de fichier. Il n'utilise aucun pistage et n'enregistre pas les visiteurs.

Sur GitHub, les images sont récupérées via le proxy de GitHub, si bien que le badge ne voit normalement jamais les adresses IP des personnes qui consultent votre profil. Comme tout site web, Cloudflare peut conserver des journaux de requêtes standard selon sa propre [politique de confidentialité](https://www.cloudflare.com/privacypolicy/).

## Avertissement

Cette traduction est fournie à titre indicatif. En cas de divergence, la version anglaise du README fait foi.

La démo hébergée sur `readmes.pages.dev` est fournie « en l'état » et gratuitement, sans garantie d'aucune sorte, expresse ou implicite. Cela comprend les garanties de qualité marchande, d'adéquation à un usage particulier, de disponibilité et d'absence de contrefaçon. Elle peut être limitée, modifiée ou mise hors ligne à tout moment sans préavis. Les auteurs ne sont pas responsables des dommages découlant de son utilisation, y compris le spam, les messages perdus ou l'exposition de toute adresse que vous choisissez de publier.

Ce projet réduit la collecte automatisée d'adresses e-mail. Il ne garantit pas qu'une adresse affichée dans le badge reste privée, et ce n'est pas un produit de sécurité.

Ce projet n'est ni affilié à GitHub, Cloudflare ou Proton, ni approuvé ou parrainé par eux. Les adresses d'exemple de ce document et de la démo sont inventées à titre d'illustration. Elles ne sont connues pour appartenir à personne, alors merci de ne pas leur écrire.

Si vous déployez votre propre copie, vous êtes seul responsable des adresses que vous publiez et de la sécurité de votre jeton de changement. Vous êtes également responsable du respect des conditions des services que vous utilisez et des lois de votre lieu de résidence.

Rien dans ce dépôt ne constitue un conseil juridique. Les textes des licences font foi.

## Licence

Le code est distribué sous la licence [GNU AGPL-3.0](LICENSE). Si vous exploitez une version modifiée comme service public, vous devez en proposer le code source à ses utilisateurs ; garder votre copie du modèle publique sur GitHub y suffit.

Les images des glyphes dans `src/email/font.generated.js` sont rastérisées à partir de DejaVu Sans Mono Bold et restent sous la licence Bitstream Vera, dans [LICENSE-FONT](LICENSE-FONT). Le fichier [NOTICE](NOTICE) résume quelle licence s'applique à quoi.

---

<p align="center"><sub>© 2026 Aesthetic Vulpes (<a href="https://github.com/didvc">github.com/didvc</a>) · <a href="https://readmes.pages.dev/">readmes.pages.dev</a></sub></p>
