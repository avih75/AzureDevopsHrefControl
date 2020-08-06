import * as WitService from "TFS/WorkItemTracking/Services"; 

export function CreateView(hrefLink: string, FieldRefName: string, isView: boolean) {
    let image = $("#image");
    let hrefDiv = $("#hrefLink"); 

    // create the text box
    let textBox = $("#input");
    textBox.val(hrefLink);
    textBox.focusout(() => OnFieldLeavFocus(textBox.val(), FieldRefName));    
    let href = $("#href");
    if (hrefLink == undefined || hrefLink == "") {
        href.hide();
        textBox.show();
        image.hide();
    }
    else {
        href.attr("href", hrefLink);  // make it linked
        href.text(hrefLink.substring(0,50)+" ...");
        textBox.hide();        
        image.attr("src", hrefLink);  // creat small picture
        image.show();
    } 
    let removeButton = $("#removeButton");
    removeButton.text("X"); 
    removeButton.click(() => {        
        textBox.val("");
        textBox.show();
        href.text("");
        href.hide();
        OnFieldLeavFocus("", FieldRefName); 
        image.attr("src", "");
        image.hide();
        VSS.resize(null, 40);
    }); 
    if (isView)
    {
        VSS.resize(null, 300);
    }
    else
    {
        hrefDiv.remove("#image");
        VSS.resize(null, 40);
    }
}

function OnFieldLeavFocus(hrefLink: string, FieldRefName: string) {
    let textBox = $("#input");
    let href = $("#href");
    let image = $("#image");
    if (hrefLink == "") {
        href.hide();
        textBox.show();
        image.hide();
        image.attr("src","");
        VSS.resize(null, 40);
    }
    else {
        href.attr("href", hrefLink);
        textBox.hide(); 
        href.text(hrefLink.substring(0,50)+" ...");
        href.show();
        image.attr("src", hrefLink);
        image.show();
        VSS.resize(null, 300);
    }
    WitService.WorkItemFormService.getService().then(
        (service) => {
            service.setFieldValue(FieldRefName, hrefLink);
        }
    );
}