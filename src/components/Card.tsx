/* global window, document */
import {useLayoutEffect, useRef} from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {gsap} from 'gsap';
import cn from 'classnames';
import {
	TYPE_CREATURE,
	TYPE_RELIC,
	TYPE_SPELL,
	TYPE_MAGI,

	ACTION_ATTACK,
	
	REGION_ARDERIAL,
	REGION_CALD,
	REGION_NAROOM,
	REGION_UNDERNEATH,
	REGION_OROTHE,
	REGION_BOGRATH,
	REGION_UNIVERSAL,
} from 'moonlands/dist/const.js';
import {canFirstAttackSecond, canPackHuntWith} from './helpers.js';
import {camelCase} from '../utils';
import { DraggedItem, EnergyLossRecord, EngineConnector, State } from '../types.js';
import { CardData, CardType, Region } from 'moonlands/dist/types/index.js';
import MoonlandsCard from 'moonlands/dist/classes/Card';
import { InGameData } from 'moonlands/dist/classes/CardInGame';
import { useSelector, useDispatch } from 'react-redux';
import { clearEntryAnimation } from '../actions/index.js';

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

const regionClass: Record<Region, string> = {
	[REGION_ARDERIAL]: 'region-arderial',
	[REGION_CALD]: 'region-cald',
	[REGION_NAROOM]: 'region-naroom',
	[REGION_OROTHE]: 'region-orothe',
	[REGION_UNDERNEATH]: 'region-underneath',
	[REGION_BOGRATH]: 'region-bograth',
	[REGION_UNIVERSAL]: 'region-universal',
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
	attackNumber: number,
	isDefeated?: boolean,
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
	isDefeated,
	className,
	attacker,
	attackNumber,
	target,
	onPackHunt,
	engineConnector,
	useLocket = false,
}: CardProps) {
	useLayoutEffect(() => {
		const attacker = document.querySelector('.attackSource');
		const target = document.querySelector('.attackTarget');
		if (attacker && target) {
			const targetBox = target.getBoundingClientRect();
			const attackerBox = attacker.getBoundingClientRect();
			const offsetX = targetBox.left - attackerBox.left;
			const offsetY = targetBox.top - attackerBox.top;

			const tl = gsap.timeline({});
			tl.to(attacker, {x: offsetX, y: offsetY, duration: 0.3});
			tl.to(attacker, {x: 0, y: 0, duration: 0.4});

			tl.play();
			const additionalAttacker = document.querySelector('.additionalAttacker');
			if (additionalAttacker) {
				const addAttackerBox = additionalAttacker.getBoundingClientRect();
				const addOffsetX = targetBox.left - addAttackerBox.left;
				const addOffsetY = targetBox.top - addAttackerBox.top;
				const tl2 = gsap.timeline({});
				tl2.to(additionalAttacker, {x: addOffsetX, y: addOffsetY, duration: 0.3});
				tl2.to(additionalAttacker, {x: 0, y: 0, duration: 0.4});
	
				tl2.play();
				return () => {tl.clear();tl2.clear();};
			}
			return () => tl.clear();
		}
	}, [attacker, attackNumber]);

	const energyChange = useSelector((state: State) => state.energyLosses.filter(loss => loss.card === id));
	const energyEffectsShown = useSelector((state: State) => state.energyAnimationsShown);

	const damage: EnergyLossRecord[] = []
	const energyGain: EnergyLossRecord[] = []
	energyChange.forEach(energyChangeRecord => {
		if (energyChangeRecord.value < 0) {
			damage.push(energyChangeRecord);
		} else if (energyChangeRecord.value > 0) {
			energyGain.push(energyChangeRecord);
		}
	})

	const ref = useRef(null);
	const dispatch = useDispatch();

	const prevPos: [number, number] | undefined = useSelector((state: State) => state.lastPositions[id]);
	useLayoutEffect(() => {
		// Appearance
		if (ref.current && prevPos instanceof Array) {
			dispatch(clearEntryAnimation(id));
			const tl = gsap.timeline({});
			const myBox = (ref.current as HTMLElement)?.getBoundingClientRect();
			tl.from(ref.current, {x: prevPos[0] - myBox.left, y: prevPos[1] - myBox.top, duration: 0.2 });
			return () => {tl.clear()};
		}
	}, [id]);

	useLayoutEffect(() => {
		setTimeout(() => {
			if (ref.current) {
				(ref.current as HTMLElement).querySelectorAll('.energyDamage').forEach(node => {
					const id =	parseInt(node.getAttribute('data-effect-id') || '0', 10);
					if (!node.classList.contains('fadeAway') && !energyEffectsShown.has(id)) {
						node.classList.add('fadeAway');
						console.log(`Effect #${id} was shown and marked`);
						console.log(`Current values: ${[...energyEffectsShown.values()].join(', ')}`);
						energyEffectsShown.add(id);
					}
				});
				(ref.current as HTMLElement).querySelectorAll('.energyGain').forEach(node => {
					const id =	parseInt(node.getAttribute('data-effect-id') || '0', 10);
					if (!node.classList.contains('fadeAway') && !energyEffectsShown.has(id)) {
						node.classList.add('fadeAway');
						console.log(`Effect #${id} was shown and marked`);
						console.log(`Current values: ${[...energyEffectsShown.values()].join(', ')}`);
						energyEffectsShown.add(id);
					}
				});
			}
		}, 0)
	}, [energyChange]);

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
					player: 1,
				});
			} else if (canPackHunt) {
				onPackHunt(id, item.id);
			} else {
				console.log('Problem, captain');
			}
		}
	}), [card, data, id, guarded]);

	if (droppable) {
		drop(ref);
	}
	if (draggable) {
		drag(ref);
	}

	const regionStyle = (!useLocket && card && 'region' in card && card.region) ? regionClass[card.region as Region] : null;

	const classes = cn(
		'cardHolder',
		regionStyle,
		card ? typeClass[card.type as CardType] : null,
		{
			'magiDefeated': isDefeated,
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
			data-prev-x={prevPos ? prevPos[0] : null}
			data-prev-y={prevPos ? prevPos[1] : null}
			onClick={() => onClick && onClick(id)}
			ref={ref}
		>
			<div className="cutAround">
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
			{damage.filter(({id}) => !energyEffectsShown.has(id)).map(({id, value}) => <div key={id} data-effect-id={id} className='energyDamage'>{value}</div>)}
			{energyGain.filter(({id}) => !energyEffectsShown.has(id)).map(({id, value}) => <div key={id} data-effect-id={id} className='energyGain'>{value}</div>)}
		</div>
	);
}

export default Card;