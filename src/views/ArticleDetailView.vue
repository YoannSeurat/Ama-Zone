<script setup>
import { computed, inject, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = inject('articlesStore')
const article = computed(() => store.articles.find((item) => item.id === Number(route.params.id)))

watchEffect(() => {
  if (!article.value) {
    router.replace('/articles')
  }
})

const isAdmin = computed(() => Boolean(store.session.isConnected || route.query.admin === 'true'))

const quantite = computed(() => {
  const item = store.panier.find((p) => p.id === article.value?.id)
  return item ? item.quantite || 1 : 0
})

function ajouter() {
  if (article.value) {
    store.ajouterAuPanier(article.value)
  }
}

function diminuer() {
  if (article.value && quantite.value > 0) {
    store.enleverDuPanier(article.value.id)
  }
}

function supprimer() {
  if (!article.value) return
  if (window.confirm('Supprimer cet article ?')) {
    store.supprimerArticle(article.value.id)
    router.push('/admin')
  }
}

function modifier() {
  // Ne fait rien pour l'instant
}

function retour() {
  if (isAdmin.value) {
    router.push('/admin')
  } else {
    router.push('/articles')
  }
}
</script>

<template>
  <main v-if="article" class="article-detail-page">
    <div class="article-detail-container">
      <button class="btn-back" type="button" @click="retour">
        <img src="/icons/back arrow.svg" alt="" class="btn-back__icon" />
        <span>Retour</span>
      </button>

      <article class="detail-card">
        <div class="detail-card__image-wrapper">
          <img :src="article.image" :alt="article.titre" class="detail-card__image" />
        </div>

        <div class="detail-card__body">
          <p class="detail-card__eyebrow">{{ article.categorie }}</p>
          <h2 class="detail-card__title">{{ article.titre }}</h2>
          <p class="detail-card__description">{{ article.description }}</p>
          <h2 class="detail-card__price">{{ article.prix.toFixed(2) }} €</h2>

          <!-- Actions Admin -->
          <div v-if="isAdmin" class="detail-card__actions detail-card__actions--admin">
            <button class="btn btn--danger" type="button" @click="supprimer">
              <img src="/icons/delete.svg" alt="" class="btn__icon" />
              <span>Supprimer</span>
            </button>
            <button class="btn btn--edit" type="button" @click="modifier">
              <img src="/icons/edit.svg" alt="" class="btn__icon" />
              <span>Modifier</span>
            </button>
          </div>

          <!-- Actions Utilisateur -->
          <div class="detail-card__actions detail-card__actions--user">
            <button
              class="btn-qty-minus"
              type="button"
              :disabled="quantite <= 0"
              title="Enlever du panier"
              aria-label="Enlever du panier"
              @click="diminuer"
            >
              <img src="/icons/minus.svg" alt="Moins" class="btn-qty-minus__icon" />
            </button>
            <div class="qty-display">{{ quantite }}</div>
            <button class="btn btn--primary" type="button" @click="ajouter">
              <img src="/icons/cart-add.svg" alt="" class="cart-add" />
              <span>Ajouter au panier</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  </main>
</template>
