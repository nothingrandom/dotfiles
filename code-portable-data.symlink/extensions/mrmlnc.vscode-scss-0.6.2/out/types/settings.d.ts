export interface ISettings {
    scannerDepth: number;
    scannerExclude: string[];
    scanImportedFiles: boolean;
    scanImportedFilesDepth: number;
    implicitlyLabel: string;
    showErrors: boolean;
    suggestVariables: boolean;
    suggestMixins: boolean;
    suggestFunctions: boolean;
    suggestFunctionsInStringContextAfterSymbols: string;
}
