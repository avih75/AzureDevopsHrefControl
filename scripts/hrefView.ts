import { WorkItemFormService } from "TFS/WorkItemTracking/Services";

let view :boolean=false;
let fieldRefName:string="";

export function CreateView(hrefLink: string, FieldRefName: string) { 
    fieldRefName=FieldRefName;
    let image = $("#image");
    let check = $("#check");      // button switch show state
    check.text("Show");
    let href = $("#href");        // button open new tab with image link
    let textBox = $("#input");    // text box for the link
    let removeButton = $("#removeButton");
    removeButton.text("X");
    removeButton.click(() => {
        textBox.val("");
        textBox.show();
        textBox.focus();
        href.attr("href", "");
        href.text("");
        href.hide();
        check.hide();
        view=false;
        href.hide();
        check.hide();
        textBox.show();
        image.hide();
        image.attr("src", "");
        VSS.resize(null, null);
        WorkItemFormService.getService().then(
            (service) => {
                service.setFieldValue(fieldRefName, hrefLink);
            }
        );
    });
    check.click(() => {
        view = !view
        AddImageIfexists(hrefLink);
    })
    textBox.val(hrefLink);
    textBox.focusout(() => OnFieldLeavFocus());
    OnFieldLeavFocus( ); 
}
function OnFieldLeavFocus() {    
    let textBox = $("#input");
    let hrefLink = textBox.val();
    let check = $("#check");
    let href = $("#href");
    let image = $("#image");
    image.attr("src", hrefLink);
    if (hrefLink == "") {
        href.hide();
        check.hide();
        textBox.show();
        image.hide();
        image.attr("src", "");
        VSS.resize(null, null);
    }
    else {
        textBox.hide();
        href.attr("href", hrefLink);
        href.text(hrefLink);
        href.show();
        check.show(); 
        AddImageIfexists(hrefLink);
    }
    WorkItemFormService.getService().then(
        (service) => {
            service.setFieldValue(fieldRefName, hrefLink);
        }
    );
}
function AddImageIfexists(hrefLink: string) {
    let image = $("#image");
    let check = $("#check");    
    if (view) {
        check.text("Hide"); 
        image.show(); 
    }
    else {
        check.text("Show");
        image.hide(); 
    }
    VSS.resize(null, null);
}