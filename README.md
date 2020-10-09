# JirLab plugin

## Installation en développement

### Chrome

Pour installer le plugin sur Chrome, ouvrez votre navigateur :

- Cliquez sur le menu vertical
- Allez dans "Plus d'outils"
- Cliquez sur "Extension"

Une fois la fenêtre ouverte, activez le mode développeur, et cliquez sur "Charger l'extension non empaquetée".

Il faudra au préalable avoir téléchargé le plugin.

Sélectionnez le dossier contenant tout le code source.

### Firefox

Pour installer le plugin sur Firefox, ouvrez votre navigateur :

- Tapez dans la barre de recherche "about:debugging#/runtime/this-firefox"
- Une fois sur la page, cliquez sur "Charger un module complémentaire temporaire..."
- Dans le dossier ou se situe le plugin, sélectionnez le fichier "manifest.json" et validez.

### Brave

Pour installer le plugin sur Brave, ouvrez votre navigateur :

- Dans le menu vertical, cliquez sur "Extensions"
- Activez le mode développeur

Une fois la fenêtre ouverte, activez le mode développeur, et cliquez sur "Charger l'extension non empaquetée".

Sélectionnez le dossier contenant tout le code source.


## Présentation des dossiers

- css
    - bootstrap.css => Lib.
    - style.css => css modifiable pour l'interface du plugin.
- icons (Ne pas toucher)
    - iconx48.png
    - iconx96.png
- img
    - bg.png => image de fond de l'interface.
- lib (Toutes les lib javascript utilisées).
    - snackBar.js => SnackBar.
    - templateEngine.js => Moteur de template basé sur Mustache.
    - vanillapicker.js => Sélecteur de couleurs.
    - commonmark.js => Parser de markdown.
- scripts
    - backgroundScript.js => Script qui tourne en fond pour les notifications.
    - console.js => Extension de l'objet `console`.
    - functions.js => Cumul de fonctions utilisable partout dans l'application.
    - Objects.js => Objets utilitaires pour l'application.
    - vars.js => Variables utilisables partout dans l'application.
- tpl (Contient des templates d'item de liste)
- script.js => C'est là que le tout se passe dans l'application.
- popup.html => Interface de l'application.
- manifest.json => Fichier de configuration (Ne pas toucher).

## TODOS

- Gitlab Tab : 
    - Envoyer un commentaire.
    - Lire le markdown des commentaires. (OK)
    - Appliquer des suggestions.
    - Voir la diff.
- Jira Tab :
    - S'assigner un ticket dans le sprint.
- Application
    - Améliorer l'UI / code.
    - Créer un système de MAJ automatique (voir si possible).
    - Télécharger les données personnel. (OK)
- JSE Tab (Jira Search Engine)
    - Sortir la Tab.
    - S'attribuer un ticket dans le backlog.
    - Changer le status d'un ticket qui nous est assigné dans le backlog.