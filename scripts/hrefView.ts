import * as WitService from "TFS/WorkItemTracking/Services";

export function CreateView(hrefLink: string, FieldRefName: string) {
    let isView:boolean = false;
    let image = $("#image");
    let check = $("#check");
    let href = $("#href");
    let textBox = $("#input");
    let removeButton = $("#removeButton");
    removeButton.text("X");
    removeButton.click(() => {
        textBox.val("");
        textBox.show();
        href.text("");
        href.hide();
        check.hide();
        OnFieldLeavFocus("", FieldRefName, isView);
        VSS.resize(null, 40);
        image.attr("src", "");
        image.hide();
    });

    check.click(() => {
        isView = !isView
        if (isView)
            check.text("Hide");
        else
            check.text("Show");
        AddImageIfexists(hrefLink, image, isView);
    })
    textBox.val(hrefLink);
    textBox.focusout(() => OnFieldLeavFocus(textBox.val(), FieldRefName, isView));
    if (hrefLink == undefined || hrefLink == "") {
        href.hide();
        check.hide();
        textBox.show();
        image.hide();
    }
    else {
        check.show();
        href.attr("href", hrefLink);
        href.text(hrefLink.substring(0, 50) + " ...");
        textBox.hide();
        AddImageIfexists(hrefLink, image, isView)
    }
    if (isView)
        check.text("Hide");
    else
        check.text("Show");
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
        href.attr("href", hrefLink);
        textBox.hide();
        href.text(hrefLink.substring(0, 50) + " ...");
        href.show();
        check.show();
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