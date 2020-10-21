/// <reference types="vss-web-extension-sdk" />

export async function StoreToken(providerName: string, token: any) {
    var deferred = $.Deferred();
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result = await dataService.setValue(providerName, token);
    deferred.resolve();
    return deferred;
}
export async function RetriveToken(providerName: string) {
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result: Array<Function> = await dataService.getValue(providerName);
    return result ? result : "";
} 