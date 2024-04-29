/* globals window */
// @ts-ignore
import CreaturePowerIcon from "./CreaturePowerIcon.jsx";
// @ts-ignore
import MagiPowerIcon from "./MagiPowerIcon.jsx";
import Ability from "./icons/Ability.js";
import Attack from "./icons/Attack.js";
import Dagger from "./icons/Dagger.js";
import Shield from "./icons/Shield.js";
import Shovel from "./icons/Shovel.js";
import Energize from "./icons/Energize.js";
import Velociraptor from "./icons/Velociraptor.js";

import cn from "classnames";
import { COST_X, TYPE_MAGI, TYPE_RELIC } from "moonlands/dist/const";
import { AnyEffectType, CardData } from "moonlands/dist/types/index.js";
import Card from "moonlands/dist/classes/Card";
import { InGameData } from "moonlands/dist/classes/CardInGame";
import { MouseEventHandler } from "react";
import React from "react";

type CardAbilityProps = {
  name: string;
  cost: number;
  text: string;
  used: boolean;
  costTooHigh: boolean;
  onClick: Function;
};
export const CardAbility = ({
  name,
  cost,
  text,
  used,
  costTooHigh,
  onClick,
}: CardAbilityProps) => (
  <div className={cn("ability", { used: used, costTooHigh: costTooHigh })}>
    <span
      className="abilityName"
      onClick={onClick as MouseEventHandler<HTMLSpanElement>}
    >
      {name}
    </span>
    &nbsp;&mdash;&nbsp;<span className="abilityCost">{cost}</span>:{" "}
    <span>{text}</span>
  </div>
);

type OpponentCardAbilityProps = {
  name: string;
  cost: number;
  text: string;
};
export const OpponentCardAbility = ({
  name,
  cost,
  text,
}: OpponentCardAbilityProps) => (
  <div className="opponentAbility">
    <span className="abilityName">{name}</span>&nbsp;&mdash;&nbsp;
    <span className="abilityCost">{cost}</span>: <span>{text}</span>
  </div>
);

type WithAbilitiesProps = {
  key: string;
  id: string;
  card: Card;
  modifiedData: InGameData & CardData;
  data: InGameData;
  onClick: Function;

  isDefeated: boolean;
  isOnPrompt: boolean;
  actionsAvailable: boolean;
  droppable: boolean;
  isDragging: boolean;
  target: boolean;
  guarded: boolean;

  onAbilityUse: Function;
  engineConnector: { emit: Function };
};

type PowerType = {
  name: string;
  text: string;
  cost: number | typeof COST_X;
  effects: AnyEffectType[];
};
// eslint-disable-next-line react/display-name
export const withAbilities =
  (Component: typeof React.Component) => (props: WithAbilitiesProps) => {
    const isOpponent = props.data.controller !== 1;
    const hasAbilities = props.card.data && props.card.data.powers;
    const isRelic = props.card.type === TYPE_RELIC;
    const hasUnusedAbilities =
      hasAbilities &&
      (props.card.data.powers as PowerType[]).some(
        (power) => !(props.data.actionsUsed || []).includes(power.name),
      );

    const hasSeveralAttacks =
      props.modifiedData &&
      props?.modifiedData?.attacksPerTurn &&
      props?.modifiedData?.attacksPerTurn > 1;
    const canAttackDirectly =
      props.modifiedData && props.modifiedData.canAttackMagiDirectly;
    const stillHasAttacks =
      props.data.attacked <
      (props.modifiedData && props.modifiedData.attacksPerTurn
        ? props.modifiedData.attacksPerTurn
        : 0);

    const PowerIcon =
      props.card.type === TYPE_MAGI ? MagiPowerIcon : CreaturePowerIcon;
    const iconType = props.card.type === TYPE_MAGI ? "cardIcons" : "cardIcons";

    const showAbilities =
      hasAbilities && !props.isOnPrompt && !props.isDragging;

    const allEffects = [
      ...(props.card.data.effects || []),
      ...(props.card.data.triggerEffects || []),
      ...(props.card.data.staticAbilities || []),
      ...(props.card.data.replacementEffects || []),
    ];
    const energizeProperty = props.modifiedData
      ? props.modifiedData.energize
      : props.card.data.energize;
    const hasEffects = allEffects.length > 0;
    const canPackHunt = props.card.data.canPackHunt;
    const hasEnergize = energizeProperty > 0;
    const hasAdditionalIcons =
      hasSeveralAttacks || canAttackDirectly || canPackHunt || hasEnergize;

    const unableToAttack =
      props.data.ableToAttack === false ||
      (props.modifiedData && props.modifiedData.ableToAttack === false) ||
      props.data.attacked === Infinity;
    const cannotBeAttacked =
      props.modifiedData && props.modifiedData.canBeAttacked === false;
    const isBurrowed = props.data && props.data.burrowed === true;
    const showEffects = hasEffects && !props.isOnPrompt && !props.isDragging;

    const powers = props.modifiedData
      ? props.modifiedData.powers
      : props.card.data.powers;

    const AbilityComponent = isOpponent ? OpponentCardAbility : CardAbility;

    return (
      <>
        {(showAbilities || showEffects || hasAdditionalIcons) && (
          <div className="cardAbilityHolder cardViewHolder">
            {hasAbilities && (props.actionsAvailable || isOpponent) && (
              <div className="cardAbilities">
                {powers.map(({ name, text, cost }: PowerType) => (
                  <AbilityComponent
                    key={name}
                    name={name}
                    text={text}
                    cost={cost !== COST_X ? cost : 0}
                    used={
                      (props.data.actionsUsed &&
                        props.data.actionsUsed.includes(name)) ||
                      (cost !== COST_X && props.data.energy < cost)
                    }
                    costTooHigh={
                      cost !== COST_X && props.data.energy < cost && !isRelic
                    }
                    onClick={() => props.onAbilityUse(props.id, name)}
                  />
                ))}
              </div>
            )}
            {hasEffects && (
              <div className="cardAbilities">
                {allEffects.map(({ name, text }, i) => (
                  <p key={name}>
                    <b>Effect &mdash; {name}</b>: {text}
                  </p>
                ))}
              </div>
            )}
            <div className="abilityIconHolder">
              <Component {...props} />
              <div className={iconType}>
                {hasEnergize && (
                  <PowerIcon
                    icon={<Energize />}
                    number={`+${energizeProperty}`}
                    active
                  />
                )}
                {showEffects && <PowerIcon icon={<Ability />} />}
                {hasSeveralAttacks && (
                  <PowerIcon
                    icon={<Attack />}
                    number={props.modifiedData.attacksPerTurn}
                  />
                )}
                {unableToAttack && (
                  <PowerIcon icon={<Attack />} number="&#10006;" />
                )}
                {canAttackDirectly && <PowerIcon icon={<Dagger />} />}
                {canPackHunt && (
                  <PowerIcon
                    icon={<Velociraptor />}
                    active={stillHasAttacks}
                    activeColor="rgb(131, 49, 131)"
                  />
                )}
                {cannotBeAttacked && <PowerIcon icon={<Shield />} />}
                {isBurrowed && <PowerIcon icon={<Shovel />} />}
                {showAbilities && (
                  <PowerIcon
                    active={hasUnusedAbilities && props.actionsAvailable}
                  />
                )}
              </div>
              <div className="cardName">
                <div className="innerName">{props.card.name}</div>
              </div>
            </div>
          </div>
        )}
        {!(showAbilities || showEffects || hasAdditionalIcons) && (
          <Component {...props} />
        )}
      </>
    );
  };
