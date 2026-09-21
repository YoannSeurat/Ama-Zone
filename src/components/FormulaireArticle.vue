<script setup>
import { reactive } from 'vue'

defineProps({
  categories: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['soumettre', 'annuler'])
const formulaire = reactive({ titre: '', description: '', prix: '', categorie: '' })

function soumettre() {
  emit('soumettre', { ...formulaire, prix: Number(formulaire.prix) })
  Object.assign(formulaire, { titre: '', description: '', prix: '', categorie: '' })
}
</script>

<template>
  <form class="article-form" @submit.prevent="soumettre">
    <div class="article-form__card">
      <div class="article-form__grid">
        <div class="article-form__field">
          <label for="titre-article">Titre</label>
          <input id="titre-article" v-model.trim="formulaire.titre" required />
        </div>

        <div class="article-form__field">
          <label for="description-article">Description</label>
          <textarea id="description-article" v-model.trim="formulaire.description" required />
        </div>

        <div class="article-form__field article-form__field--two">
          <div>
            <label for="prix-article">Prix</label>
            <input
              id="prix-article"
              v-model.number="formulaire.prix"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label for="categorie-article">Catégorie</label>
            <select id="categorie-article" v-model="formulaire.categorie" required>
              <option disabled value="">Choisir une catégorie</option>
              <option v-for="categorie in categories" :key="categorie" :value="categorie">
                {{ categorie }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn--primary" type="submit">Ajouter l'article</button>
    </div>
  </form>
</template>
