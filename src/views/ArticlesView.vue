<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import BarreRecherche from '../components/BarreRecherche.vue'
import ListeArticles from '../components/ListeArticles.vue'

const store = inject('articlesStore')
const router = useRouter()
</script>

<template>
  <main>
    <h1>Articles</h1>
    <BarreRecherche @rechercher="store.definirRecherche" />
    <label>
      <select
        :value="store.recherche.categorie"
        @change="store.definirCategorie($event.target.value)"
      >
        <option value="">Toutes catégories</option>
        <option v-for="categorie in store.categories" :key="categorie" :value="categorie">
          {{ categorie }}
        </option>
      </select>
    </label>
    <p>{{ store.articlesFiltres.length }} article(s) disponible(s).</p>
    <ListeArticles
      :articles="store.articlesPage"
      :page="store.recherche.page"
      :nombre-pages="store.nombrePages"
      @changer-page="store.definirPage"
      @voir="router.push(`/article/${$event.id}`)"
      @ajouter="store.ajouterAuPanier"
      @supprimer="store.supprimerArticle($event.id)"
    />
  </main>
</template>
