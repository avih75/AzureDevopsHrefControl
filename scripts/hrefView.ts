import * as WitService from "TFS/WorkItemTracking/Services"; 

export function CreateView(hrefLink: string, FieldRefName: string, isView: boolean) {
    let image = $("#img");
    let hrefDiv = $("#hrefLink");
    let paragraph = $("#paragraph");

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
        href.text(hrefLink);
        textBox.hide();        
        image.attr("src", hrefLink);  // creat small picture
        image.show();
    }

    // create the remove button
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
    });

    // paragraph.append(removeButton);        // add to the paragraph
    // paragraph.append(href);
    // paragraph.append(textBox);
    // hrefDiv.append(paragraph);

    if (isView)
    {
        VSS.resize(null, 200);
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
    let image = $("#img");
    if (hrefLink == "") {
        href.hide();
        textBox.show();
        image.hide();
    }
    else {
        href.attr("href", hrefLink);
        textBox.hide(); href.text(hrefLink);
        href.show();
        image.attr("src", hrefLink);
        image.show();
    }
    WitService.WorkItemFormService.getService().then(
        (service) => {
            service.setFieldValue(FieldRefName, hrefLink);
        }
    );
}