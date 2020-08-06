import * as WitService from "TFS/WorkItemTracking/Services";
import { ErrorView } from "./errorView";
import * as Q from "q";
import { IWorkItemLoadedArgs } from "TFS/WorkItemTracking/ExtensionContracts";
import { CreateView } from "./hrefView";
export class Controller {    
    constructor(workItemLoadedArgs: IWorkItemLoadedArgs) {
        this.Initialize();
    }
    private Initialize(): void {
        let inputs = VSS.getConfiguration().witInputs;
        let listControl = inputs["hrefListValue"]; 

        WitService.WorkItemFormService.getService().then(
            (service) => {
                Q.spread(
                    [
                        service.getFieldValue(listControl)
                    ],
                    (link: string) => {
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