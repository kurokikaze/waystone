/* global window, document */
import {useEffect, useRef} from 'react';
import { useDrag, useDrop } from 'react-dnd';
import cn from 'classnames';
import {
	TYPE_CREATURE,
	TYPE_RELIC,
	TYPE_SPELL,
	TYPE_MAGI,
  ACTION_ATTACK,
} from 'moonlands/dist/const.js';
import {canFirstAttackSecond, canPackHuntWith} from './helpers.js';
import {camelCase} from '../utils';
import { DraggedItem, EngineConnector } from '../types.js';
import { CardData, CardType } from 'moonlands/dist/types/index.js';
import MoonlandsCard from 'moonlands/dist/classes/Card';
import { InGameData } from 'moonlands/dist/classes/CardInGame';

const DraggableTypes = {
	CARD: 'card',
};

// type ClassTypesType = Record<CardType, string>
const typeClass: Record<CardType, string> = {
	[TYPE_CREATURE]: 'creature',
	[TYPE_RELIC]: 'relic',
	[TYPE_SPELL]: 'spell',
	[TYPE_MAGI]: 'magi',
};

const getCardUrl = (card: {name: string}, useLocket: boolean): string => {
	if (!card) {
		return '/cards/cardBack.jpg';
	} else if (useLocket) {
		return `/masked/${camelCase(card.name)}.png`;
	} else {
		return `/cards/${camelCase(card.name)}.jpg`;
	}
};

type CardProps = {
	id: string;
	card: MoonlandsCard;
	data: InGameData;
	onClick: (id: string) => void;
	draggable: boolean;
  droppable: boolean;
	isDragging: boolean;
	available: boolean;
  guarded: boolean;
	useLocket: boolean;
	modifiedData: CardData;
	pack: string[];
	target: boolean;
	connectDragSource: () => void;
	connectDropTarget: () => void;
  onPackHunt: (leader: string, hunter: string) => void;
	isOnPrompt: boolean;
	className: string;
	attacker: boolean;
  engineConnector: EngineConnector;
}

function Card({
	id,
	card,
	data,
	onClick,
	draggable,
	droppable,
	guarded,
	available,
	modifiedData,
	pack,
	isOnPrompt,
	className,
	attacker,
	target,
	onPackHunt,
  engineConnector,
	useLocket = false,
}: CardProps) {
	useEffect(() => {
		const attacker = document.querySelector('.attackSource') as HTMLElement;
		const target = document.querySelector('.attackTarget') as HTMLElement;
		if (attacker && target) {
			const targetBox = target.getBoundingClientRect();
			const attackerBox = attacker.getBoundingClientRect();
			const offsetX = targetBox.left - attackerBox.left;
			const offsetY = targetBox.top - attackerBox.top;

			attacker.style.setProperty('--targetOffsetX', `${offsetX}px`);
			attacker.style.setProperty('--targetOffsetY', `${offsetY}px`);

			const newAttacker = attacker.cloneNode(true);
			const parentNode = attacker.parentNode;

			const additionalAttacker = document.querySelector('.additionalAttacker') as HTMLElement;
			let newAdditionalAttacker: HTMLElement | null = null;
			if (additionalAttacker) {
				const addAttackerBox = additionalAttacker.getBoundingClientRect();
				const offsetX = targetBox.left - addAttackerBox.left;
				const offsetY = targetBox.top - attackerBox.top;

				additionalAttacker.style.setProperty('--targetOffsetX', `${offsetX}px`);
				additionalAttacker.style.setProperty('--targetOffsetY', `${offsetY}px`);

				newAdditionalAttacker = additionalAttacker.cloneNode(true) as HTMLElement;
			}
			if (parentNode && (parentNode as HTMLElement).classList) {
				// if (parentNode.contains(attacker)) {
				// 	parentNode.replaceChild(newAttacker, attacker);
				// }
				// @ts-ignore
				parentNode.closest('.zone').classList.add('animated');
				setTimeout(() => {
					// @ts-ignore
					parentNode.closest('.zone').classList.remove('animated');
					// @ts-ignore
					newAttacker.classList.remove('attackSource');
					if (newAdditionalAttacker) {
						newAdditionalAttacker.classList.remove('additionalAttacker');
					}
				}, 600);
			}
		}
		
	}, [attacker]);

	const ref = useRef(null);
	const [{isDragging}, drag] = useDrag(() => ({
		// "type" is required. It is used by the "accept" specification of drop targets.
		type: DraggableTypes.CARD,
		// The collect function utilizes a "monitor" instance (see the Overview for what this is)
		// to pull important pieces of state from the DnD system.
		item: () => ({ card, data, id, pack }),
		collect: (monitor) => ({
			isDragging: monitor.isDragging()
		})
	}), [card, data, id, pack]);

	const [_, drop] = useDrop(() => ({
		// The type (or types) to accept - strings or symbols
		accept: DraggableTypes.CARD,
		// Props to collect
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop()
		}),
		drop: (item: DraggedItem) => {
			const dropTarget = { card, data, id, guarded };

			const canAttack = canFirstAttackSecond(item, dropTarget);

			const canPackHunt = canPackHuntWith(item, dropTarget);

			if (canAttack) {
				engineConnector.emit({
					type: ACTION_ATTACK,
					source: item.id,
					target: id,
					additionalAttackers: item.pack ? item.pack.hunters : [],
				});
			} else if (canPackHunt) {
				onPackHunt(id, item.id);
			} else {
				console.log('Problem, capn');
			}
		}
	}), [card, data, id, guarded]);

	if (droppable) {
		drop(ref);
	}
	if (draggable) {
		drag(ref);
	}

	const classes = cn(
		'cardHolder',
		card ? typeClass[card.type as CardType] : null,
		{
			'dragging': isDragging,
			'available': available,
			'target': target,
			'onPrompt': isOnPrompt,
			'canPackHunt': (card && modifiedData) ? (card.data.canPackHunt && data.attacked < (modifiedData.attacksPerTurn || 0) && !pack) : null,
		},
		className
	);

	return (
		<div
			className={classes}
			data-id={id}
			onClick={() => onClick && onClick(id)}
			ref={ref}
		>
			<img src={getCardUrl(card, useLocket)} alt={card ? card.name : ''} />
			{data && <>
				{(card && data.energy && data.energy !== card.cost) ? <div className="startingEnergy">
					{card.cost}
				</div> : null}
				<div className="cardEnergy">
					{data.energy || ''}
				</div>
			</>}
		</div>
	);
}

export default Card;