import { Controller } from "./hrefControl";
import { IWorkItemLoadedArgs, IWorkItemFieldChangedArgs } from "TFS/WorkItemTracking/ExtensionContracts";

var control: Controller;
var provider = () => {
    return {
        onLoaded: (workItemLoadedArgs: IWorkItemLoadedArgs) => {
            control = new Controller(workItemLoadedArgs);
            // VSS.resize(null,40);
        }
    };
};
VSS.register(VSS.getContribution().id, provider);