<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import FormulaireArticle from '../components/FormulaireArticle.vue'

const router = useRouter()
const store = inject('articlesStore')
const message = ref('')

function ajouter(article) {
  const articleAjoute = store.ajouterArticle(article)
  message.value = `L'article « ${articleAjoute.titre} » a été ajouté.`
}
</script>

<template>
  <main>
    <h1>Ajouter un article</h1>
    <FormulaireArticle @soumettre="ajouter" @annuler="router.push('/articles')" />
    <p v-if="message">{{ message }}</p>
  </main>
</template>
