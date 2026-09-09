import UnexpectedPromptResolver from '../UnexpectedPromptResolver'
import { SimulationStrategy } from '../SimulationStrategy'
import {
  PROMPT_TYPE_SINGLE_CREATURE,
  PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
  PROMPT_TYPE_NUMBER,
  PROMPT_TYPE_PAYMENT_SOURCE,
  PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
} from 'moonlands/dist/esm/const'

describe('UnexpectedPromptResolver', () => {
  const resolver = new UnexpectedPromptResolver()

  function makeState(opts: any) {
    return {
      getPromptType: () => opts.promptType,
      state: {
        promptParams: opts.promptParams || {},
        promptAvailableCards: opts.promptAvailableCards || [],
      },
      getMyCreaturesInPlay: () => opts.myCreatures || [],
      getEnemyCreaturesInPlay: () => opts.enemyCreatures || [],
      getCardsForFilteredPrompt: () => opts.filtered || [],
      getPaymentSourceCards: () => opts.payment || [],
      playerId: opts.playerId || 1,
    }
  }

  test('chooses lowest-energy creature for single creature prompt', () => {
    const state = makeState({
      promptType: PROMPT_TYPE_SINGLE_CREATURE,
      promptParams: {},
      myCreatures: [
        { id: 'a', data: { energy: 3 } },
        { id: 'b', data: { energy: 1 } },
        { id: 'c', data: { energy: 2 } },
      ],
    }) as any

    const action: any = resolver.resolvePrompt(state)
    expect(action.type).toBe('actions/resolve_prompt')
    expect(action.target).toBe('b')
  })

  test('chooses specified number of cards from zone', () => {
    const state = makeState({
      promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
      promptParams: { cards: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }], numberOfCards: 2, zone: 'zones/hand', zoneOwner: 1 },
    }) as any

    const action: any = resolver.resolvePrompt(state)
    expect(action.type).toBe('actions/resolve_prompt')
    expect(action.cards).toEqual(['c1', 'c2'])
    expect(action.zone).toBe('zones/hand')
  })

  test('chooses min number for number prompt', () => {
    const state = makeState({
      promptType: PROMPT_TYPE_NUMBER,
      promptParams: { min: 2, max: 5 },
    }) as any

    const action: any = resolver.resolvePrompt(state)
    expect(action.type).toBe('actions/resolve_prompt')
    expect(action.number).toBe(2)
  })

  test('chooses first payment source', () => {
    const state = makeState({
      promptType: PROMPT_TYPE_PAYMENT_SOURCE,
      payment: ['p1', 'p2'],
    }) as any

    const action: any = resolver.resolvePrompt(state)
    expect(action.type).toBe('actions/resolve_prompt')
    expect(action.target).toBe('p1')
  })

  test('strategy falls back to unexpected-prompt resolver when there is no queued resolve action', () => {
    const strategy = new SimulationStrategy()
    const confusingPromptState = {
      getPromptType: () => PROMPT_TYPE_SINGLE_CREATURE,
      getStep: () => 1,
      getOpponentId: () => 2,
      playerPriority: () => false,
      isInMyPromptState: () => true,
      isInPromptState: () => true,
      waitingForCardSelection: () => false,
      waitingForPaymentSourceSelection: () => false,
      getStartingCards: () => [],
      getPaymentSourceCards: () => [],
      getCardsForFilteredPrompt: () => [],
      state: {
        prompt: true,
        promptPlayer: 1,
        promptType: PROMPT_TYPE_SINGLE_CREATURE,
        promptParams: {},
        promptAvailableCards: [],
        promptGeneratedBy: 'boom',
        zones: { playerHand: [] },
      },
      getMyCreaturesInPlay: () => [
        { id: 'me-first', data: { energy: 9 }, card: { name: 'Alpha' } },
        { id: 'me-second', data: { energy: 2 }, card: { name: 'Beta' } },
      ],
      getEnemyCreaturesInPlay: () => [],
      getMyMagi: () => ({ id: 'magi', card: 'Adis', data: { energy: 5 } }),
      getMyRelicsInPlay: () => [],
      getPlayableCards: () => [],
    } as any

    strategy.setup(confusingPromptState, 1)
    const action = (strategy as any).requestAction()
    expect(action.type).toBe('actions/resolve_prompt')
    expect(action.target).toBe('me-second')
  })

  test('any creature except source picks lowest-energy non-source', () => {
    const state = makeState({
      promptType: PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
      promptParams: { source: { id: 'x' } },
      myCreatures: [ { id: 'x', data: { energy: 5 } }, { id: 'm1', data: { energy: 2 } } ],
      enemyCreatures: [ { id: 'e1', data: { energy: 3 } } ],
    }) as any

    const action: any = resolver.resolvePrompt(state)
    expect(action.type).toBe('actions/resolve_prompt')
    // lowest energy among m1(2) and e1(3) is m1
    expect(action.target).toBe('m1')
  })
})
