/* global window */
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import {
    ACTION_RESOLVE_PROMPT,
    ACTION_POWER,
    PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
    PROMPT_TYPE_PAYMENT_SOURCE,
    TYPE_CREATURE,
} from 'moonlands/dist/esm/const';
import { byName } from 'moonlands/dist/esm/cards';
import Card from '../Card.tsx';
import { isPRSAvailable, getIsOnMagiPrompt, getAnimation, getPromptGeneratedBy, getPlayerNumber, isAttackingWithOpponent } from '../../selectors';
import { withAbilities } from '../CardAbilities.tsx';
import { useZoneContent, useCardData, isPromptPaymentSource } from '../common';
import { ANIMATION_MAGI_DEFEATED } from '../../const';

const CardWithAbilities = withAbilities(Card);

const playerHasCreatures = state => state.zones.inPlay.some(card => byName(card.card).type === TYPE_CREATURE && card.data.controller === state.playerNumber);

const isOnFilteredMagiPrompt = (state) => {
    if (!state.prompt || state.promptPlayer !== state.playerNumber) return false;
    const isOnMWCPrompt = state.promptType === PROMPT_TYPE_MAGI_WITHOUT_CREATURES;
    if (isOnMWCPrompt) return !playerHasCreatures(state);
    const isOnPaymentPrompt = state.promptType === PROMPT_TYPE_PAYMENT_SOURCE;
    if (isOnPaymentPrompt) return state.zones.playerActiveMagi.some(card => isPromptPaymentSource(state.promptParams, card.id));
    return false;
};

function ZonePlayerActiveMagi({ name, zoneId, engineConnector }) {
    const rawContent = useZoneContent(zoneId);
    const content = useCardData(rawContent);
    const active = useSelector(isPRSAvailable);
    const isOnMagiPrompt = useSelector(getIsOnMagiPrompt);
    const isOnFilteredPrompt = useSelector(isOnFilteredMagiPrompt);
    const promptGeneratedBy = useSelector(getPromptGeneratedBy);
    const playerNumber = useSelector(getPlayerNumber);
    const attackTarget = useSelector(isAttackingWithOpponent);
    const guarded = useSelector(playerHasCreatures);

    const animation = useSelector(getAnimation);
    const defeatedId = animation && animation.type === ANIMATION_MAGI_DEFEATED ? animation.target : null;
    const cardClickHandler = (isOnMagiPrompt || isOnFilteredPrompt) ? cardId => {
        engineConnector.emit({
            type: ACTION_RESOLVE_PROMPT,
            target: cardId,
            generatedBy: promptGeneratedBy,
        });
    } : () => { };

    const abilityUseHandler = useCallback((id, powerName) => engineConnector.emit({
        type: ACTION_POWER,
        source: id,
        power: powerName,
    }), [engineConnector]);

    return (
        <div className={cn('zone', 'zone-magi', { 'zone-active': active || attackTarget })} data-zone-name={name}>
            {content.length ? content.map(cardData =>
                <CardWithAbilities
                    key={cardData.id}
                    id={cardData.id}
                    card={cardData.card}
                    modifiedData={cardData.modifiedData}
                    data={cardData.data}
                    isDefeated={cardData.id === defeatedId}
                    onClick={cardClickHandler}
                    isOnPrompt={isOnMagiPrompt || isOnFilteredPrompt}
                    target={attackTarget || (active && cardData.card.data.powers && cardData.card.data.powers.length > cardData.data.actionsUsed.length)}
                    droppable={attackTarget}
                    guarded={guarded}
                    engineConnector={engineConnector}
                    onAbilityUse={abilityUseHandler}
                    playerNumber={playerNumber}
                    actionsAvailable={active}
                    className={cn({ 'attackTarget': animation && animation.type == 'attack' && animation.target === cardData.id })}
                />,
            ) : null}
        </div>
    );
}

export default ZonePlayerActiveMagi;
