<script setup>
import { computed, onMounted, provide, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articlesInitiaux } from './data/articles'

const STORAGE_KEYS = {
  cart: 'ama-zone-cart',
  session: 'ama-zone-session',
  articles: 'ama-zone-articles',
  imageSeed: 'ama-zone-image-seed',
}

// Nettoyage de l'ancienne persistance définitive si présente
localStorage.removeItem(STORAGE_KEYS.articles)
localStorage.removeItem('ama-zone-images-cache')

// Seed aléatoire généré une seule fois par session (nouveau au redémarrage, stable au F5)
function getSessionImageSeed() {
  let seed = sessionStorage.getItem(STORAGE_KEYS.imageSeed)
  if (!seed) {
    seed = Math.floor(Math.random() * 1_000_000).toString()
    sessionStorage.setItem(STORAGE_KEYS.imageSeed, seed)
  }
  return seed
}

const IMAGE_SEED = getSessionImageSeed()

const imagesChargees = new Set()

function chargerArticlesInitiaux() {
  const articlesSauvegardes = sessionStorage.getItem(STORAGE_KEYS.articles)

  if (articlesSauvegardes) {
    try {
      const parsed = JSON.parse(articlesSauvegardes)
      parsed.forEach((a) => {
        if (a.image) imagesChargees.add(a.id)
      })
      return parsed
    } catch {
      sessionStorage.removeItem(STORAGE_KEYS.articles)
    }
  }

  return articlesInitiaux.map((a) => ({ ...a }))
}

const articles = reactive(chargerArticlesInitiaux())
const route = useRoute()
const router = useRouter()
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
const totalPanier = computed(() => panier.reduce((sum, item) => sum + (item.quantite || 1), 0))
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
  modifierArticle,
  supprimerArticle,
  ajouterAuPanier,
  supprimerDuPanier,
  enleverDuPanier,
  definirRecherche,
  definirCategorie,
  definirPage,
  connecter,
  deconnecter,
})

function sauvegarderArticles() {
  sessionStorage.setItem(STORAGE_KEYS.articles, JSON.stringify(articles))
}

function sauvegarderPanier() {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(panier))
}

function ajouterArticle(article) {
  const nouvelArticle = {
    ...article,
    id: Date.now(),
  }

  articles.push(nouvelArticle)
  sauvegarderArticles()
  return nouvelArticle
}

function modifierArticle(articleId, modifications) {
  const article = articles.find((item) => item.id === articleId)

  if (!article) return null

  Object.assign(article, modifications)
  const articleDuPanier = panier.find((item) => item.id === articleId)
  if (articleDuPanier) {
    Object.assign(articleDuPanier, modifications)
  }
  sauvegarderArticles()
  sauvegarderPanier()
  return article
}

function supprimerArticle(articleId) {
  const index = articles.findIndex((article) => article.id === articleId)

  if (index !== -1) {
    articles.splice(index, 1)
    sauvegarderArticles()
  }

  supprimerDuPanier(articleId)
}

function ajouterAuPanier(article) {
  const item = panier.find((articleDuPanier) => articleDuPanier.id === article.id)
  if (item) {
    item.quantite = (item.quantite || 1) + 1
  } else {
    panier.push({ ...article, quantite: 1 })
  }
  sauvegarderPanier()
}

function enleverDuPanier(articleId) {
  const index = panier.findIndex((articleDuPanier) => articleDuPanier.id === articleId)
  if (index !== -1) {
    if (panier[index].quantite && panier[index].quantite > 1) {
      panier[index].quantite -= 1
    } else {
      panier.splice(index, 1)
    }
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

  if (route.name === 'admin') {
    router.push('/login')
  }
}

function restaurerDonneesLocales() {
  const panierSauvegarde = localStorage.getItem(STORAGE_KEYS.cart)
  const sessionSauvegardee = localStorage.getItem(STORAGE_KEYS.session)

  if (panierSauvegarde) {
    try {
      const parsed = JSON.parse(panierSauvegarde)
      panier.push(...parsed.map((item) => ({ ...item, quantite: item.quantite || 1 })))
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
  let aSauvegarder = false

  articlesVisibles.forEach((article) => {
    if (article.image || imagesChargees.has(article.id)) {
      return
    }

    imagesChargees.add(article.id)
    article.image = `https://picsum.photos/800/600?random=${IMAGE_SEED}${article.id}`
    aSauvegarder = true
  })

  if (aSauvegarder) {
    sauvegarderArticles()
  }
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
      <RouterLink class="brand" to="/"
        ><img src="/logo/logo white.png" alt="ama'zone logo" class="logo-img"
      /></RouterLink>
      <nav class="main-nav" aria-label="Navigation principale">
        <RouterLink to="/articles">Articles</RouterLink>
        <RouterLink to="/ajouter">Ajouter</RouterLink>
        <RouterLink to="/panier">Panier ({{ totalPanier }})</RouterLink>
        <RouterLink v-if="session.isConnected" to="/admin">Administration</RouterLink>
        <RouterLink v-else to="/login">Connexion</RouterLink>
      </nav>
      <button
        v-if="session.isConnected"
        class="deconnexion-button"
        type="button"
        @click="deconnecter"
      >
        Déconnexion
      </button>
    </header>
    <RouterView :key="$route.fullPath" />
  </div>
</template>
