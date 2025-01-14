import { AccountsState, RegistrationStatus } from './types'
import mutations from '~/store/accounts/mutations'

describe('init', () => {
  let inst: any
  const state: AccountsState = {
    storePin: true,
    loading: true,
    locked: true,
    pin: 'pin',
    pinHash: 'pinHash',
    active: 'active',
    gasPrice: 'gasPrice',
    phrase: 'phrase',
    error: 'error',
    encryptedPhrase: 'encryptedPhrase',
    registered: true,
    details: {
      name: '',
      address: '',
      status: '',
      state: 'idle',
      unreadCount: 123,
      profilePicture: '',
      badge: 'community',
      userAccount: '',
      mailboxId: '',
      textilePubkey: '',
      lastUpdate: 1643889423133,
    },
    registrationStatus: RegistrationStatus.UNKNOWN,
    lastVisited: 'lastVisited',
  }

  beforeEach(() => {
    inst = mutations
  })

  it('should setPin', () => {
    const localStateForUnitTest = { ...state }
    inst.setPin(localStateForUnitTest, '123456')

    expect(localStateForUnitTest).toMatchObject({
      pin: '123456',
    })
  })

  it('should setStorePin', () => {
    const localStateForUnitTest = { ...state }
    inst.setStorePin(localStateForUnitTest, false)

    expect(localStateForUnitTest).toMatchObject({
      storePin: false,
    })
  })

  it('should setPinHash', () => {
    const localStateForUnitTest = { ...state }
    inst.setPinHash(localStateForUnitTest, '123456')

    expect(localStateForUnitTest).toMatchObject({
      pinHash: '123456',
    })
  })

  it('should lock', () => {
    const localStateForUnitTest = { ...state }
    inst.lock(localStateForUnitTest)

    expect(localStateForUnitTest).toMatchObject({
      locked: true,
    })
  })

  it('should unlock', () => {
    const localStateForUnitTest = { ...state }
    inst.unlock(localStateForUnitTest, '123456')

    expect(localStateForUnitTest).toMatchObject({
      locked: false,
      pin: '123456',
    })
  })

  it('should setEncryptedPhrase', () => {
    const localStateForUnitTest = { ...state }
    inst.setEncryptedPhrase(localStateForUnitTest, 'baa baa black sheep')

    expect(localStateForUnitTest).toMatchObject({
      encryptedPhrase: 'baa baa black sheep',
    })
  })

  it('should setPhrase', () => {
    const localStateForUnitTest = { ...state }
    inst.setPhrase(localStateForUnitTest, 'moo moo white cow')

    expect(localStateForUnitTest).toMatchObject({
      phrase: 'moo moo white cow',
    })
  })

  it('should setActiveAccount', () => {
    const localStateForUnitTest = { ...state }
    inst.setActiveAccount(localStateForUnitTest, 'aktif')

    expect(localStateForUnitTest).toMatchObject({
      active: 'aktif',
    })
  })

  it('should setUserDetails', () => {
    const localStateForUnitTest = { ...state }
    const newDetails = {
      username: 'username',
      status: 'status',
      photoHash: 'link',
      address: localStateForUnitTest.active,
    }
    inst.setUserDetails(localStateForUnitTest, newDetails)

    expect(localStateForUnitTest).toMatchObject({
      details: {
        name: newDetails.username,
        status: newDetails.status,
        profilePicture: newDetails.photoHash,
        address: localStateForUnitTest.active,
      },
    })
  })

  it('should updateMailboxId', () => {
    const localStateForUnitTest = { ...state }
    inst.updateMailboxId(localStateForUnitTest, 'mailbox')

    expect(localStateForUnitTest).toMatchObject({
      details: {
        mailboxId: 'mailbox',
      },
    })
  })

  it('should updateTextilePubkey', () => {
    const localStateForUnitTest = { ...state }
    inst.updateTextilePubkey(localStateForUnitTest, 'textile pubkey')

    expect(localStateForUnitTest).toMatchObject({
      details: {
        textilePubkey: 'textile pubkey',
      },
    })
  })

  it('should setRegistrationStatus', () => {
    const localStateForUnitTest = { ...state }
    inst.setRegistrationStatus(
      localStateForUnitTest,
      RegistrationStatus.IN_PROGRESS,
    )

    expect(localStateForUnitTest).toMatchObject({
      registrationStatus: RegistrationStatus.IN_PROGRESS,
    })
  })

  it('should setLastVisited', () => {
    const localStateForUnitTest = { ...state }
    inst.setLastVisited(localStateForUnitTest, 'yesterday')

    expect(localStateForUnitTest).toMatchObject({
      lastVisited: 'yesterday',
    })
  })

  it('should setLastVisited', () => {
    const localStateForUnitTest = { ...state }
    inst.setLastVisited(localStateForUnitTest, 'yesterday')

    expect(localStateForUnitTest).toMatchObject({
      lastVisited: 'yesterday',
    })
  })
})
