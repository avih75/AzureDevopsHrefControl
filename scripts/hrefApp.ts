import { Controller } from "./hrefControl"; 

let provider = () => {
    return {
        onLoaded: () => {
            new Controller(); 
        }
    };
};
VSS.register(VSS.getContribution().id, provider);