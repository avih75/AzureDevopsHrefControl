import { ErrorView } from "./errorView";
import { CreateView } from "./hrefView";
import { spread } from "q";
import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
export class Controller {
    constructor() {
        let inputs = VSS.getConfiguration().witInputs;
        let linkValue = inputs["linkValue"];
        let requireCall = inputs["requireCall"];
        let blobUrl = inputs["blobUrl"];
        let userPassword = inputs["userPassword"];
        WorkItemFormService.getService().then(
            (service) => {
                spread([service.getFieldValue(linkValue)], (link: string) => {
                    CreateView(link, linkValue, requireCall, blobUrl, userPassword);
                }, this._handleError
                ).then(null, this._handleError);
            },
            this._handleError
        );
    }
    private _handleError(error: string): void {
        new ErrorView(error);
    }
}