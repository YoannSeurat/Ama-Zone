<script setup>
defineProps({
  article: {
    type: Object,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['voir', 'ajouter', 'supprimer', 'modifier'])
</script>

<template>
  <article class="article-card">
    <div class="article-card__image-wrapper">
      <img :src="article.image" :alt="article.titre" />
    </div>
    <div class="article-card__body">
      <p class="article-card__eyebrow">{{ article.categorie }}</p>
      <h2 class="article-card__title">{{ article.titre }}</h2>
      <p class="article-card__description">{{ article.description }}</p>
      <h2 class="article-card__price">{{ article.prix.toFixed(2) }} €</h2>

      <!-- Actions pour la vue Admin -->
      <div v-if="admin" class="article-card__actions">
        <div class="article-card__actions-row">
          <button
            class="btn btn--ghost btn--icon-only"
            type="button"
            title="Détails"
            aria-label="Détails"
            @click="$emit('voir', article)"
          >
            <img src="/icons/question.svg" alt="Détails" class="details" />
          </button>
          <button class="btn btn--danger" type="button" @click="$emit('supprimer', article)">
            <img src="/icons/delete.svg" alt="Supprimer" class="btn__icon" />
            Supprimer
          </button>
        </div>
        <button class="btn btn--edit" type="button" @click="$emit('modifier', article)">
          <img src="/icons/edit.svg" alt="Modifier" class="btn__icon" />
          Modifier
        </button>
      </div>

      <!-- Actions pour la vue Articles (Client) -->
      <div v-else class="article-card__actions">
        <button class="btn btn--ghost" type="button" @click="$emit('voir', article)">
          <span class="btn__icon"
            ><img src="/icons/question.svg" alt="question" class="details"
          /></span>
          Détails
        </button>
        <button class="btn btn--primary" type="button" @click="$emit('ajouter', article)">
          <img src="/icons/cart-add.svg" alt="add to cart" class="cart-add" />
          Ajouter au panier
        </button>
      </div>
    </div>
  </article>
</template>
