interface Options {
    debug?: boolean;
    message?: string;
    format?: string;
    onCopy?: (clipboardData: object) => void;
}
declare function copy(text: string, options?: Options): boolean;
export default copy;
