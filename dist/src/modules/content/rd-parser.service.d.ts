export interface RdData {
    progress?: string;
    checkpoint?: string;
    nextStep?: string;
    userMessage?: string;
    userChanges?: string[];
}
export declare class RdParserService {
    private readonly logger;
    parse(rawContent: string): RdData;
}
