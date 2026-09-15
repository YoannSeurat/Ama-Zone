<script setup>
import { computed, onMounted, provide, reactive, watch } from 'vue'
import { articlesInitiaux } from './data/articles'

const STORAGE_KEYS = {
  cart: 'ama-zone-cart',
  session: 'ama-zone-session',
}

const articles = reactive([...articlesInitiaux])
const imagesChargees = new Set()
const panier = reactive([])
const session = reactive({
  isConnected: false,
  username: '',
})
const recherche = reactive({
  texte: '',
  categorie: '',
  page: 1,
  parPage: 12,
})

const categories = computed(() => [...new Set(articles.map((article) => article.categorie))].sort())
const articlesFiltres = computed(() => {
  const terme = recherche.texte.trim().toLocaleLowerCase()

  return articles.filter((article) => {
    const correspondAuTexte = !terme || article.titre.toLocaleLowerCase().includes(terme)
    const correspondALaCategorie = !recherche.categorie || article.categorie === recherche.categorie

    return correspondAuTexte && correspondALaCategorie
  })
})
const nombrePages = computed(() =>
  Math.max(1, Math.ceil(articlesFiltres.value.length / recherche.parPage)),
)
const articlesPage = computed(() => {
  const debut = (recherche.page - 1) * recherche.parPage

  return articlesFiltres.value.slice(debut, debut + recherche.parPage)
})
const totalPanier = computed(() => panier.length)
const articlesStore = reactive({
  articles,
  panier,
  session,
  recherche,
  categories,
  articlesFiltres,
  articlesPage,
  nombrePages,
  totalPanier,
  ajouterArticle,
  supprimerArticle,
  ajouterAuPanier,
  supprimerDuPanier,
  definirRecherche,
  definirCategorie,
  definirPage,
  connecter,
  deconnecter,
})

function sauvegarderPanier() {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(panier))
}

function ajouterArticle(article) {
  const nouvelArticle = {
    ...article,
    id: Date.now(),
  }

  articles.push(nouvelArticle)
  return nouvelArticle
}

function supprimerArticle(articleId) {
  const index = articles.findIndex((article) => article.id === articleId)

  if (index !== -1) {
    articles.splice(index, 1)
  }

  supprimerDuPanier(articleId)
}

function ajouterAuPanier(article) {
  if (!panier.some((articleDuPanier) => articleDuPanier.id === article.id)) {
    panier.push(article)
    sauvegarderPanier()
  }
}

function supprimerDuPanier(articleId) {
  const index = panier.findIndex((article) => article.id === articleId)

  if (index !== -1) {
    panier.splice(index, 1)
    sauvegarderPanier()
  }
}

function definirRecherche(texte) {
  recherche.texte = texte
  recherche.page = 1
}

function definirCategorie(categorie) {
  recherche.categorie = categorie
  recherche.page = 1
}

function definirPage(page) {
  recherche.page = Math.min(Math.max(1, page), nombrePages.value)
}

function connecter(username) {
  session.isConnected = true
  session.username = username.trim()
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session))
}

function deconnecter() {
  session.isConnected = false
  session.username = ''
  localStorage.removeItem(STORAGE_KEYS.session)
}

function restaurerDonneesLocales() {
  const panierSauvegarde = localStorage.getItem(STORAGE_KEYS.cart)
  const sessionSauvegardee = localStorage.getItem(STORAGE_KEYS.session)

  if (panierSauvegarde) {
    try {
      panier.push(...JSON.parse(panierSauvegarde))
    } catch {
      localStorage.removeItem(STORAGE_KEYS.cart)
    }
  }

  if (sessionSauvegardee) {
    try {
      Object.assign(session, JSON.parse(sessionSauvegardee))
    } catch {
      localStorage.removeItem(STORAGE_KEYS.session)
    }
  }
}

async function chargerImagesArticles(articlesVisibles) {
  await Promise.all(
    articlesVisibles.map(async (article) => {
      if (imagesChargees.has(article.id)) {
        return
      }

      imagesChargees.add(article.id)

      try {
        const response = await fetch('https://picsum.photos/800') // images aleatoires
        const image = response.url

        if (image) {
          article.image = image
        }
      } catch {
        article.image =
          'https://static.vecteezy.com/system/resources/previews/036/624/119/large_2x/system-error-icon-failure-pc-interface-error-message-computer-window-alert-popup-vector.jpg'
      }
    }),
  )
}

watch(
  () => articles.length,
  () => {
    if (recherche.page > nombrePages.value) {
      recherche.page = nombrePages.value
    }
  },
)

watch(
  () => articlesPage.value.map((article) => article.id).join(','),
  () => chargerImagesArticles(articlesPage.value),
  { immediate: true },
)

provide('articlesStore', articlesStore)

onMounted(restaurerDonneesLocales)
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/">ama'zone</RouterLink>
      <nav class="main-nav" aria-label="Navigation principale">
        <RouterLink to="/articles">Articles</RouterLink>
        <RouterLink to="/ajouter">Ajouter</RouterLink>
        <RouterLink to="/panier">Panier ({{ totalPanier }})</RouterLink>
        <RouterLink v-if="session.isConnected" to="/admin">Administration</RouterLink>
        <RouterLink v-else to="/login">Connexion</RouterLink>
      </nav>
      <button
        v-if="session.isConnected"
        class="secondary-button"
        type="button"
        @click="deconnecter"
      >
        Déconnexion
      </button>
    </header>
    <RouterView :key="$route.fullPath" />
  </div>
</template>
