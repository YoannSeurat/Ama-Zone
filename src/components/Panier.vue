<script setup>
defineProps({
  articles: {
    type: Array,
    required: true,
  },
})

defineEmits(['retirer'])
</script>

<template>
  <p v-if="!articles.length" class="empty-state">Votre panier est vide.</p>
  <ul v-else class="cart-list">
    <li v-for="article in articles" :key="article.id">
      <span>{{ article.titre }} <strong>{{ article.prix.toFixed(2) }} €</strong></span>
      <button type="button" @click="$emit('retirer', article.id)">Retirer</button>
    </li>
  </ul>
</template>
