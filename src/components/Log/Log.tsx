/* global window */
import {useEffect, useRef} from 'react';
import cn from 'classnames';
import {useSelector} from 'react-redux';
import { LogEntryType } from 'moonlands/src/types';

import {mapEntryToText} from './utils';
import './style.css';
import { getPlayerNumber } from '../../selectors';

const SHOW_CLASS = 'show';

const getLogEntries = (state: AppState) => state.log;

type LogEntryProps = {
	entry: LogEntryType
	playerNumber: number
}
// @ts-ignore
const LogEntry = ({entry, playerNumber}: LogEntryProps) => <div className={cn('logEntry', {'ours': ('player' in entry && entry.player === playerNumber), 'theirs': ('player' in entry && entry.player !== playerNumber)})}>{mapEntryToText(entry)}</div>;

const Log = () => {
	const listRef = useRef<HTMLDivElement>(null);

	const entries = useSelector(getLogEntries);
	const playerNumber = useSelector(getPlayerNumber);

	useEffect(() => {
		const listElement = listRef.current;
		if (listElement && listElement.children.length) {
			listElement.children[listElement.children.length - 1].scrollIntoView(false);
		}
		setTimeout(() => {
			if (listElement) {
				[].forEach.call(listElement.children, (child: HTMLElement) => {
					if (!child.classList.contains(SHOW_CLASS)) { 
						child.classList.add(SHOW_CLASS);
					}
				});
			}
		}, 10);
	}, [entries]);

	return <div className='actionLog' ref={listRef}>{entries.map((entry, i) => <LogEntry key={i} entry={entry} playerNumber={playerNumber} />)}</div>;
};

type AppState = {
	log: LogEntryType[];
}

export default Log;