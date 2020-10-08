import { WorkItemFormService } from "TFS/WorkItemTracking/Services";

let view: boolean = false;
let fieldRefName: string = "";
let requireCall: string = ""
let link: string = "";
let url: string;
let UserName: string;
let Password: string;
let data: string;

export function CreateView(HrefLink: string, FieldRefName: string, RequireCall: string, Url: string, userPass: string) {
    if (userPass) {
        let inf = userPass.split(',');
        UserName = inf[0];
        if (inf.length > 0)
            Password = inf[1]
    }
    data = "";
    url = Url;
    requireCall = RequireCall;
    fieldRefName = FieldRefName;
    link = HrefLink;
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
        view = false;
        href.hide();
        check.hide();
        textBox.show();
        image.hide();
        image.attr("src", "");
        VSS.resize(null, null);
        WorkItemFormService.getService().then(
            (service) => {
                data = "";
                service.setFieldValue(fieldRefName, "");
            }
        );
    });
    check.click(() => {
        view = !view
        AddImageIfexists();
    })
    textBox.val(link);
    textBox.focusout(() => OnFieldLeavFocus());
    OnFieldLeavFocus();
}
function OnFieldLeavFocus() {
    data = ""
    let textBox = $("#input");
    link = textBox.val();
    let check = $("#check");
    let href = $("#href");
    let image = $("#image");
    image.attr("src", "");
    if (link == "") {
        href.hide();
        check.hide();
        textBox.show();
        image.hide();
        VSS.resize(null, null);
    }
    else {
        textBox.hide();
        href.attr("href", link);
        href.text(link);
        href.show();
        check.show();
        AddImageIfexists();
    }
    WorkItemFormService.getService().then(
        (service) => {
            service.setFieldValue(fieldRefName, link);
        }
    );
}
async function AddImageIfexists() {
    let image = $("#image");
    let check = $("#check");
    if (view) {
        check.text("Hide");
        let url: string;
        if (data == "") {
            url = await GetSourceFromApi();
            data = url;
        }
        image.attr("src", url);
        image.show();
    }
    else {
        check.text("Show");
        image.hide();
    }
    VSS.resize();
}
async function GetSourceFromApi() {
    switch (requireCall) {
        case "WINS": {
            let token = JSON.parse(await GetTokenFromWins())
            let data = await GetImageDataFromWins(token["access_token"]);
            return "data:image/jpeg;base64," + data.slice(3, data.length - 5);
        }
        default: {
            return link
        }
    }
}
function GetTokenFromWins() {
    let content: string = "grant_type=password&username=" + UserName + "&password=" + Password;
    let myHeader = new Headers();
    myHeader.append("Content-Type", "application/x-www-form-urlencoded");
    myHeader.append("Content-Type", "application/json");
    let requestOption = {
        method: 'POST',
        headers: myHeader,
        body: content
    }
    return fetch(url + "token", requestOption).then((Response) => {
        return Response.text();
    })
}
async function GetImageDataFromWins(token: string) {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({ "PlantId": "20", "Path": link });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw
    };

    return fetch(url + "api/Plant/GetFailureImage", requestOptions)
        .then(response => response.text())
        .then((result) => { return result })
        .catch((error) => { console.log('error', error); return "https://mathies.ca/images/WINSlogo2.png"; });
}

