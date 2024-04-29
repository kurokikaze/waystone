import { useSelector } from "react-redux";
import { byName } from "moonlands/dist/cards.js";
import cn from "classnames";
import {
  MESSAGE_TYPE_POWER,
  MESSAGE_TYPE_RELIC,
  MESSAGE_TYPE_SPELL,
} from "../const";
import { getPowerSource } from "../selectors";
import { camelCase } from "../utils";

function ActionCardView() {
  const message = useSelector((state) => state.message);

  const show =
    message &&
    (message.type === MESSAGE_TYPE_POWER ||
      message.type === MESSAGE_TYPE_RELIC ||
      message.type === MESSAGE_TYPE_SPELL);

  const relic = message && message.type === MESSAGE_TYPE_RELIC;
  const spell = message && message.type === MESSAGE_TYPE_SPELL;
  const relicCard = relic ? message.card.card : null;
  const spellCard = spell ? message.card.card : null;
  const source = useSelector(getPowerSource(message?.source || ""));
  let power = null;
  let sourceCard = null;
  if (source) {
    sourceCard = byName(source.card);
    if (sourceCard) {
      power = sourceCard.data.powers.find(({ name }) => name === message.power);
    }
  }

  return (
    <div>
      {show && (
        <div
          className={cn("action-card-view", {
            "power-view": power,
            "relic-view": relic,
            "spell-view": spell,
          })}
        >
          {power && (
            <div className="power-view">
              <h3>{power.name}</h3>
              <p>{power.text}</p>
            </div>
          )}
          {relic && (
            <div className="cardViewHolder relic">
              <div className="cardView">
                <img src={`/cards/${camelCase(relicCard)}.jpg`} />
              </div>
            </div>
          )}
          {spell && (
            <div className="cardViewHolder spell">
              <div className="cardView">
                <img src={`/cards/${camelCase(spellCard)}.jpg`} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ActionCardView;
