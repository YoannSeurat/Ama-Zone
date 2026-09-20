<template>
  <main>
    <h1>Bienvenue sur <img src="/logo/logo black.png" alt="logo" class="h1-logo-img" /></h1>
    <p>Une mini-application pour découvrir et gérer des articles.</p>
    <nav>
      <RouterLink to="/articles" class="btn--primary">Voir les articles</RouterLink>
      <RouterLink to="/ajouter" class="btn--primary">Ajouter un article</RouterLink>
      <RouterLink to="/panier" class="btn--primary">Consulter le panier</RouterLink>
      <RouterLink to="/admin" class="btn--primary">Accéder au panel admin</RouterLink>
    </nav>
  </main>
</template>
