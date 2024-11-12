/* global window */
import { ConvertedCard, HiddenConvertedCard } from 'moonlands/src/classes/CardInGame';
import {
  ZONE_TYPE_ACTIVE_MAGI,
  ZONE_TYPE_MAGI_PILE,
  ZONE_TYPE_DEFEATED_MAGI,
  ZONE_TYPE_DECK,
  ZONE_TYPE_DISCARD,
  ZONE_TYPE_HAND,
  ZONE_TYPE_IN_PLAY,
  EXPIRATION_NEVER,
  EXPIRATION_ANY_TURNS,
  EXPIRATION_OPPONENT_TURNS,
} from 'moonlands/src/const';
import { ZoneType } from 'moonlands/src/types';
import { ClientEffectAddEnergyToCreature, ClientEffectRemoveEnergyFromCreature } from '../clientProtocol';
import { State, ContinuousEffectType } from '../types';
import { byName } from 'moonlands/src/cards';

const clientZoneNames: Record<ZoneType, string> = {
  [ZONE_TYPE_DECK]: 'Deck',
  [ZONE_TYPE_HAND]: 'Hand',
  [ZONE_TYPE_DISCARD]: 'Discard',
  [ZONE_TYPE_ACTIVE_MAGI]: 'ActiveMagi',
  [ZONE_TYPE_MAGI_PILE]: 'MagiPile',
  [ZONE_TYPE_DEFEATED_MAGI]: 'DefeatedMagi',
  [ZONE_TYPE_IN_PLAY]: 'InPlay',
};

export const findInPlay = (state: State, id: string) => {
  const cardPlayerInPlay = state.zones.inPlay.find(card => card.id === id);
  if (cardPlayerInPlay) return cardPlayerInPlay;

  const cardPlayerMagi = state.zones.playerActiveMagi.find(card => card.id === id);
  if (cardPlayerMagi) return cardPlayerMagi;

  const cardOpponentMagi = state.zones.opponentActiveMagi.find(card => card.id === id);
  if (cardOpponentMagi) return cardOpponentMagi;

  return null;
};

export const getZoneName = (
  serverZoneType: ZoneType,
  source: ConvertedCard | HiddenConvertedCard,
  playerId: number
): keyof State["zones"] => {
  if (!clientZoneNames[serverZoneType]) {
    throw new Error(`Unknown zone: ${serverZoneType}`);
  }

  if (serverZoneType === ZONE_TYPE_IN_PLAY) {
    return 'inPlay';
  }
  const zonePrefix = source.owner === playerId ? 'player' : 'opponent';
  const zoneName = clientZoneNames[serverZoneType];
  return `${zonePrefix}${zoneName}` as keyof State["zones"];
};

export const tickDownContinuousEffects = (effects: ContinuousEffectType[], opponent: boolean): ContinuousEffectType[] => {
  let resultingEffects: ContinuousEffectType[] = [];
  for (const effect of effects) {
    switch (effect.expiration.type) {
      case EXPIRATION_NEVER: {
        resultingEffects.push(effect);
        break;
      }
      case EXPIRATION_ANY_TURNS: {
        const turns = effect.expiration.turns - 1;
        if (turns > 0) {
          resultingEffects.push({
            ...effect,
            expiration: {
              ...effect.expiration,
              turns,
            }
          });
        }
        break;
      }
      case EXPIRATION_OPPONENT_TURNS: {
        if (opponent) {
          const turns = effect.expiration.turns - 1;
          if (turns >= 0) {
            resultingEffects.push({
              ...effect,
              expiration: {
                ...effect.expiration,
                turns,
              }
            });
          }
        } else {
          resultingEffects.push(effect);
        }
        break;
      }
    }
  }

  return resultingEffects;
}

export const cleanupContinuousEffects = (effects: ContinuousEffectType[], opponent: boolean): ContinuousEffectType[] => {
  let resultingEffects: ContinuousEffectType[] = [];
  for (const effect of effects) {
    switch (effect.expiration.type) {
      case EXPIRATION_NEVER: {
        resultingEffects.push(effect);
        break;
      }
      case EXPIRATION_ANY_TURNS: {
        if (effect.expiration.turns > 0) {
          resultingEffects.push(effect);
        }
        break;
      }
      case EXPIRATION_OPPONENT_TURNS: {
        if (opponent) {
          if (effect.expiration.turns > 0) {
            resultingEffects.push(effect);
          }
        } else {
          resultingEffects.push(effect);
        }
        break;
      }
    }
  }

  return resultingEffects;
}

export const affectRemoveEnergy = (state: State, card: ConvertedCard, action: ClientEffectRemoveEnergyFromCreature): number => {
  const gameCard = byName(card.card);
  const source = action.source ? findInPlay(state, action.source.id) : null;
  if (gameCard && gameCard.data.energyStasis && source && source.data.controller === card.data.controller) {
    // For the Colossus
    return card.data.energy;
  }
  let energyLossThreshold = card.data.energyLossThreshold || 0;
  // This is a hacky way to represent burrowing, but will do for now
  if (card.data.burrowed) {
    energyLossThreshold = 2;
  }
  const energyLoss = card.data.energy - action.amount;
  return (energyLossThreshold > 0) ? Math.min(energyLoss, energyLossThreshold) : energyLoss;
}

export const affectAddEnergy = (state: State, card: ConvertedCard, action: ClientEffectAddEnergyToCreature): number => {
  const gameCard = byName(card.card)
  const source = action.source ? findInPlay(state, action.source.id) : null;
  if (gameCard && gameCard.data.energyStasis && source && source.data.controller === card.data.controller) {
    // For the Colossus
    return card.data.energy;
  }
  return card.data.energy + action.amount;
}