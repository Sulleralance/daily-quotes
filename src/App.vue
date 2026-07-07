<template>
  <div class="min-h-screen bg-blue-900 p-2 sm:p-4 font-retro" style="background-color: #000080; font-family: 'Press Start 2P', cursive;">
    <div class="crt-bezel"></div>
    <div class="max-w-2xl mx-auto">
      <div class="mb-6 text-center pixel-text" style="color: #00FF00; text-shadow: 2px 2px #FF00FF, 4px 4px #00FFFF;">
        <h1 style="font-size: 20px; letter-spacing: 2px; margin-bottom: 8px;">
          === DAILY QUOTES ===
        </h1>
        <p style="font-size: 8px; color: #00FFFF; letter-spacing: 1px;">
          &gt;&gt; RETRO EDITION &lt;&lt;
        </p>
      </div>

      <div class="retro-card mb-6" style="background-color: #000080; border: 3px solid #00FF00; padding: 20px; box-shadow: 8px 8px 0px #FF00FF;">
        <div v-if="currentQuote" class="text-center">
          <p class="pixel-text mb-6" style="color: #00FF00; font-size: 12px; line-height: 1.8; text-shadow: 2px 2px #FF00FF;">
            &gt;&gt; "{{ currentQuote.text }}" &lt;&lt;
          </p>
          <p style="color: #00FFFF; font-size: 10px; letter-spacing: 1px; margin-bottom: 20px;">
            -- {{ currentQuote.author || 'ANONYMOUS' }} --
          </p>
          <div style="color: #FF00FF; font-size: 8px; margin-bottom: 16px; letter-spacing: 1px;">
            [ QUOTE {{ currentQuoteIndex + 1 }} / {{ quotes.length }} ]
          </div>
          <div class="flex gap-2 justify-center flex-wrap">
            <button @click="getRandomQuote" style="background-color: #00FF00; color: #000080; border: 3px solid #00FF00; font-size: 10px; padding: 8px 12px;">
              [NEXT]
            </button>
            <button @click="toggleFavorite" :style="{ backgroundColor: isFavorited ? '#FF00FF' : '#00FFFF', color: '#000080', border: `3px solid ${isFavorited ? '#FF00FF' : '#00FFFF'}`, fontSize: '10px', padding: '8px 12px' }">
              {{ isFavorited ? '[FAV]' : '[ADD]' }}
            </button>
          </div>
        </div>
        <div v-else class="text-center" style="color: #00FFFF;">
          <p style="font-size: 10px; letter-spacing: 1px;">NO QUOTES LOADED</p>
        </div>
      </div>

      <div class="retro-card mb-6" style="background-color: #000080; border: 3px solid #FF00FF; padding: 20px; box-shadow: 8px 8px 0px #00FFFF;">
        <h2 class="pixel-text mb-4" style="color: #FF00FF; font-size: 12px;">
          &gt;&gt; ADD QUOTE &lt;&lt;
        </h2>
        <form @submit.prevent="addQuote" class="space-y-3">
          <div>
            <label class="block" style="color: #00FFFF; font-size: 8px; margin-bottom: 4px; letter-spacing: 1px;">
              [ QUOTE TEXT ]
            </label>
            <textarea v-model="newQuote.text" placeholder="> ENTER YOUR QUOTE..." style="width: 100%; background-color: #000000; color: #00FF00; border: 2px solid #00FFFF; padding: 8px; font-family: 'Press Start 2P', cursive; font-size: 10px; resize: none;" rows="2"></textarea>
          </div>
          <div>
            <label class="block" style="color: #00FFFF; font-size: 8px; margin-bottom: 4px; letter-spacing: 1px;">
              [ AUTHOR NAME ]
            </label>
            <input v-model="newQuote.author" type="text" placeholder="> OPTIONAL..." style="width: 100%; background-color: #000000; color: #00FF00; border: 2px solid #00FFFF; padding: 8px; font-family: 'Press Start 2P', cursive; font-size: 10px;" />
          </div>
          <button type="submit" style="width: 100%; background-color: #FF00FF; color: #000080; border: 3px solid #FF00FF; font-size: 10px; padding: 8px; font-family: 'Press Start 2P', cursive; font-weight: bold;">
            [SAVE QUOTE]
          </button>
        </form>
      </div>

      <div class="retro-card" style="background-color: #000080; border: 3px solid #00FFFF; padding: 20px; box-shadow: 8px 8px 0px #FF00FF;">
        <h2 class="pixel-text mb-4" style="color: #00FFFF; font-size: 12px;">
          &gt;&gt; LIBRARY &lt;&lt;
        </h2>
        <div style="color: #00FF00; font-size: 8px; margin-bottom: 16px; letter-spacing: 1px;">
          [ {{ quotes.length }} QUOTE(S) STORED ]
        </div>
        <div v-if="quotes.length > 0" class="space-y-3">
          <div v-for="(quote, index) in quotes" :key="index" style="background-color: #000000; border: 2px solid #00FF00; padding: 12px; margin-bottom: 8px; box-shadow: 4px 4px 0px rgba(255, 0, 255, 0.3);">
            <p style="color: #00FF00; font-size: 9px; line-height: 1.4; margin-bottom: 6px;">"{{ quote.text }}"</p>
            <p style="color: #00FFFF; font-size: 8px; margin-bottom: 6px;">-- {{ quote.author || 'ANONYMOUS' }} --</p>
            <button @click="deleteQuote(index)" style="background-color: #FF0000; color: #FFFF00; border: 2px solid #FF0000; font-size: 8px; padding: 4px 8px; font-family: 'Press Start 2P', cursive;">
              [DEL]
            </button>
          </div>
        </div>
        <p v-else style="color: #FF00FF; text-align: center; font-size: 10px; padding: 20px 0;">
          &gt;&gt; NO QUOTES YET &lt;&lt;
        </p>
      </div>

      <div class="mt-8 text-center" style="color: #00FFFF; font-size: 8px; letter-spacing: 1px;">
        <p>[ OFFLINE MODE ] [ STORED LOCALLY ] [ WORKS ANYWHERE ]</p>
        <p style="margin-top: 8px; color: #FF00FF;">v1.0 RETRO EDITION</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const quotes = ref([])
    const newQuote = ref({ text: '', author: '' })
    const currentQuoteIndex = ref(0)
    const favorites = ref([])

    const sampleQuotes = [
      { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
      { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
      { text: 'Life is what happens when you are busy making other plans.', author: 'John Lennon' },
      { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
      { text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle' }
    ]

    const loadQuotes = () => {
      const saved = localStorage.getItem('quotes')
      if (saved) {
        quotes.value = JSON.parse(saved)
      } else {
        quotes.value = [...sampleQuotes]
        saveQuotes()
      }
      const savedFavorites = localStorage.getItem('favorites')
      if (savedFavorites) {
        favorites.value = JSON.parse(savedFavorites)
      }
    }

    const saveQuotes = () => {
      localStorage.setItem('quotes', JSON.stringify(quotes.value))
    }

    const saveFavorites = () => {
      localStorage.setItem('favorites', JSON.stringify(favorites.value))
    }

    const getRandomQuote = () => {
      if (quotes.value.length > 0) {
        currentQuoteIndex.value = Math.floor(Math.random() * quotes.value.length)
      }
    }

    const addQuote = () => {
      if (newQuote.value.text.trim()) {
        quotes.value.push({
          text: newQuote.value.text,
          author: newQuote.value.author || 'Anonymous'
        })
        saveQuotes()
        newQuote.value = { text: '', author: '' }
        getRandomQuote()
      }
    }

    const deleteQuote = (index) => {
      quotes.value.splice(index, 1)
      saveQuotes()
      if (currentQuoteIndex.value >= quotes.value.length && quotes.value.length > 0) {
        currentQuoteIndex.value = 0
      }
    }

    const toggleFavorite = () => {
      if (currentQuote.value) {
        const quoteStr = JSON.stringify(currentQuote.value)
        const index = favorites.value.findIndex(q => JSON.stringify(q) === quoteStr)
        if (index > -1) {
          favorites.value.splice(index, 1)
        } else {
          favorites.value.push(currentQuote.value)
        }
        saveFavorites()
      }
    }

    const currentQuote = computed(() => {
      return quotes.value[currentQuoteIndex.value] || null
    })

    const isFavorited = computed(() => {
      if (!currentQuote.value) return false
      return favorites.value.some(q => JSON.stringify(q) === JSON.stringify(currentQuote.value))
    })

    onMounted(() => {
      loadQuotes()
      if (quotes.value.length > 0) {
        getRandomQuote()
      }
    })

    return {
      quotes,
      newQuote,
      currentQuote,
      currentQuoteIndex,
      favorites,
      getRandomQuote,
      addQuote,
      deleteQuote,
      toggleFavorite,
      isFavorited
    }
  }
}
</script>
