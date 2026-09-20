<script setup>
import { ref } from 'vue'

const emit = defineEmits(['rechercher'])
const recherche = ref('')

function envoyerRecherche() {
  emit('rechercher', recherche.value)
}
</script>

<template>
  <form class="search-bar" @submit.prevent="envoyerRecherche">
    <label class="search-bar__label" for="recherche">Rechercher un article</label>
    <div class="search-bar__row">
      <input
        id="recherche"
        v-model="recherche"
        type="search"
        class="search-bar__input"
        placeholder="ex. casque audio"
      />
      <button type="submit" class="search-bar__button" aria-label="Rechercher">
        <img src="/icons/search.svg" alt="search icon" class="search-bar__icon" />
        Rechercher
      </button>
    </div>
  </form>
</template>
