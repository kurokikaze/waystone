/* global window */
import { useState } from 'react';
import { useSelector } from 'react-redux';

import {
    ACTION_RESOLVE_PROMPT,
    PROMPT_TYPE_NUMBER
} from 'moonlands/src/const.ts';
import { getPromptMin, getPromptMax, getPromptGeneratedBy, getPlayerNumber } from '../../selectors';

const makeArray = (min, max) => Array.apply(null, { length: max + 1 }).map(Number.call, Number).slice(min);

function PromptChooseCards({ engineConnector }) {
    const min = useSelector(getPromptMin);
    const max = useSelector(getPromptMax);
    const generatedBy = useSelector(getPromptGeneratedBy);
    const [value, setValue] = useState(min);
    const options = makeArray(min, max);
    const playerNumber = useSelector(getPlayerNumber)

    const onSend = () => {
        engineConnector.emit({
            type: ACTION_RESOLVE_PROMPT,
            promptType: PROMPT_TYPE_NUMBER,
            number: value,
            generatedBy: generatedBy,
            player: playerNumber,
        });
    };

    return (
        <div className="promptWindow promptChooseCards">
            <h1>Choose number from {min} to {max}</h1>
            <div className="cardsRow">
                <select onChange={event => setValue(event.target.value)}>
                    {options.map(value => <option key={`value_${value}`} value={value}>{value}</option>)}
                </select>
            </div>
            <div className="buttonHolder">
                <button onClick={() => onSend()}>OK</button>
            </div>
        </div>
    );
}

export default PromptChooseCards;