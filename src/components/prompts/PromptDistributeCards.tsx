/* global window */
import { RefObject, createRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
	ACTION_RESOLVE_PROMPT,
	PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES,
	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_DEFEATED_MAGI,
	ZONE_TYPE_DISCARD,
	ZONE_TYPE_HAND,
	ZONE_TYPE_IN_PLAY,
	ZONE_TYPE_MAGI_PILE,
} from 'moonlands/src/const';
import { DndProvider } from 'react-dnd';
// @ts-ignore
import PromptCardImage from './PromptCardImage.jsx';
import PromptCardTarget from './PromptCardTarget';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {
	getPlayerNumber,
	getPromptCards,
	getPromptGeneratedBy,
	getPromptTargetZones,
} from '../../selectors/index';
import { EngineConnector } from '../../types.js';
import { ZoneType } from 'moonlands/dist/types/common.js';
import { ZONE_TYPE_DECK } from 'moonlands';

const ZoneNames: Record<ZoneType, string> = {
	[ZONE_TYPE_DECK]: 'Deck',
	[ZONE_TYPE_ACTIVE_MAGI]: 'Active Magi',
	[ZONE_TYPE_DEFEATED_MAGI]: 'Defeated Magi',
	[ZONE_TYPE_DISCARD]: 'Discard',
	[ZONE_TYPE_HAND]: 'Hand',
	[ZONE_TYPE_IN_PLAY]: 'In play',
	[ZONE_TYPE_MAGI_PILE]: 'Magi pile',
}
type PromptDistributeCardsProps = {
	engineConnector: EngineConnector
}

type CardsInZones = Partial<Record<ZoneType, number[]>>
type RefCollection = Partial<Record<ZoneType, RefObject<HTMLDivElement>>>

function PromptDistributeCards({ engineConnector }: PromptDistributeCardsProps) {
	const cards = useSelector(getPromptCards) || [];
	const targetZones = useSelector(getPromptTargetZones) || [];
	const generatedBy = useSelector(getPromptGeneratedBy) || '';
	const playerNumber = useSelector(getPlayerNumber);
	const cardIndices = cards.map((_, i) => i)
	const initialValue: CardsInZones = Object.fromEntries(targetZones.map((index: ZoneType) => [index as ZoneType, []]))
	initialValue[targetZones[0] as ZoneType]!.push(...cardIndices)

	const [order, setOrder] = useState<CardsInZones>(initialValue);

	const moveCard = (zoneId: ZoneType) => (from: number, to: number) => {
		//if (from < order[zoneId]!.length && to < order[zoneId]!.length) {
		const initialFrom = from;// order[zoneId]![from];
		const initialTo = to;// order[zoneId]![to];

		setOrder({
			...order,
			[zoneId]: order[zoneId as ZoneType]!.map((a, i) => {
				if (i === from) return initialTo;
				if (i === to) return initialFrom;
				return a;
			})
		});
		console.log(`Moving the card from ${from} to ${to} in ${zoneId}`);
		//}
	};

	const moveToZone = (zoneId: ZoneType, item: { index: number, zoneId: ZoneType }) => {
		if (order[item.zoneId]!.includes(item.index)) {
			console.log(`Moving the card ${item.index} from ${item.zoneId} to ${zoneId}`);
			const sourceItem = item.index; // order[item.zoneId]![item.index]

			const orderWithoutItem = {
				...order,
				[item.zoneId]: order[item.zoneId]?.filter(item => item !== sourceItem)
			}

			setOrder({
				...orderWithoutItem,
				[zoneId]: [...orderWithoutItem[zoneId]!, sourceItem],
			})
		}
	}

	const handleSend = () => {
		const result = Object.fromEntries(Object.entries(order).map(([zoneId, ids]) => [zoneId, ids.map(id => cards[id]!.id)]))
		engineConnector.emit({
			type: ACTION_RESOLVE_PROMPT,
			// promptType: PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES,
			cards: result,
			generatedBy,
			player: playerNumber,
		});
	};

	return (
		<div className="promptWindow promptDistributeCards">
			<h1>Rearrange the cards</h1>
			<div className="cardReceiverZones">
				<DndProvider backend={HTML5Backend}>
					{Object.entries(order).map(([zoneId, zoneCards]) =>
						<div key={zoneId}>
							<h3>{ZoneNames[zoneId as ZoneType]}</h3>
							<div className="cardsRow" style={{ display: 'flex', flexDirection: 'row' }}>
								{zoneCards.map((position, i) => (
									<PromptCardImage card={cards[position].card} onMove={moveCard(zoneId as ZoneType)} key={cards[position].id} id={cards[position].id} index={position} zoneId={zoneId} />
								))}
								<PromptCardTarget zoneId={zoneId as ZoneType} onEnter={moveToZone} />
							</div>
						</div>
					)}
				</DndProvider>
			</div>
			<div className="buttonHolder">
				<button onClick={handleSend}>OK</button>
			</div>
		</div>
	);
}

export default PromptDistributeCards;