import { ErrorView } from "./errorView"; 
import { CreateView } from "./hrefView";
import { spread } from "q";
import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
export class Controller {    
    constructor() {        
        let inputs = VSS.getConfiguration().witInputs;
        let listControl = inputs["hrefListValue"]; 
        WorkItemFormService.getService().then(
            (service) => {
                spread([service.getFieldValue(listControl)],(link: string) => {
                        CreateView(link,listControl);
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