import { ClassifiedEvent } from './event.dto';
export declare class EventClassifierService {
    classify(eventType: string, payload: any): ClassifiedEvent | null;
    private classifyPush;
    private classifyPullRequest;
    private classifyRelease;
}
