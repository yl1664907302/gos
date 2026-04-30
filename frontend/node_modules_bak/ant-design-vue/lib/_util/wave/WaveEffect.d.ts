export interface WaveEffectProps {
    className: string;
    target: HTMLElement;
}
declare function showWaveEffect(node: HTMLElement, className: string): () => void;
export default showWaveEffect;
