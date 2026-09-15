# Ama'zone

Mini-application Vue 3 de gestion d'articles. Le projet utilise Vue Router, des composants réutilisables et un tableau local en mémoire.

## Installation

```sh
pnpm install
pnpm dev
```

Pour compiler la version de production :

```sh
pnpm build
```

## Fonctionnalités

- Accueil avec navigation entre les pages
- Liste d'articles avec recherche, filtre par catégorie et pagination
- Page de détail d'un article
- Ajout d'articles avec formulaire validé
- Panier avec ajout, retrait et total
- Connexion simulée et accès protégé à l'administration
- Suppression d'articles avec confirmation
- Persistance du panier et de la session dans `localStorage`

## Routes

| Route | Rôle |
| --- | --- |
| `/` | Accueil |
| `/articles` | Recherche et liste paginée |
| `/article/:id` | Détail d'un article |
| `/ajouter` | Création d'un article |
| `/panier` | Articles sélectionnés |
| `/login` | Connexion simulée |
| `/admin` | Administration et suppression |

## Architecture

`App.vue` possède l'état partagé des articles, du panier et de la session. Les composants communiquent avec leurs vues grâce aux props et aux événements. Vue Router gère la navigation et redirige les utilisateurs non connectés vers `/login` lorsqu'ils demandent `/admin`.

Ce projet ne possède pas d'API, de base de données ni d'authentification réelle. Les articles ajoutés sont conservés uniquement pendant la session de l'application ; le panier et la connexion sont sauvegardés dans `localStorage`.
