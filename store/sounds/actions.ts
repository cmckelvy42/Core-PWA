import { SoundsState } from './types'
import SoundManager, { Sounds } from '~/libraries/SoundManager/SoundManager'
import { ActionsArguments } from '~/types/store/store'

const $Sounds = new SoundManager()

export default {
  /**
   * @method playSound
   * @description play sound with its type
   * @example playSound(Sounds.CALL)
   */
  playSound({ state }: ActionsArguments<SoundsState>, call: Sounds) {
    const status = state[call]
    if (status) $Sounds.playSound(call)
  },
}
