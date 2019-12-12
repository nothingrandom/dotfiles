export interface ISettings {
    scannerDepth: number;
    scannerExclude: string[];
    scanImportedFiles: boolean;
    implicitlyLabel: string;
    showErrors: boolean;
    suggestVariables: boolean;
    suggestMixins: boolean;
    suggestFunctions: boolean;
    suggestFunctionsInStringContextAfterSymbols: string;
}
