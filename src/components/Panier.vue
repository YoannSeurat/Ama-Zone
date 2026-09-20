<script setup>
defineProps({
  articles: {
    type: Array,
    required: true,
  },
})

defineEmits(['ajouter', 'enlever', 'retirer'])
</script>

<template>
  <p v-if="!articles.length" class="cart-empty">
    <strong>Votre panier est vide.</strong>
    <span>Ajoutez un article pour le retrouver ici.</span>
  </p>
  <ul v-else class="cart-list">
    <li v-for="article in articles" :key="article.id" class="cart-item">
      <img class="cart-item__image" :src="article.image" :alt="article.titre" />
      <div class="cart-item__details">
        <p class="article-card__eyebrow">{{ article.categorie }}</p>
        <h2 class="cart-item__title">{{ article.titre }}</h2>
        <p class="cart-item__unit-price">{{ article.prix.toFixed(2) }} €</p>
      </div>
      <div class="cart-item__quantity">
        <div class="quantity-control" aria-label="Modifier la quantite">
          <button
            class="quantity-control__button"
            type="button"
            :aria-label="`Retirer une unite de ${article.titre}`"
            @click="$emit('enlever', article.id)"
          >
            <img src="/icons/minus large.svg" alt="less" />
          </button>
          <span class="quantity-control__value">{{ article.quantite || 1 }}</span>
          <button
            class="quantity-control__button"
            type="button"
            :aria-label="`Ajouter une unite de ${article.titre}`"
            @click="$emit('ajouter', article)"
          >
            <img src="/icons/plus.svg" alt="more" />
          </button>
        </div>
      </div>
      <strong class="cart-item__subtotal"
        >{{ (article.prix * (article.quantite || 1)).toFixed(2) }} €</strong
      >
      <button
        class="cart-item__remove"
        type="button"
        :aria-label="`Retirer ${article.titre} du panier`"
        @click="$emit('retirer', article.id)"
      >
        <img src="/icons/delete black.svg" alt="" />
      </button>
    </li>
  </ul>
</template>
