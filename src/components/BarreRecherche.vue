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
    <label for="recherche">Rechercher un article</label>
    <div>
      <input id="recherche" v-model="recherche" type="search" placeholder="Ex. casque audio" />
      <button type="submit">Rechercher</button>
    </div>
  </form>
</template>
