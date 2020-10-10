import { WorkItemFormService } from "TFS/WorkItemTracking/Services";

let view: boolean = false;
let fieldRefName: string = "";
let requireCall: string = ""
let link: string = "";
let url: string;   // of getting the image
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
    url = Url;
    requireCall = RequireCall;
    fieldRefName = FieldRefName;
    link = HrefLink;
    let image = $("#image");
    image.click(() => {
        $(".img-magnifier-glass").remove();
        magnify("image", 3);
    })
    data = "";
    if (link != undefined && link != "")
        GetSourceFromApi().then((data) => {
            image.attr("src", data);
        })
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
        VSS.resize();
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
        VSS.resize();
    })
    textBox.val(link);
    textBox.focusout(() => OnFieldLeavFocus());
    OnFieldLeavFocus();
}
function OnFieldLeavFocus() {
    let textBox = $("#input");
    link = textBox.val();
    data = "";
    let check = $("#check");
    let href = $("#href");
    let image = $("#image");
    image.attr("src", "");
    if (link == "") {
        href.hide();
        check.hide();
        textBox.show();
        image.hide();
    }
    else {
        GetSourceFromApi().then((data) => {
            image.attr("src", data);
        })
        textBox.hide();
        href.attr("href", link);
        href.text(link);
        href.show();
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
function magnify(imgID, zoom) {
    let img, glass, w, h, bw;
    img = document.getElementById(imgID);
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