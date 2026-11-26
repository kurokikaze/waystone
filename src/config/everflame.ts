import { serverUrl } from './everflame.json';

export function getEverflameUrl(path: string): string {
    return `${serverUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}
