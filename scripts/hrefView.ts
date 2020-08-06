import * as WitService from "TFS/WorkItemTracking/Services";

export function CreateView(hrefLink: string, FieldRefName: string, isView: boolean) {
    let image = $("#image"); 
    let href = $("#href");
    let textBox = $("#input");
    let removeButton = $("#removeButton");
    removeButton.text("X");
    removeButton.click(() => {
        textBox.val("");
        textBox.show();
        href.text("");
        href.hide();
        OnFieldLeavFocus("", FieldRefName, isView);
        VSS.resize(null, 40);
        image.attr("src", "");
        image.hide();
    });
 
    textBox.val(hrefLink);
    textBox.focusout(() => OnFieldLeavFocus(textBox.val(), FieldRefName, isView));
    if (hrefLink == undefined || hrefLink == "") {
        href.hide();
        textBox.show();
        image.hide();
    }
    else {
        href.attr("href", hrefLink);  
        href.text(hrefLink.substring(0, 50) + " ...");
        textBox.hide();
        AddImageIfexists(hrefLink, image, isView) 
    } 
}

function OnFieldLeavFocus(hrefLink: string, FieldRefName: string, isView: boolean) {
    let textBox = $("#input");
    let href = $("#href");
    let image = $("#image");
    if (hrefLink == "") {
        href.hide();
        textBox.show();
        image.hide();
        image.attr("src", "");
        VSS.resize(null, 40);
    }
    else {
        href.attr("href", hrefLink);
        textBox.hide();
        href.text(hrefLink.substring(0, 50) + " ...");
        href.show();
        AddImageIfexists(hrefLink, image, isView); 
    }
    WitService.WorkItemFormService.getService().then(
        (service) => {
            service.setFieldValue(FieldRefName, hrefLink);
        }
    );
}
function AddImageIfexists(hrefLink: string, image: JQuery, isView: boolean) {
    if (isView) {
        image.attr("src", hrefLink);
        image.show();
        $.get(hrefLink)
            .done(function () {
                VSS.resize(null, 290); 
            }).fail(function () { 
                VSS.resize(null, 60);
            })
    }
    else {
        VSS.resize(null, 40);
    }
}