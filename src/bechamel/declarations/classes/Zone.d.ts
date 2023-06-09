import CardInGame, { ConvertedCard, HiddenConvertedCard } from "./CardInGame";
import { ZoneType } from "../types";
declare module 'moonlands/dist/classes/Zone' {
  export default class Zone {
    _name: string;
    _player: number | null;
    _type: ZoneType;
    ordered: boolean;
    cards: CardInGame[];
    constructor(name: string, type: ZoneType, player?: any, ordered?: boolean);
    get card(): CardInGame;
    get name(): string;
    get player(): number;
    get type(): ZoneType;
    get length(): number;
    add(cards: CardInGame[]): this;
    addToTop(cards: CardInGame[]): this;
    byId(id: string): CardInGame;
    containsId(id: string): boolean;
    removeById(id: string): void;
    shuffle(): void;
    empty(): void;
    serialize(hidden: true): HiddenConvertedCard[];
    serialize(hidden: false): ConvertedCard[];
    serialize(): ConvertedCard[];
  }
}
