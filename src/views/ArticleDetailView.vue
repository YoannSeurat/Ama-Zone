<script setup>
import { computed, inject, reactive, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = inject('articlesStore')
const article = computed(() => store.articles.find((item) => item.id === Number(route.params.id)))
const isEditing = computed(() => route.query.edit === 'true' && isAdmin.value)
const formulaire = reactive({ titre: '', description: '', prix: '', categorie: '' })

watchEffect(() => {
  if (!article.value) {
    router.replace('/articles')
  }
})

const isAdmin = computed(() => Boolean(store.session.isConnected || route.query.admin === 'true'))

function remplirFormulaire(article) {
  if (!article) return

  Object.assign(formulaire, {
    titre: article.titre,
    description: article.description,
    prix: article.prix,
    categorie: article.categorie,
  })
}

watch(article, remplirFormulaire, { immediate: true })

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
  router.push({ query: { ...route.query, admin: 'true', edit: 'true' } })
}

function sauvegarder() {
  if (!article.value) return

  store.modifierArticle(article.value.id, {
    titre: formulaire.titre.trim(),
    description: formulaire.description.trim(),
    prix: Number(formulaire.prix),
    categorie: formulaire.categorie,
  })
  router.push({ query: { admin: 'true' } })
}

function annulerModification() {
  router.push({ query: { admin: 'true' } })
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
      <button v-if="!isEditing" class="btn-back" type="button" @click="retour">
        <img src="/icons/back arrow.svg" alt="" class="btn-back__icon" />
        <span>Retour</span>
      </button>

      <article class="detail-card">
        <div class="detail-card__image-wrapper">
          <img :src="article.image" :alt="article.titre" class="detail-card__image" />
        </div>

        <div class="detail-card__body">
          <template v-if="isEditing">
            <div class="detail-edit-form">
              <label for="edit-categorie">Catégorie</label>
              <select id="edit-categorie" v-model="formulaire.categorie" required>
                <option v-for="categorie in store.categories" :key="categorie" :value="categorie">
                  {{ categorie }}
                </option>
              </select>

              <label for="edit-titre">Titre</label>
              <input id="edit-titre" v-model.trim="formulaire.titre" required />

              <label for="edit-description">Description</label>
              <textarea id="edit-description" v-model.trim="formulaire.description" required />

              <label for="edit-prix">Prix</label>
              <input
                id="edit-prix"
                v-model.number="formulaire.prix"
                type="number"
                min="0"
                step="0.01"
                required
              />
            </div>
          </template>
          <template v-else>
            <p class="detail-card__eyebrow">{{ article.categorie }}</p>
            <h2 class="detail-card__title">{{ article.titre }}</h2>
            <p class="detail-card__description">{{ article.description }}</p>
            <h2 class="detail-card__price">{{ article.prix.toFixed(2) }} €</h2>
          </template>

          <!-- Actions Admin -->
          <div
            v-if="isAdmin && !isEditing"
            class="detail-card__actions detail-card__actions--admin"
          >
            <button class="btn btn--danger" type="button" @click="supprimer">
              <img src="/icons/delete.svg" alt="" class="btn__icon" />
              <span>Supprimer</span>
            </button>
            <button class="btn btn--edit" type="button" @click="modifier">
              <img src="/icons/edit.svg" alt="" class="btn__icon" />
              <span>Modifier</span>
            </button>
          </div>

          <div v-if="isEditing" class="detail-card__actions detail-card__actions--edit">
            <button class="btn btn--primary" type="button" @click="sauvegarder">
              <img src="/icons/floppy disk save.svg" alt="save icon" />Sauvegarder
            </button>
            <button class="btn btn--ghost" type="button" @click="annulerModification">
              <img src="/icons/cross circle.svg" alt="cancel icon" />
              Annuler
            </button>
          </div>

          <!-- Actions Utilisateur -->
          <div v-if="!isEditing" class="detail-card__actions detail-card__actions--user">
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
