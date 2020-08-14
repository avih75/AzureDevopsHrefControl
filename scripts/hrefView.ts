// import * as WitService from "TFS/WorkItemTracking/Services";
import { WorkItemFormService } from "TFS/WorkItemTracking/Services";

export function CreateView(hrefLink: string, FieldRefName: string) {
    let isView: boolean = false;   // show image state
    let image = $("#image");      // image element
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
        OnFieldLeavFocus(textBox.val(), FieldRefName, isView);
        VSS.resize(null, 40);
        image.attr("src", "");
        image.hide();
    });
    check.click(() => {
        isView = !isView
        AddImageIfexists(hrefLink, isView);
    })
    textBox.val(hrefLink);
    textBox.focusout(() => OnFieldLeavFocus(textBox.val(), FieldRefName, isView));
    if (hrefLink == undefined || hrefLink == "") {
        href.hide();
        check.hide();
        image.hide();
        textBox.show();
        AddImageIfexists(hrefLink, isView)
    }
    else {
        textBox.hide();
        check.show();
        href.show();
        href.attr("href", hrefLink);
        href.text(hrefLink.substring(0, 50) + " ...");
        AddImageIfexists(hrefLink, isView)
    }
}
function OnFieldLeavFocus(hrefLink: string, FieldRefName: string, isView: boolean) {
    let textBox = $("#input");
    let check = $("#check");
    let href = $("#href");
    let image = $("#image");
    if (hrefLink == "") {
        href.hide();
        check.hide();
        textBox.show();
        image.hide();
        image.attr("src", "");
        VSS.resize(null, 40);
    }
    else {
        textBox.hide();
        href.attr("href", hrefLink);
        href.text(hrefLink.substring(0, 50) + " ...");
        href.show();
        check.show(); 
        AddImageIfexists(hrefLink, isView);
    }
    WorkItemFormService.getService().then(
        (service) => {
            service.setFieldValue(FieldRefName, hrefLink);
        }
    );
}
function AddImageIfexists(hrefLink: string, isView: boolean) {
    let image = $("#image");
    let check = $("#check");
    image.attr("src", hrefLink);
    if (isView) {
        image.show();
        check.text("Hide");
        //     $.get(hrefLink)
        //         .done(function () {
        VSS.resize(null, 290);
        //         }).fail(function () {
        //             VSS.resize(null, 60);
        //         })
    }
    else {
        VSS.resize(null, 40);
        check.text("Show");
        image.hide();
    }
}