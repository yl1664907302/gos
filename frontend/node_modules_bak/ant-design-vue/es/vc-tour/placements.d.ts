import type { BuildInPlacements } from '../vc-trigger/interface';
export type PlacementType = 'left' | 'leftTop' | 'leftBottom' | 'right' | 'rightTop' | 'rightBottom' | 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight' | 'center';
export declare function getPlacements(arrowPointAtCenter?: boolean): BuildInPlacements;
export declare const placements: BuildInPlacements;
