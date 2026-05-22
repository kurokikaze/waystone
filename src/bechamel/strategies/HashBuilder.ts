import {State} from 'moonlands/dist/esm/index'
import {PROPERTY_ATTACKS_PER_TURN, TYPE_CREATURE, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY} from "../const"

export class HashBuilder {
  private ids = new Map<string, number>()
  private comesFrom = new Map<string, string>()
  private childIds = new Map<string, number>()
  private childParentNames = new Map<string, string>()

  constructor() {}

  public makeHash(sim: State): string {
    const battlefieldCards = sim.getZone(ZONE_TYPE_IN_PLAY).cards
    let cardHashes: string[] = []
    for (const card of battlefieldCards) {
      const attacks = sim.modifyByStaticAbilities(card, PROPERTY_ATTACKS_PER_TURN)
      const attacked = card.data.attacked
      const attackPart = (card.card.type === TYPE_CREATURE && card.data.controller == sim.getActivePlayer()) ? `(${attacked}/${attacks})` : ''
      const energyPart = card.card.type === TYPE_CREATURE ? card.data.energy : '*'
      let powersPart = ''
      if (card.data.actionsUsed && card.data.actionsUsed.length) {
        powersPart = `[${card.data.actionsUsed.map((action: string) => this.convertHash(action)).join(',')}]`
      }
      cardHashes.push(`#${this.convertHash(card.id)}${attackPart}${powersPart}:${energyPart}`)
    }
    const handCards = sim.getZone(ZONE_TYPE_HAND, sim.players[0]).cards
    const handHashes: string[] = []
    const handCardNames = handCards.map(card => card.card.name)
    handCardNames.sort()
    for (const cardName of handCardNames) {
      handHashes.push(this.convertHash(cardName).toString())
    }
    const ourMagi = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, sim.players[0]).card
    const ourMagiHash = ourMagi ? `@${ourMagi.data.energy}[${ourMagi.data.actionsUsed.map((action: string) => this.convertHash(action)).join(',')}]` : 'X'
    const enemyMagi = sim.getZone(ZONE_TYPE_ACTIVE_MAGI, sim.players[1]).card
    const enemyMagiHash = enemyMagi ? `@${enemyMagi.data.energy}` : 'X'

    return (sim.state.activePlayer === sim.players[0] ? '*' : 'v') + sim.state.step?.toString() + '{' + handHashes.join(',') + '}' + ourMagiHash + '|' + cardHashes.join('|') + '|' + enemyMagiHash + (sim.state.prompt ? `?${sim.state.promptPlayer}:` + this.convertHash(sim.state.promptGeneratedBy || '') + `[${sim.state.promptGeneratedBy}]` : '')
  }

  private convertHash(hash: string): number {
    if (this.ids.has(hash)) {
      return this.ids.get(hash) || 999
    }

    const nextId = this.ids.size + 1
    if (this.comesFrom.has(hash)) {
      const parentId = this.comesFrom.get(hash);
      const parentName = this.childParentNames.get(hash);
      const resolvedParentHash = parentName || parentId;

      // Okay, we've either already seen this pair...
      if (resolvedParentHash && this.childIds.has(resolvedParentHash)) {
        const id = this.childIds.get(resolvedParentHash) as number;
        this.ids.set(hash, id);
        return id;
      } else {
        // ...or it's our first time.
        if (resolvedParentHash) {
          this.childIds.set(resolvedParentHash, nextId);
        }
        this.ids.set(hash, nextId);
        return nextId;
      }
    }
    this.ids.set(hash, nextId)
    return nextId
  }

  public registerChildHash(parent: string, child: string, parentName?: string) {
    this.comesFrom.set(child, parent);
    if (parentName) {
      this.childParentNames.set(child, parentName);
    }
  }
}