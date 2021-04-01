import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
import { RetriveToken, StoreToken } from "./storageHelper";

let view: boolean = false;
let fieldRefName: string = "";
let requireCall: string = ""
let link: string = "";  // src to the image
let url: string;   // of getting the image for blob
let UserName: string;
let Password: string;
let data: string;      // base 64 stream data image
let bigImmage = $("#img");
let magnifier: boolean;
let token: any;
let ImageDeg: number = 0;
let scaleX: number = 1;
let scaleY: number = 1;
let scale: number = 1;

export function CreateView(HrefLink: string, FieldRefName: string, RequireCall: string, Url: string, userPass: string) {
    if (userPass) {
        let inf = userPass.split(',');
        UserName = inf[0];
        if (inf.length > 0)
            Password = inf[1]
    }
    url = Url;
    magnifier = false;
    requireCall = RequireCall;
    fieldRefName = FieldRefName;
    link = HrefLink;
    data = "";
    let href = $("#href");        // button open new tab with image link
    let textBox = $("#input");    // text box for the link
    textBox.val(link);
    if (requireCall == "WINS") {
        CheckIfTokenExists("WINS").then(() => {
            OnFieldLeavFocus();
        })
        href.hide();
        $("#removeButton").hide();
    }
    else {
        OnFieldLeavFocus();
    }
    SetNewImageScale();
    // $("#image").css("transform", "rotate(" + ImageDeg + "deg) scaleX(" + scaleX + ") scaleY(" + scaleY + ") scale(" + scale + ")");
    // bigImmage.css("transform", "rotate(" + ImageDeg + "deg) scaleX(" + scaleX + ") scaleY(" + scaleY + ") scale(" + scale + ")");
    SetTheImage();
    SetTheRemoveButton();
    SetCheckButton();
    SetImageButtons();
    textBox.focusout(() => OnFieldLeavFocus());
}
function SetTheImage() {
    $("#image").click(() => {
        if (magnifier)
            $(".img-magnifier-glass").remove();
        else
            magnify();
        magnifier = !magnifier;
    });
}
function SetTheRemoveButton() {
    let image = $("#image");
    let check = $("#check");      // button switch show state
    let imageBuutons = $("#ImageButtons");
    let textBox = $("#input");    // text box for the link
    let href = $("#href");        // button open new tab with image link
    let removeButton = $("#removeButton");
    removeButton.text("New");
    removeButton.addClass("button");
    removeButton.click(() => {
        textBox.val("");
        textBox.show();
        textBox.focus();
        href.attr("href", "");
        href.text("");
        href.hide();
        check.hide();
        imageBuutons.hide();
        view = false;
        href.hide();
        textBox.show();
        image.hide();
        image.attr("src", "");
        bigImmage.attr("src", "");
        VSS.resize();
        WorkItemFormService.getService().then(
            (service) => {
                data = "";
                service.setFieldValue(fieldRefName, "");
            }
        );
    });
}
function SetCheckButton() {
    let check = $("#check");      // button switch show state
    check.text("Show");
    check.addClass("button");
    check.click(() => {
        view = !view
        AddImageIfexists();
        VSS.resize();
    });
}
function SetImageButtons() {
    $("#FlipH").addClass("button");
    $("#FlipH").click(() => {
        scaleY = scaleY * -1;
        SetNewImageScale();
    });
    $("#FlipV").addClass("button");
    $("#FlipV").click(() => {
        scaleX = scaleX * -1;
        SetNewImageScale();
    });
    $("#Spin90Deg").addClass("button");
    $("#Spin90Deg").click(() => {
        ImageDeg += 90;
        if (scale == 1) {
            scale = 0.7
        }
        else
            scale = 1
        SetNewImageScale();
    });
}
function SetNewImageScale() {
    $("#image").css("transform", "rotate(" + ImageDeg + "deg) scaleX(" + scaleX + ") scaleY(" + scaleY + ") scale(" + scale + ")");
    bigImmage.css("transform", "rotate(" + ImageDeg + "deg) scaleX(" + scaleX + ") scaleY(" + scaleY + ") scale(" + scale + ")");
}
function OnFieldLeavFocus() {
    let textBox = $("#input");
    link = textBox.val();
    data = "";
    let check = $("#check");
    let imageBuutons = $("#ImageButtons");
    let href = $("#href");
    let image = $("#image");
    image.attr("src", "");
    bigImmage.attr("src", "");
    if (link == "") {
        href.hide();
        check.hide();
        imageBuutons.hide();
        textBox.show();
        image.hide();
    }
    else {
        GetSourceFromApi().then((dataRecived) => {
            image.attr("src", dataRecived);
            bigImmage.attr("src", dataRecived);
        })
        textBox.hide();
        href.attr("href", link);
        href.text(link);
        if (requireCall != "WINS")
            href.show();
        imageBuutons.show();
        check.show();
        AddImageIfexists();
    }
    VSS.resize();
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
        if (data == "") {
            data = await GetSourceFromApi();
        }
        image.attr("src", data);
        image.show();
    }
    else {
        check.text("Show");
        image.hide();
        $(".img-magnifier-glass").remove();
    }
    VSS.resize();
}
async function GetSourceFromApi() {
    switch (requireCall) {
        case "WINS": {
            if (!token)
                token = await GetTokenFromWins();
            if (!token) {
                data = "https://gp1.wac.edgecastcdn.net/802892/http_public_production/artists/images/2116140/original/crop:x0y0w886h1084/hash:1493073657/PARA_GORRA_NOTOKEN.jpg?1493073657"
            }
            else {
                data = await GetImageDataFromWins(token["access_token"]);
                if (data == "") {
                    data = "https://p1.hiclipart.com/preview/658/470/455/krzp-dock-icons-v-1-2-empty-grey-empty-text-png-clipart.jpg"
                }
                else
                    data = "data:image/jpeg;base64," + data.slice(3, data.length - 5);
            }
            return data;
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
        return Response.text().then((result) => {
            let token = JSON.parse(result);
            let gap: number = token["expires_in"];
            let maybe: Date = new Date;
            maybe.setSeconds(maybe.getSeconds() + gap)
            let storeInf = { token: token, recalTime: maybe }
            StoreToken("WINS", storeInf);
            return token;
        });
    });
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
        .then((result) => {
            if (result == "\"\\\"Azure, DownloadAsync >> Exception: The URI prefix is not recognized.\\\"\"") {
                console.log('error', result);
                return "https://mathies.ca/images/WINSlogo2.png";
            }
            return result;
        })
        .catch((error) => { console.log('error', error); return "https://mathies.ca/images/WINSlogo2.png"; });
}
function magnify() {
    let zoom: number = 3
    let img, glass, w, h, bw;
    img = document.getElementById("image");
    /*create magnifier glass:*/
    glass = document.createElement("DIV");
    glass.setAttribute("class", "img-magnifier-glass");
    /*insert magnifier glass:*/
    img.parentElement.insertBefore(glass, img);
    /*set background properties for the magnifier glass:*/
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
    bw = 10;
    w = glass.offsetWidth / 2;
    h = glass.offsetHeight / 2;
    /*execute a function when someone moves the magnifier glass over the image:*/
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);
    /*and also for touch screens:*/
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);
    function moveMagnifier(e) {
        let pos, x, y;
        /*prevent any other actions that may occur when moving over the image*/
        e.preventDefault();
        /*get the cursor's x and y positions:*/
        pos = getCursorPos(e);
        x = pos.x;
        y = pos.y;
        /*prevent the magnifier glass from being positioned outside the image:*/
        if (x > img.width - (w / zoom)) { x = img.width - (w / zoom); }
        if (x < w / zoom) { x = w / zoom; }
        if (y > img.height - (h / zoom)) { y = img.height - (h / zoom); }
        if (y < h / zoom) { y = h / zoom; }
        /*set the position of the magnifier glass:*/
        glass.style.left = (x - 120 * (x / img.width)) + "px";
        glass.style.top = (y - 120 * (y / img.height)) + "px";
        /*display what the magnifier glass "sees":*/
        glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
    }
    function getCursorPos(e) {
        let a, x = 0, y = 0;
        e = e || window.event;
        /*get the x and y positions of the image:*/
        a = img.getBoundingClientRect();
        /*calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /*consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return { x: x, y: y };
    }
}
async function CheckIfTokenExists(providerName: string) {
    let storedToken = await RetriveToken(providerName);
    if (storedToken && storedToken != "") {
        let reDate: Date = new Date(storedToken["recalTime"]);
        if (reDate > new Date) {
            token = storedToken["token"];
            return;
        }
    }
    token = undefined
}