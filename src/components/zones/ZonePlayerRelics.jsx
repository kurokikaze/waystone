/* global window */
import { useSelector } from "react-redux";
import cn from "classnames";
import {
  ACTION_POWER,
  ACTION_RESOLVE_PROMPT,
  TYPE_RELIC,
} from "moonlands/dist/const";
import Card from "../Card.tsx";

import {
  isPRSAvailable,
  isPromptActive,
  getPromptGeneratedBy,
  getPromptType,
} from "../../selectors";
import { getCardDetails, UNFILTERED_RELIC_PROMPTS } from "../common";
import { CARD_STYLE_LOCKET } from "../../const.ts";
import { withAbilities } from "../CardAbilities.tsx";
import { withView } from "../CardView.jsx";

const CardWithAbilities = withAbilities(Card);
const CardWithView = withView(Card, true);

function ZonePlayerRelics({ name, zoneId, engineConnector }) {
  const rawContent = useSelector(getCardDetails);
  const content = rawContent.inPlay.filter(
    (card) =>
      card.card.type === TYPE_RELIC &&
      (zoneId === "playerRelics"
        ? card.data.controller === 1
        : card.data.controller !== 1),
  );
  const isOnPrompt = useSelector(isPromptActive);
  const promptType = useSelector(getPromptType);
  const isOnUnfilteredPrompt =
    isOnPrompt && UNFILTERED_RELIC_PROMPTS.includes(promptType);
  const promptGeneratedBy = useSelector(getPromptGeneratedBy);
  const prsAvailable = useSelector(isPRSAvailable);

  const cardClickHandler = isOnPrompt
    ? (cardId) => {
        engineConnector.emit({
          type: ACTION_RESOLVE_PROMPT,
          target: cardId,
          generatedBy: promptGeneratedBy,
        });
      }
    : () => {};

  const abilityUseHandler = (id, powerName) =>
    engineConnector.emit({
      type: ACTION_POWER,
      source: id,
      power: powerName,
    });

  return (
    <div className={cn("zone", "zone-relics", zoneId)} data-zone-name={name}>
      {content.length
        ? content.map((cardData) => {
            const SelectedCard =
              prsAvailable && cardData.card.data.powers
                ? CardWithAbilities
                : CardWithView;
            return (
              <SelectedCard
                key={cardData.id}
                id={cardData.id}
                card={cardData.card}
                data={cardData.data}
                onClick={cardClickHandler}
                isOnPrompt={isOnUnfilteredPrompt}
                actionsAvailable={prsAvailable}
                onAbilityUse={abilityUseHandler}
                cardStyle={CARD_STYLE_LOCKET}
              />
            );
          })
        : null}
    </div>
  );
}

export default ZonePlayerRelics;
