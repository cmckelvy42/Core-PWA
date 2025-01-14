import { UIState } from './types'

const getters = {
  getSortedMostUsedEmojis: (state: UIState) => {
    return [...state.mostEmojiUsed].sort((a, b) => b.count - a.count)
  },
  getSortedRecentGlyphs: (state: UIState) => {
    return [...state.recentGlyphs].sort((a, b) => b.count - a.count)
  },
  showSidebar: (state: UIState) => {
    return state.showSidebar
  },
}

export default getters
