<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['soumettre', 'annuler'])
const formulaire = reactive({ titre: '', description: '', prix: '', categorie: '' })

function soumettre() {
  emit('soumettre', { ...formulaire, prix: Number(formulaire.prix) })
  Object.assign(formulaire, { titre: '', description: '', prix: '', categorie: '' })
}
</script>

<template>
  <form class="article-form" @submit.prevent="soumettre">
    <label>Titre <input v-model.trim="formulaire.titre" required /></label>
    <label>Description <textarea v-model.trim="formulaire.description" required /></label>
    <label
      >Prix <input v-model.number="formulaire.prix" type="number" min="0" step="0.01" required
    /></label>
    <label>Catégorie <input v-model.trim="formulaire.categorie" required /></label>
    <div class="form-actions">
      <button type="submit">Ajouter l'article</button>
      <button class="secondary-button" type="button" @click="emit('annuler')">Annuler</button>
    </div>
  </form>
</template>
