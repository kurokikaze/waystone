export const SHOW_POWER_NAME = 'actions/show_power_name';
export const HIDE_POWER_NAME = 'actions/hide_power_name';
export const START_POWER_ANIMATION = 'actions/start_power_animation';
export const END_POWER_ANIMATION = 'actions/end_power_animation';
export const START_ATTACK_ANIMATION = 'actions/start_attack_animation';
export const END_ATTACK_ANIMATION = 'actions/end_attack_animation';
export const START_RELIC_ANIMATION = 'actions/start_relic_animation';
export const END_RELIC_ANIMATION = 'actions/end_relic_animation';
export const START_SPELL_ANIMATION = 'actions/start_spell_animation';
export const END_SPELL_ANIMATION = 'actions/end_spell_animation';
export const START_CREATURE_ANIMATION = 'actions/start_creature_animation';
export const END_CREATURE_ANIMATION = 'actions/end_creature_animation';
export const START_MAGI_DEFEAT_ANIMATION = 'actions/start_magi_defeat_animation';
export const END_MAGI_DEFEAT_ANIMATION = 'actions/end_magi_defeat_animation';
export const START_CREATURE_DISCARD_ANIMATION = 'actions/start_creature_discard_animation';
export const END_CREATURE_DISCARD_ANIMATION = 'actions/end_creature_discard_animation';
export const START_PROMPT_RESOLUTION_ANIMATION = 'actions/start_prompt_resolution_animation';
export const END_PROMPT_RESOLUTION_ANIMATION = 'actions/end_prompt_resolution_animation';
export const END_STEP_ANIMATION = 'actions/end_step_animation';
export const END_ANIMATION = 'actions/end_animation';

export const ADD_TO_PACK = 'actions/add_to_pack';
export const DISMISS_PACK = 'actions/dismiss_pack';

export const CLEAR_ENTRY_ANIMATION = 'actions/clear_entry_animation';
export const MARK_ENERGY_ANIMATION_AS_DONE = 'actions/mark_energy_animation_as_done';
export const MINUS_ENERGY_ON_CREATURE = 'actions/minus_energy_on_creature';
export const PLUS_ENERGY_ON_CREATURE = 'actions/plus_energy_on_creature';

export const showPowerName = (id: string, powerName: string) => ({
  type: SHOW_POWER_NAME as typeof SHOW_POWER_NAME,
  id,
  powerName,
});
export const hidePowerName = (id: string, powerName: string) => ({
  type: HIDE_POWER_NAME as typeof HIDE_POWER_NAME,
  id,
  powerName,
});
export const startPowerAnimation = (source: string, power: any, player: number) => ({
  type: START_POWER_ANIMATION as typeof START_POWER_ANIMATION,
  source,
  power,
  player,
});
export const endPowerAnimation = (source: string) => ({
  type: END_POWER_ANIMATION as typeof END_POWER_ANIMATION,
  source,
  endAnimation: true,
});
export const startAttackAnimation = (
  source: string,
  target: string,
  additionalAttacker: string,
  player: number,
) => ({
  type: START_ATTACK_ANIMATION as typeof START_ATTACK_ANIMATION,
  source,
  target,
  additionalAttacker,
  player,
});
export const endAttackAnimation = (source: string) => ({
  type: END_ATTACK_ANIMATION as typeof END_ATTACK_ANIMATION,
  source,
  endAnimation: true,
});
export const startRelicAnimation = (card: string, player: number) => ({
  type: START_RELIC_ANIMATION as typeof START_RELIC_ANIMATION,
  card,
  player,
  endAnimation: true,
});
export const endRelicAnimation = () => ({
  type: END_RELIC_ANIMATION as typeof END_RELIC_ANIMATION,
  endAnimation: true,
});
export const startSpellAnimation = (card: string, player: number) => ({
  type: START_SPELL_ANIMATION as typeof START_SPELL_ANIMATION,
  card,
  player,
  endAnimation: true,
});
export const endSpellAnimation = () => ({
  type: END_SPELL_ANIMATION as typeof END_SPELL_ANIMATION,
  endAnimation: true,
});
export const startCreatureAnimation = (card: string, player: number) => ({
  type: START_CREATURE_ANIMATION as typeof START_CREATURE_ANIMATION,
  card,
  player,
  endAnimation: true,
});
export const endCreatureAnimation = () => ({
  type: END_CREATURE_ANIMATION as typeof END_CREATURE_ANIMATION,
  endAnimation: true,
});
export const startPromptResolutionAnimation = (target: string | number) => ({
  type: START_PROMPT_RESOLUTION_ANIMATION as typeof START_PROMPT_RESOLUTION_ANIMATION,
  target,
});
export const endPromptResolutionAnimation = () => ({
  type: END_PROMPT_RESOLUTION_ANIMATION as typeof END_PROMPT_RESOLUTION_ANIMATION,
});
export const endStepAnimation = () => ({
  type: END_STEP_ANIMATION as typeof END_STEP_ANIMATION,
});
export const endAnimation = () => ({
  type: END_ANIMATION as typeof END_ANIMATION,
  endAnimation: true,
});
export const plusEnergyOnCreature = (cardId: string) => ({
  type: PLUS_ENERGY_ON_CREATURE as typeof PLUS_ENERGY_ON_CREATURE,
  cardId,
});
export const minusEnergyOnCreature = (cardId: string) => ({
  type: MINUS_ENERGY_ON_CREATURE as typeof MINUS_ENERGY_ON_CREATURE,
  cardId,
});

export const addToPack = (leader: string, hunter: string) => ({
  type: ADD_TO_PACK as typeof ADD_TO_PACK,
  leader,
  hunter,
});
export const dismissPack = (leader: string) => ({
  type: DISMISS_PACK as typeof DISMISS_PACK,
  leader,
});
export const clearEntryAnimation = (id: string) => ({
  type: CLEAR_ENTRY_ANIMATION as typeof CLEAR_ENTRY_ANIMATION,
  id,
})
export const startMagiDefeatAnimation = (id: string) => ({
  type: START_MAGI_DEFEAT_ANIMATION as typeof START_MAGI_DEFEAT_ANIMATION,
  id,
})
export const startCreatureDiscardAnimation = (id: string) => ({
  type: START_CREATURE_DISCARD_ANIMATION as typeof START_CREATURE_DISCARD_ANIMATION,
  id,
})
export const markEnergyAnimationDone = (id: number) => ({
  type: MARK_ENERGY_ANIMATION_AS_DONE as typeof MARK_ENERGY_ANIMATION_AS_DONE,
  id,
})

export type StartPowerAnimationAction = ReturnType<typeof startPowerAnimation>
export type EndPowerAnimationAction = ReturnType<typeof endPowerAnimation>
export type StartAttackAnimationAction = ReturnType<typeof startAttackAnimation>
export type EndAttackAnimationAction = ReturnType<typeof endAttackAnimation>
export type StartRelicAnimationAction = ReturnType<typeof startRelicAnimation>
export type EndRelicAnimationAction = ReturnType<typeof endRelicAnimation>
export type StartSpellAnimationAction = ReturnType<typeof startSpellAnimation>
export type EndSpellAnimationAction = ReturnType<typeof endSpellAnimation>
export type StartPromptResolutionAnimationAction = ReturnType<typeof startPromptResolutionAnimation>
export type EndPromptResolutionAnimationAction = ReturnType<typeof endPromptResolutionAnimation>
export type StartCreatureAnimationAction = ReturnType<typeof startCreatureAnimation>
export type StartMagiDefeatAnimationAction = ReturnType<typeof startMagiDefeatAnimation>
export type StartCreatureDiscardAnimationAction = ReturnType<typeof startCreatureDiscardAnimation>
export type EndCreatureAnimationAction = ReturnType<typeof endCreatureAnimation>
export type EndStepAnimationAction = ReturnType<typeof endStepAnimation>
export type EndAnimationAction = ReturnType<typeof endAnimation>
export type AddToPackAction = ReturnType<typeof addToPack>
export type DismissPackAction = ReturnType<typeof dismissPack>
export type ClearEntryAnimationAction = ReturnType<typeof clearEntryAnimation>
export type PlusEnergyOnCreatureAction = ReturnType<typeof plusEnergyOnCreature>
export type MinusEnergyOnCreatureAction = ReturnType<typeof minusEnergyOnCreature>
export type MarkEnergyAnimationAction = ReturnType<typeof markEnergyAnimationDone>
