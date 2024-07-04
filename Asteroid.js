cfg.MUI
cfg.Light
cfg.Fast
app.EnableBackKey(false)

var UserConfig, isNew, theme;
UserConfig = 'profile';
isNew = app.LoadBoolean('isNewUser', true, 'UserConfig');


function OnStart() {

    theme = app.LoadText('myTheme', 'Light')
    app.InitializeUIKit(MUI.colors.blue.lighten1, theme);
    if (isNew === true) NewUser();
    else Main();
}



//app.ClearData('UserConfig')
function NewUser() {

    layWelcome = MUI.CreateLayout('Absolute', 'FillXY')

    logo = app.CreateImage("Img/icon.png", 0.4, -1)
    logo.SetPosition(0.3, 0.2)
    layWelcome.AddChild(logo)

    let newmsg = "Welcome To Asteroid Browser, By Using Our Browser, You Aggree To T & C's.";
    Message = app.CreateText(newmsg, 1, 1, 'Monospace,Multiline')
    Message.SetOnTouch(ShowTerms)
    Message.SetPosition(0, 0.6)
    layWelcome.AddChild(Message)

    AgreeBtn = MUI.CreateButtonContained('Agree', 0.4, 0.1)
    AgreeBtn.SetPosition(0.3, 0.8)
    AgreeBtn.SetOnTouch(AcceptedTerms)
    layWelcome.AddChild(AgreeBtn)
    app.AddLayout(layWelcome)
}

function ShowTerms() {
    app.OpenUrl('https://asteroid.data.blog/2022/12/25/end-user-license-aggreement-eula/')
}

function AcceptedTerms() {
    app.SaveBoolean('isNewUser', false, 'UserConfig') || Main();
}



function Main() {
    if (app.GetOrientation() === 'Landscape') {
        app.SetOrientation('Portrait')
    }
    lay = app.CreateLayout('Absolute', 'VCenter,Vertical,FillXY')
    layHome = MUI.CreateLayout('Absolute', 'VCenter,Vertical,FillXY')
    layHome.SetPosition(0, 0, 1, 0.93)
    lay.SetOrientation('Portrait')

    logo = app.CreateImage("Img/icon.png", 0.5, -1)
    logo.SetPosition(0.25, 0.05)

    searchbx = MUI.CreateTextEditSearch(0.85, "Left", "Search Or Enter Address")
    searchbx.SetOnEnter(FindQuery)
    searchbx.SetPosition(0.07, 0.3)

    if (isUrl(app.GetClipboardText())) {
        CpdBtn = MUI.CreateButtonOutlined('Copied Link')
        CpdBtn.SetPosition(0.07, 0.42)
        CpdBtn.SetOnTouch(FastQuery)
        layHome.AddChild(CpdBtn)
    }
    if (isText(app.GetClipboardText()) && isUrl(app.GetClipboardText()) === false) {
        CpdBtn = MUI.CreateButtonOutlined('Copied Text')
        CpdBtn.SetPosition(0.07, 0.42)
        CpdBtn.SetOnTouch(FastQuery)
        layHome.AddChild(CpdBtn)
    }

    AIBtn =  MUI.CreateButtonOutlined('B.AI Chat')
    AIBtn.SetPosition(0.42, 0.42)
    AIBtn.SetOnTouch(AIQuery)
    layHome.AddChild(AIBtn)

    barcodeSearch = MUI.CreateButtonOutlined('qrcode')
    barcodeSearch.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    barcodeSearch.SetPosition(0.74, 0.42)
    barcodeSearch.SetOnTouch(imageSearch)
    layHome.AddChild(barcodeSearch)
    

    bookmarks = MUI.CreateButtonElegant('bookmark', 0.19, 0.08)
    bookmarks.SetPosition(0.054, 0.83)
    //bookmarks.SetOnTouch(bookmarkViewer)
    bookmarks.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    layHome.AddChild(bookmarks)

    recents = MUI.CreateButtonElegant('book', 0.19, 0.08)
    recents.SetPosition(0.29, 0.83)
    recents.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    layHome.AddChild(recents)

    bhistory = MUI.CreateButtonElegant('gobackward', 0.19, 0.08)
    bhistory.SetPosition(0.51, 0.83)
    bhistory.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    layHome.AddChild(bhistory)

    collections = MUI.CreateButtonElegant('archivebox', 0.19, 0.08)
    collections.SetPosition(0.74, 0.83)
    collections.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    layHome.AddChild(collections)


    layFooter = MUI.CreateLayout("Absolute", "FillXY")
    layFooter.SetPosition(0, 0.93, 1, 0.09)

    back = MUI.CreateButtonFlat("chevron_left", 0.19, 0.08)
    back.SetPosition(0, 0, 0.19, 0.08)
    back.SetOnTouch(webOnBack)
    back.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    forward = MUI.CreateButtonFlat("chevron_right", 0.19, 0.08)
    forward.SetPosition(0.2, 0, 0.19, 0.08)
    forward.SetOnTouch(webOnForward)
    forward.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    panel = MUI.CreateButtonFlat("slider_horizontal_3", 0.19, 0.08)
    panel.SetPosition(0.4, 0, 0.19, 0.08)
    panel.SetOnTouch(HomePanel)
    panel.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    tabdrawer = MUI.CreateButtonFlat("rectangle_stack", 0.19, 0.08)
    tabdrawer.SetPosition(0.6, 0, 0.19, 0.08)
    tabdrawer.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    home = MUI.CreateButtonFlat("house", 0.19, 0.08)
    home.SetPosition(0.8, 0, 0.19, 0.08)
    home.SetOnTouch(goToHome)
    home.SetOnLongTouch(BrowsingOptions)
    home.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    layHome.AddChild(logo)
    layHome.AddChild(searchbx)
    layFooter.AddChild(back)
    layFooter.AddChild(forward)
    layFooter.AddChild(panel)
    layFooter.AddChild(tabdrawer)
    layFooter.AddChild(home)
    lay.AddChild(layFooter)
    lay.AddChild(layHome)

    app.AddLayout(lay)
    app.LoadPlugin('Support')
    app.LoadPlugin("PopUp");
    sup = app.CreateSupport();
    if (theme === 'Dark') app.SetNavBarColor("#121212");
    else app.SetNavBarColor("#f5f5f5");}

function imageSearch(){
    app.LoadPlugin( "BarcodeReader" );
    qrdisplay = sup.CreateBottomSheet();
    qrlay = app.CreateLayout('Absolute','VCenter,FillXY')
    qrlay.SetSize(1,0.6)
    qrdisplay.AddChild(qrlay)
    
    qrreader = app.CreateObject( "BarcodeReader" );
    cam = app.CreateCameraView( 1, 0.6, "VGA, UseYUV" );
    cam.SetOnReady( cam_OnReady );
    qrlay.AddChild( cam );
    
    flashBtn = MUI.CreateButtonFlat("lightbulb", 0.19, 0.08)
    flashBtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    flashBtn.SetPosition(0.4, 0.4)
    flashBtn.SetOnTouch(flashT)
    flashBtn.Show()
    qrlay.AddChild( flashBtn );
    
    flashBtnOff = MUI.CreateButtonFlat("lightbulb_slash", 0.19, 0.08)
    flashBtnOff.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    flashBtnOff.SetPosition(0.4, 0.4)
    flashBtnOff.SetOnTouch(flashF)
    flashBtnOff.Hide()
    qrlay.AddChild( flashBtnOff );
    qrdisplay.Show();
    
}
function flashT() {flashOn(true);}
function flashF() { flashOn(false);}
function flashOn(val){
    if(val === true){
    cam.SetFlash(true)
    flashBtn.Hide()
    flashBtnOff.Show()
    }
    else{
        cam.SetFlash(false)
        flashBtnOff.Hide()
        flashBtn.Show()
    }
}
function cam_OnReady()
{
  cam.StartPreview();
  DecodeFromCamera();
}

function DecodeFromCamera()
{
  var result = qrreader.Decode( cam );

  if( result != null )
  {
    app.Vibrate( "0,100,30,100,50,300" );
    cam.StopPreview()
    qrdisplay.Dismiss()
    let data = result.content;
    let searchdata = "https://www.google.com/search?q=" +data;
    if( isUrl(result.content)){
        FindQuery(result.content)
    }
    else{
        FindQuery(searchdata);
    }
    
  }
else
  {
    //Decode again in 200 milliseconds.
    setTimeout( DecodeFromCamera, 200 );
  }
 
}
function BrowsingOptions(){
    let list = "Read Page,Remove Paywall,View Page Security";
    lst = MUI.CreateMenu(list, null, null, "Bottom, Right")
    lst.SetOnSelect(selectOptions)
    lst.Show()
}

function AIQuery(){
    aidisplay = sup.CreateBottomSheet();
    ailay = app.CreateLayout('Absolute','VCenter,FillXY')
    ailay.SetSize(1,0.6)
    aidisplay.AddChild(ailay)
    aiweb = app.CreateWebView(1,0.6)
    aiweb.SetOnProgress(aiProgress)
    aiweb.SetOnConsole(aiOnConsole)
    aiweb.LoadUrl('https://chatbot.theb.ai/#/chat/1002')
    aidisplay.AddChild(aiweb)
    aidisplay.Show()
    initPromtBuilder()
}
function aiProgress(prg){
    if( prg !== 100 ) return;
const inject = `const inp = document.querySelector("textarea");
    
    const writePrompt = text => {
        inp.value = text;
        inp.dispatchEvent(new InputEvent("input"));
    }
    
    inp.onclick = ev => {
        ev.preventDefault();
        inp.blur();
        console.log("DS:prompt");
    }
    
    document.body.addEventListener("click", ev => {
        if(ev.target.matches(".code-block-header__copy")) {
            const code = ev.target.offsetParent.nextElementSibling.textContent;
            console.log("DS:code:" + code)
        }
    });
    

    setTimeout(() => document.querySelector("footer > div > div > button").click(), 0)`
    
    aiweb.Execute( inject )
    
}
function aiOnConsole( msg ) {
    if( !msg || !msg.startsWith( "DS:" ) ) return;
    
    const cmd = msg.slice( 3 );
    
    switch(true)
    {
        case cmd.startsWith("prompt"):
            showPromptBuilder()
            break;
        case cmd.startsWith("code"):
            app.SetClipboardText( cmd.slice(5) )
            app.ShowPopup( "Copied!", "Bottom" )
            break;
    }
}


function initPromtBuilder() {
    promptDialog = app.CreateDialog()
    
    const card = app.CreateLayout( "Card" )
    card.SetBackColor( "#ffffff" )
    card.SetElevation( 0 )
    card.SetCornerRadius( 15 )
    card.SetSize( 0.9 )
    promptDialog.AddLayout( card )
    
    const lay = app.AddLayout( card, "Linear", "Right,FillXY" )
    lay.SetChildMargins( 15, 5, 15, 5, "sp" )
    
    const title = app.AddText( lay, "Prompt Builder", -1, -1, "FillX,Left,Bold" )
    title.SetTextColor( "#52565b" )
    title.SetTextSize( 24, "sp" )
    
    const inpCard = app.AddLayout( lay, "Card", "FillX" )
    inpCard.SetSize( -1, 200, "dp" )
    inpCard.SetBackColor( "#f4f6f8" )
    inpCard.SetCornerRadius( 10 )
    
    promptInput = app.AddTextEdit( inpCard, "", -1, -1, "FillXY" )
    promptInput.SetBackColor( "#00000000" )
    promptInput.SetTextColor( "#52565b" )
    promptInput.SetCursorColor( "#52565b" )
    promptInput.SetHint( "Ask me anything" )
    promptInput.SetPadding( 20, 20, 20, 20, "px" )
    promptInput.SetTextSize( 12, "sp" )
    
    const okBtn = app.AddButton( lay, "[fa-send]", -1, -1, "FontAwesome" )
    okBtn.SetBackColor( "#18a058" )
    okBtn.SetTextColor( "#FFFFFF" )
    okBtn.SetTextSize( 16, "sp" )
    okBtn.SetSize( 100, 50, "dp" )
    okBtn.SetOnTouch( () => {
        aiweb.Execute(`writePrompt( \`${promptInput.GetText()}\` )`)
        promptDialog.Dismiss()
    } )
}

function showPromptBuilder() {
    promptInput.SetText( "" )
    promptDialog.Show()
}


function bookmarkViewer() {
    bk = sup.CreateBottomSheet();
    bookmarkLay = MUI.CreateLayout('Absolute', 'FillXY')
    bk.AddChild(bookmarkLay)

    //lst = app.CreateList( "Item 1,Item 2,Item 3,Item 4,Item 5", null, null, "menu" );
    lst.SetBackColor("#EEEEEE");
    bookmarkLay.AddChild(lst)
    bk.Show()
}

function LightTheme() {
    SetTheme('Light')
}

function setDarkTheme() {
    panel.Dismiss()
    app.SaveText("myTheme", "Dark");
    setTimeout(OnStart, 0.01);
}

function setLightTheme() {
    panel.Dismiss()
    app.SaveText("myTheme", "Light");
    setTimeout(OnStart, 0.01);
}

function isText(str) {
    // Regular expression to match URLs
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    // Check if the string matches the URL regex
    if (urlRegex.test(str)) {
        return false; // It's a URL
    } else {
        return true; // It's text
    }
}


function isUrl(text) {
    // Use regular expression to check if the string contains a domain name
    const domainRegex = /^(?:\w+\.)+\w+$/i;
    const hasDomain = domainRegex.test(text);

    // Use regular expression to check if the string starts with a protocol
    // (http, https, ftp, etc.) followed by a colon and two slashes, or just
    // a double-slash (which indicates a protocol-relative URL)
    const protocolRegex = /^((https?|ftp):\/\/|\/\/)/i;
    const hasProtocol = protocolRegex.test(text);

    // Use the `URL` object to parse the string and check if the result
    // has a valid hostname and TLD (top-level domain)
    let isValidUrl = false;
    try {
        const url = new URL(text);
        const hostname = url.hostname;
        const tldRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
        const hasValidTLD = tldRegex.test(hostname);
        isValidUrl = hasValidTLD;
    } catch (error) {
        // Ignore errors and keep `isValidUrl` as `false`
    }

    // Return true if either the domain, the protocol, or the URL parsing succeeded
    return hasDomain || hasProtocol || isValidUrl;
}

//Will Return False Foe Urls Likw facebook.com, anything without a protocol

function isDomain(text) {
    // Use regular expression to check if the string starts with a protocol
    // (http, https, ftp, etc.) followed by a colon and two slashes
    const protocolRegex = /^(https?|ftp):\/\/+/i;
    const hasProtocol = protocolRegex.test(text);

    // Use the `URL` object to parse the string and check if the result
    // has a valid hostname and TLD (top-level domain)
    let isValidUrl = false;
    try {
        const url = new URL(text);
        const hostname = url.hostname;
        const tldRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
        const hasValidTLD = tldRegex.test(hostname);
        isValidUrl = hasValidTLD;
    } catch (error) {
        // Ignore errors and keep `isValidUrl` as `false`
    }

    // Return true only if the protocol is http or https and the URL parsing succeeded
    return hasProtocol && isValidUrl;
}

function IsDocument(url) {
    const documentRegex = /\.(pdf|docx|pptx|xlsx)$/i;
    return documentRegex.test(url);
}

function IsFile(url) {
    try {
        var fileExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'apk', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'mp3', 'wav', 'ogg', 'mp4', 'avi', 'mov', 'wmv', 'zip', 'rar', '7z', 'csv', 'exe', 'dll', 'jar', 'ttf', 'otf'];
        var fileExtension = url.split('.').pop().toLowerCase();

        if (fileExtensions.includes(fileExtension)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {}
}

function FileName(url) {
    const match = url.match(/\/([^\/?&]+)[^\/]*$/);
    if (match) {
        return match[1];
    }
    // If no filename found using regex, use the last part of the URL as the filename
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
}

function IsExtended(url) {
    var queryParams = url.split('?')[1];
    if (queryParams) {
        return true;
    } else {
        return false;
    }
}

function isYoutubeVideo(videoLink) {
    const youtubeLinkRegex = /^(?:https?\:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?.*?v=|.*?\/)?([\w\-]+)(?:[?&]list=([\w\-]+).*)?$/i;
    return youtubeLinkRegex.test(videoLink);
}


function getYoutubeEmbedLink(videoLink) {
    const youtubeLinkRegex = /^(?:https?\:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?.*?v=|.*?\/)?([\w\-]+)(?:[?&]list=([\w\-]+).*)?$/i;
    const match = videoLink.match(youtubeLinkRegex);
    if (match && match[1]) {
        const videoId = match[1];
        const playlistId = match[2];
        return `https://www.youtube.com/embed/${videoId}${playlistId ? `?list=${playlistId}` : ''}`;
    }
    return null;
}

function isMobileYtLink(videoLink) {
    const mobileLinkRegex = /^(?:https?\:\/\/)?(?:m\.)?(?:youtube\.com)\/(?:watch\?.*?v=|.*?\/)?([\w\-]+)/i;
    const match = videoLink.match(mobileLinkRegex);
    return match !== null;
}


function getMobileYoutubeEmbedLink(videoLink) {
    const mobileLinkRegex = /^(?:https?\:\/\/)?(?:m\.)?(?:youtube\.com)\/(?:watch\?.*?v=|.*?\/)?([\w\-]+)/i;
    const match = videoLink.match(mobileLinkRegex);
    if (match && match[1]) {
        const videoId = match[1];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
}

function FastQuery() {
    if (isUrl(app.GetClipboardText())) FindQuery(app.GetClipboardText(), true);
    else FindQuery(app.GetClipboardText(), false);
}

function FindQuery(url, main) {

    layWeb = app.CreateLayout('Absolute', 'FillXY,VCenter')
    layWeb.SetPosition(0, 0, 1, 0.93)
    layWeb.SetVisibility('Show')

    webLay = app.CreateLayout('Absolute', 'FillXY,VCenter')
    webLay.SetPosition(0, 0, 1, 0.905)
    webLay.SetVisibility('Show')

    siteDisplay = MUI.CreateLayout('Absolute', 'FillXY,VCenter')
    siteDisplay.SetPosition(0, 0.905, 1, 0.25)
    siteDisplay.SetBackColor()
    siteDisplay.SetSize(1, 0.5)
    siteDisplay.SetOnTouch(editBar)

    editUrl = MUI.CreateTextEditSearch(0.8)
    editUrl.SetPosition(0.1, 0.82)
    editUrl.Hide()
    editUrl.SetOnEnter(FindQuery)
    webLay.AddChild(editUrl)

    siteLinear = app.CreateLayout('Linear', "Horizontal,HCenter")
    //siteLinear.SetPosition(0,0.89,1,0.25)
    siteLinear.SetBackColor()
    siteLinear.SetSize(1, 0.5)
    //siteLinear.SetVisibility('Show')
    siteDisplay.AddChild(siteLinear)

    web = app.CreateWebView(1, 0.905, "IgnoreSSLErrors,IgnoreErrors,NoPause,AllowZoom,ScrollFade,AllowCapture")
    web.SetOnRequest(webOnRequest)
    web.SetBackColor("white")
    web.SetOnUrl(webOnUrl)
    web.SetOnConsole(webOnConsole);
    web.SetOnProgress(webOnProgress)
    webLay.AddChild(web)

    layWeb.AddChild(webLay)
    layWeb.AddChild(siteDisplay)
    app.AddLayout(layWeb)
    try {
        editUrl.Hide()
    } catch (err) {}
    try {
        var query = this.GetText();
        app.HideKeyboard() || layHome.SetVisibility('Hide');
        let fixedquery = 'https://' + query;
        let searchquery = "https://www.google.com/search?q=" +query;
        if (isUrl(query) === true & isDomain(query) === true) web.LoadUrl(query);
        else if (isUrl(query) === true && isDomain(query) === false) web.LoadUrl(fixedquery);
        else web.LoadUrl(searchquery);
        aleer
    } catch (err) {}
    var fastsearchquery = "https://www.google.com/search?q=" + app.GetClipboardText();
    if (isUrl(url) && isDomain(url) === true) {
        web.LoadUrl(url)
    }
    if (isText(url) === false && isDomain(url) === false) {
        let fixedquery = 'https://' + url;
        web.LoadUrl(fixedquery);
    }
    if (isText(url) === true && main === false) web.LoadUrl(fastsearchquery);
    
    if(editUrl.GetVisibility()==='Show'){
        hideBar()
    }
    hideBar()
    MalwareKiller()
}

app.SetOnShowKeyboard(keyboardControls)

function keyboardControls(shown) {
    var KH = app.GetKeyboardHeight();
    var KS = app.GetDisplayHeight();
    var KH2 = KS - KH;
    var KH3 = KH2 / KS * 1 - 0.001;
    var KH3A = KH2 / KS * 1 + 4.58;
    try {
        if (shown === true && editUrl.GetVisibility()!='Show' ) {
            webLay.SetSize(1, KH3);
            web.SetSize(1, KH3);
        }
        if ( shown === true && editBar.GetVisibility()==='Show') {
            editUrl.SetSize(0.1, KH3A)
        }
        
         else {
            //layWeb.SetSize(1, 0.905);
            webLay.SetSize(1, 0.905);
            web.SetSize(1, 0.905);
            siteDisplay.Show()
        }
    } catch (e) {
        DoNothing()
    }
}

function editBar() {
    editUrl.Show()
    editUrl.SetText(web.GetUrl())
    if(editUrl.GetText()===web.GetUrl()){
    setTimeout(hideBar,10000)
    }
    else{
        setTimeout(hideBar,15000)
    }

}

function hideBar() {
    editUrl.Hide()
}

function getDomainName() {
    let url = web.GetUrl()
    var  domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }
    //find & remove port number
    domain = domain.split(':')[0];
    //find & remove www subdomain
    domain = domain.replace(/^www\./i, '');
    //find & remove query string
    domain = domain.split('?')[0];
    return domain;
}

function MalwareKiller() {
    let list = app.ReadFile('malwarelist.txt');

    let listArray = list.split('\n');
    if (listArray.includes(getDomainName())) {
        web.LoadUrl('webSafety.html')
    }

}

var processedFiles = [];

let currentDomain = '';
let siteText = null; // Define siteText with a default value of null

function webOnRequest(url, method, isMain, isAsync) {
    var domainName = getDomainName();
    if (domainName !== currentDomain) {
        if (siteText) { // Check if siteText is defined before removing it
            siteLinear.RemoveChild(siteText);
        }
        siteText = app.CreateText(domainName, 1, null, null, null, "Can be Thin");
        siteText.SetOnTouch(editBar)
        //siteText.SetPosition(0.4, 0, 1, 0.5);
        if (theme === 'Dark') siteText.SetTextColor('#f5f5f5')
        siteLinear.AddChild(siteText);
       
        currentDomain = domainName;
    }

}


function isDownloadable(url) {
    try {
        var downloadExtensions = [
            '7z', 'aac', 'apk', 'avi', 'bmp', 'css', 'csv', 'doc', 'docx', 'flac', 'flv', 'gif', 'gz', 'gzip',
            'ics', 'iso', 'jar', 'jpeg', 'jpg', 'js', 'json', 'm4a', 'm4v', 'mid', 'mov', 'mp3', 'mp4', 'mpeg', 'mpg',
            'odp', 'ods', 'odt', 'ogg', 'ogv', 'pdf', 'png', 'ppt', 'pptx', 'rar', 'rtf', 'sh', 'svg', 'swf', 'tar',
            'tif', 'tiff', 'ts', 'wav', 'webm', 'webp', 'woff', 'woff2', 'xls', 'xlsx', 'xml', 'xul', 'zip'
        ];

        const downloadableHostnames = [

        ];

        const urlObject = new URL(url);

        // Check if the URL is from a downloadable hostname
        if (downloadableHostnames.includes(urlObject.hostname)) {
            return true;
        }

        // Check if the URL has a downloadable file extension
        const urlPath = urlObject.pathname.toLowerCase();
        if (downloadExtensions.some(ext => urlPath.endsWith('.' + ext))) {
            return true;
        }

        // Check if the URL has a query parameter indicating a downloadable file
        const queryParams = urlObject.searchParams;
        if (queryParams.has('download') || queryParams.has('dl') || queryParams.has('attach')) {
            return true;
        }

        // Check if the URL has a file extension at the end of the URL
        const parts = urlPath.split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.') && downloadExtensions.some(ext => lastPart.endsWith('.' + ext))) {
            return true;
        }

        // Check if the URL has a file extension before the query string
        const queryStringIndex = urlPath.indexOf('?');
        if (queryStringIndex > 0) {
            const filename = urlPath.substring(urlPath.lastIndexOf('/', queryStringIndex) + 1, queryStringIndex);
            if (filename.includes('.') && downloadExtensions.some(ext => filename.endsWith('.' + ext))) {
                return true;
            }
        }

        // Check if the URL is downloadable based on response headers
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, false);
        xhr.send();

        if (xhr.status === 200) {
            const contentType = xhr.getResponseHeader('content-type');
            const contentDisposition = xhr.getResponseHeader('content-disposition');

            if (contentType && contentType.includes('application') ||
                contentDisposition && contentDisposition.includes('attachment')) {
                return true;
            }
        }

        return false;

    } catch (e) {
        DoNothing()
    }
}

function isTel(str) {
    const regex = /^tel:/;
    return regex.test(str);
}

function extractPhoneNumber(str) {
    const regex = /^tel:(\+?\d+)/;
    const match = str.match(regex);
    if (match) {
        return match[1];
    } else {
        return null;
    }
}


function webOnUrl(url) {
    if (isUrl(url) && isDownloadable(url)) {
        startDownload(url);
    }
        
    if(isTel(url)){
         app.Call(extractPhoneNumber(url))
    } 
    
    if(isMailToScheme(url)){
    let email = extractEmail(web.GetUrl());
        let subject = extractSubject(web.GetUrl());
        let body = extractBody(web.GetUrl());
        app.SendMail(email, subject, body);
    }
    if (isSmsScheme(url)) {
        let number = extractSmsNumber(web.GetUrl());
        let body = extractSmsBody(web.GetUrl());
        app.SendSMS(body, number);
    }
    if(isUrl(url)){
        web.LoadUrl(url); 
    }
    
}


function getDownloadUrl(url) {
    const downloadableHostnames = [

    ];

    const urlObject = new URL(url);
    const hostname = urlObject.hostname;

    if (downloadableHostnames.includes(hostname)) {
        // If the URL is from a downloadable hostname, return the original URL
        return url;
    }
    
    var downloadExtensions = ['7z', 'aac', 'abw', 'apk', 'asf', 'avi', 'bat', 'bmp', 'bz', 'bz2', 'cab', 'cmd', 'com', 'cpio', 'csv', 'cr2', 'css', 'cw', 'cwk', 'deb', 'dif', 'dmg', 'dll', 'doc', 'docm', 'docx', 'dot', 'dotm', 'eps', 'epub', 'exr', 'f4v', 'flac', 'flv', 'fodg', 'fodp', 'fodt', 'gif', 'gz', 'gzip', 'hwp', 'html', 'ics', 'ico', 'ind', 'ipa', 'iso', 'jar', 'j2k', 'jp2', 'jpf', 'jpx', 'jpeg', 'jpg', 'js', 'json', 'key', 'lha', 'lzh', 'lzma', 'm2v', 'm4a', 'm4p', 'm4v', 'mdb', 'midi', 'mht', 'mhtl', 'mhtml', 'mov', 'mp3', 'mp4', 'mpeg', 'mpeg2', 'mpg', 'mpg2', 'msg', 'nef', 'odp', 'ods', 'odt', 'ogg', 'ogm', 'ogv', 'or', 'orf', 'ott', 'pages', 'pdf', 'pkg', 'png', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'psd', 'py', 'qt', 'ra', 'ram', 'rar', 'rar5', 'raw', 'rmvb', 'rpm', 'rtf', 'sea', 'sh', 'sdd', 'sit', 'sitx', 'snd', 'spk', 'svg', 'svgz', 'swf', 'tar', 'tbz', 'tbz2', 'tif', 'tiff', 'ts', 'txt', 'vb', 'vbs', 'vob', 'war', 'wav', 'webm', 'webp', 'wma', 'wmv', 'wpd', 'wps', 'ws', 'wsf', 'xla', 'xlam', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xlt', 'xltx', 'xml', 'xpi', 'xps', 'xwp', 'zip', 'zst'];

    // Check for query parameters that indicate a downloadable file
    const queryParams = urlObject.searchParams;
    if (queryParams.has('download') || queryParams.has('dl') || queryParams.has('attach')) {
        // Return the URL with the query parameters removed
        const urlWithoutQueryParams = url.split('?')[0];
        return urlWithoutQueryParams;
    }

    // Check for a file extension in the URL
    const path = urlObject.pathname;
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];
    const extensionIndex = lastPart.lastIndexOf('.');
    if (extensionIndex > -1) {
        const extension = lastPart.slice(extensionIndex + 1);
        if (downloadExtensions.includes(extension)) {
            // Return the URL with the filename replaced by "download"
            const filenameWithoutExtension = lastPart.slice(0, extensionIndex);
            const urlWithoutFilename = url.replace(lastPart, '');
            const downloadUrl = urlWithoutFilename + 'download.' + extension;
            return downloadUrl;
        }
    }

    // If no downloadable URL is found, return the original URL
    return url;
}

function startDownload(url) {
    let dloadUrl = url;
    downloadFile(dloadUrl)
    toasta = app.CreatePopUp();
    toasta.SetType("toast");
    toasta.SetText("[fa-info-circle] Downloading File", "Bottom");
    toasta.SetMargins(0.05, 0.02, 0.05, 0.1);
    toasta.SetColor("#262628");
    toasta.Duration("short");
    toasta.AnimateIn("");
    toasta.AnimateOut("slidetoright");
    toasta.Show();

}

// This code downloads a file
function downloadFile(SourceFileURL) {
    var fileuri = SourceFileURL;
    let uri = getDownloadUrl(fileuri)  
    var docName = FileName(fileuri)
    var targetDir = app.GetSpecialFolder('Downloads')
    var intDir = '/sdcard/Downloads'
    var dest = intDir + '/' + docName;
    var newDest = targetDir + '/' + docName;

    app.DownloadFile(uri, newDest, docName, null, 'NoDialog')
    

}


function HomePanel() {
    sup = app.CreateSupport();
    panel = sup.CreateBottomSheet(null, null, "NoDim")
    panellay = MUI.CreateLayout("Absolute", "VCenter,FillXY")
    panellay.SetSize(1, 0.35)
    panel.AddChild(panellay)

    if (theme === 'Dark') {
        themebtn = MUI.CreateButtonFlat("sun_max_fill", 0.35)
        themebtn.SetPosition(0.1, 0, 0.2, 0.1)
        themebtn.SetOnTouch(setLightTheme)
        themebtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    } else {
        themebtn = MUI.CreateButtonFlat("moon", 0.35)
        themebtn.SetPosition(0.1, 0, 0.2, 0.1)
        themebtn.SetOnTouch(setDarkTheme)
        themebtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    }

    htbtn = MUI.CreateButtonFlat("goforward", 0.35)
    htbtn.SetPosition(0.3, 0, 0.2, 0.1)
    htbtn.SetOnTouch(webReload)
    htbtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    tlebtn = MUI.CreateButtonFlat("doc_append", 0.35)
    tlebtn.SetPosition(0.5, 0, 0.2, 0.1)
    tlebtn.SetOnTouch(GetContentLang)
    tlebtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    pinbtn = MUI.CreateButtonFlat("bookmark", 0.35)
    pinbtn.SetPosition(0.7, 0, 0.2, 0.1)
    pinbtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    sharebtn = MUI.CreateButtonFlat("square_arrow_up_on_square", 0.35)
    sharebtn.SetPosition(0.1, 0.11, 0.2, 0.1)
    sharebtn.SetOnTouch(ShareContent)
    sharebtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    readerbtn = MUI.CreateButtonFlat("doc_plaintext", 0.35)
    readerbtn.SetPosition(0.3, 0.11, 0.2, 0.1)
    readerbtn.SetOnTouch(ReaderView)
    readerbtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    findbtn = MUI.CreateButtonFlat("doc_text_search", 0.35)
    findbtn.SetPosition(0.5, 0.11, 0.2, 0.1)
    //findbtn.SetOnTouch(FindInPage)
    findbtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    downloadbtn = MUI.CreateButtonFlat("cloud_download", 0.35)
    downloadbtn.SetPosition(0.7, 0.11, 0.2, 0.1)
    downloadbtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    stngsbtn = MUI.CreateButtonFlat("gear_alt", 0.35)
    stngsbtn.SetPosition(0.5, 0.25, 0.2, 0.1)
    //stngsbtn.SetOnTouch(SettingsPanel)
    stngsbtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    closebtn = MUI.CreateButtonFlat("power", 0.35)
    closebtn.SetPosition(0.7, 0.25, 0.2, 0.1)
    closebtn.SetOnTouch(ExitApp)
    closebtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    panellay.AddChild(closebtn), panellay.AddChild(stngsbtn), panellay.AddChild(downloadbtn), panellay.AddChild(findbtn), panellay.AddChild(readerbtn), panellay.AddChild(sharebtn), panellay.AddChild(themebtn), panellay.AddChild(htbtn), panellay.AddChild(tlebtn), panellay.AddChild(pinbtn), panel.Show();
}

function OnData(isStartUp) {
    //Display intent data.
    var intent = app.GetIntent();
    if (intent) {
        if (isUrl(intent.data)) FindQuery(intent.data);

    }
}

function OnConfig() {
    try {
        if (app.GetOrientation() === 'Portrait') {
            // If the orientation is portrait
            layWeb.SetSize(1, 0.903);
            editUrl.Show()
            webLay.SetSize(1, 0.905);
            web.SetSize(1, 0.905);
            layFooter.Show()
        } else {
            // If the orientation is landscape
            layWeb.SetSize(0.95, 1);
            webLay.SetSize(0.95, 1);
            web.SetSize(0.95, 1);
            layFooter.Hide()
        
        }
    } catch (err) {
       DoNothing();
    }
}


function webOnProgress(progress) {
    //ViewportWidthHack( progress );

    if (progress === 100) {
        web.data.ytHack = false;
        return;
    }

    // Ensures SetOnTouch is applied only once per url.
    if (web.data.ytHack) return;

    if (web.GetUrl().indexOf("youtube") !== -1) {
        web.SetOnTouch(YoutubeFullScreenIntercept);
    } else {

    }

    web.data.ytHack = true;

}

function YoutubeFullScreenIntercept(ev) {
    if (ev.action === "Move") return;

    // Detect full screen click. In this way,
    // we can turn the screen sideways and enlarge it.

    var inject = "(function() {" +
        "var webviewClass = 'button.icon-button.fullscreen-icon';" +
        "var browserClass = 'button.ytp-fullscreen-button.ytp-button';" +
        "var btn = document.querySelector( webviewClass ) || document.querySelector( browserClass );" +
        "if( !btn ) return false;" +
        "btn.onclick = function DS_FULLSCREEN_HACK() { console.log( 'fullscreen' ); };" +
        "return true;" +
        "})();";
    web.Execute(inject);

    // Notes:
    // 1. web.Execute callback gets null parameter if there is an error.
    // 2. web.Execute won't fire OnError callback  if there is an error.
}

// Does nothing.
function DoNothing() {
    return undefined;
}

function OpenInYoutubeApp(val, btnTxt) {

    var url = web.GetUrl();
    var search = "/watch?v=";
    var videoId = url.substr(url.indexOf(search) + search.length);
    app.SendIntent("com.google.android.youtube", null, "android.intent.action.VIEW", null, "vnd.youtube:" + videoId);

}
function selectOptions(choice){
    if(choice === 'Read Page'){
        app.ShowPopup('Not Available Yet')
    }
    if(choice === 'Remove Paywall'){
        let content = web.GetUrl();
        let removePaywall = 'https://removepaywall.com/';
        let article = removePaywall+content;
        customTab = app.CreateCustomTabs();
        customTab.OpenUrl(article);
    }
    if(choice === 'View Security'){
        
    }
}

function ReaderView() {
    try {
        "for(var i =0; i < elementsToRemove.length; i++) { ",
        "elementsToRemove[i].remove(); ",
        "} ",
        'document.body.style.backgroundColor = "white"; ',
        'document.body.style.color = "black"; ',
        'document.body.style.fontSize = "1.2em"; ',
        'document.body.style.lineHeight = "1.5em"; ',
        'document.body.style.margin = "1em"; ',
        web.Execute('document.querySelectorAll("footer,aside,form,script,button,nav,bottom-nav,mw-panel-toc,mw-header,vector-sitenotice-container,mw-panel-toc,headline__footer,ad-slot-top").forEach(e=>e.remove());document.body.style.backgroundColor="white";document.body.style.color="black";document.body.style.fontSize="1.2em";document.body.style.lineHeight="1.5em";document.body.style.margin="1em"; ');
    }
    catch (t) {
        panel.Dismiss(), toast = app.CreatePopUp(), toast.SetType("toast"), toast.SetText("[fa-info-circle] No  Resource Loaded", "Bottom"), toast.SetMargins(0.05, 0.02, 0.05, 0.1), toast.Align("bottom"), toast.SetColor("#262628"), toast.Duration("short"), toast.AnimateIn(""), toast.AnimateOut(""), toast.Show();
    }
}

function GetContentLang() {
    try {
        web.Execute("document.documentElement.lang", TranslateContent);
    } catch (t) {
        panel.Dismiss(), toast = app.CreatePopUp(), toast.SetType("toast"), toast.SetText("[fa-info-circle] No  Resource Loaded", "Bottom"), toast.SetMargins(0.05, 0.02, 0.05, 0.1), toast.Align("bottom"), toast.SetColor("#262628"), toast.Duration("short"), toast.AnimateIn(""), toast.AnimateOut(""), toast.Show();
    }
}

function TranslateContent(t) {
    let e = "https://translate.google.com/translate?sl=auto&tl=" + t + "&u=" + web.GetUrl();
    web.LoadUrl(e) || panel.Dismiss();
}

function ShareContent() {
    var t = [{
        name: T("Other"),
        icon: "more_vert",
        color: "#9c27b0"
    }, {
        name: T("Copy"),
        icon: "content_copy",
        color: "#f44336"
    }, {
        name: T("As Document"),
        icon: "library_books",
        color: "#4285f4"
    }];
    lsd = MUI.CreateListDialog(T("Share"), t, null, !0), lsd.SetOnSelect(shareOpt), panel.Dismiss(), lsd.Show();
}

function shareOpt(option) {
    try {
        var url = web.GetUrl();
        if (option === "Copy") {
            app.SetClipboardText(url);
            var popup = app.CreatePopUp();
            popup.SetType("toast");
            popup.SetText("[fa-info-circle] Link Copied To Clipboard", "Bottom");
            popup.SetMargins(0.05, 0.02, 0.05, 0.1);
            popup.Align("bottom");
            popup.SetColor("#262628");
            popup.Duration("short");
            popup.AnimateIn("");
            popup.AnimateOut("");
            popup.Show();
        } else if (option === "Other") {
            app.SendText(url, web.GetTitle(), "Choose an app");
        }
    } catch (error) {
        if (app.IsTablet() === 1) {
            app.ShowPopup("Link Copied To Clipboard", "Bottom");
        } else {
            app.SetClipboardText('https://asteroid.data.blog/');
            var popup = app.CreatePopUp();
            popup.SetType("toast");
            popup.SetText("[fa-info-circle] Link Copied To Clipboard", "Bottom");
            popup.SetMargins(0.05, 0.02, 0.05, 0.1);
            popup.Align("bottom");
            popup.SetColor("#262628");
            popup.Duration("short");
            popup.AnimateIn("");
            popup.AnimateOut("");
            popup.Show();
        }
    }
    try {
        if (option === "As Document") {
            web.Print();
        }
    } catch (error) {
        var popup = app.CreatePopUp();
        popup.SetType("toast");
        popup.SetText("[fa-info-circle] No Resource Loaded", "Bottom");
        popup.SetMargins(0.05, 0.02, 0.05, 0.1);
        popup.Align("bottom");
        popup.SetColor("#262628");
        popup.Duration("short");
        popup.AnimateIn("");
        popup.AnimateOut("");
        popup.Show();
    }
}

function goToHome() {
    try {
        app.DestroyLayout(layWeb) || web.ClearHistory() || layHome.Show();
    } catch (err) {
        console.log('goToHome Error' + err)
    }
    app.SetStatusBarColor('black')
}

function webReload() {
    try {

        let url = web.GetUrl();
        web.LoadUrl(url) || panel.Dismiss();
        popup = app.CreatePopUp();
        popup.SetText("[fa-info-circle] Reloading Page:");
        popup.SetMargins(0, 0.02, 0, 0)
        popup.Align('bottom');
        popup.Duration("short");
        popup.Show();

    } catch (err) {}

}

function closeReloadAlet() {
    reloadInfo.Hide();
}

function isTelScheme(url) {
    const telPattern = /^tel:/i;
    return telPattern.test(url);
}

function isMailToScheme(str) {
    const mailtoPattern = /^mailto:/i;
    return mailtoPattern.test(str);
}

function extractTel(url) {
    const telPattern = /^tel:(\+?\d+)/i;
    const match = url.match(telPattern);
    if (match) {
        return match[1];
    } else {
        return null;
    }
}

function extractEmail(url) {
    const mailtoPattern = /^mailto:(.+)/i;
    const match = url.match(mailtoPattern);
    if (match) {
        return match[1];
    } else {
        return null;
    }
}

function extractSubject(url) {
    const mailtoPattern = /^mailto:([^?]+)\?(.*)$/i;
    const match = url.match(mailtoPattern);
    if (match) {
        const subjectParamPattern = /subject=([^&]+)/i;
        const subjectParamMatch = match[2].match(subjectParamPattern);
        if (subjectParamMatch) {
            return decodeURIComponent(subjectParamMatch[1].replace(/\+/g, ' '));
        }
    }
    return null;
}

function extractBody(url) {
    const mailtoPattern = /^mailto:([^?]+)\?(.*)$/i;
    const match = url.match(mailtoPattern);
    if (match) {
        const bodyParamPattern = /body=([^&]+)/i;
        const bodyParamMatch = match[2].match(bodyParamPattern);
        if (bodyParamMatch) {
            return decodeURIComponent(bodyParamMatch[1].replace(/\+/g, ' '));
        }
    }
    return null;
}

function isSmsScheme(str) {
    const smsPattern = /^sms:/i;
    return smsPattern.test(str);
}

function extractSmsNumber(str) {
    const smsPattern = /^sms:(\+?\d+)/i;
    const match = str.match(smsPattern);
    if (match) {
        return match[1];
    }
    return null;
}

function extractSmsBody(str) {
    const smsPattern = /^sms:(\+?\d+)(\?.*)?$/i;
    const match = str.match(smsPattern);
    if (match) {
        const queryParamPattern = /body=([^&]+)/i;
        const queryParamMatch = match[2] && match[2].match(queryParamPattern);

        if (queryParamMatch) {
            return decodeURIComponent(queryParamMatch[1].replace(/\+/g, ' '));
        }
    }
    return null;
};

function webOnConsole(msg) {
    if (msg === "fullscreen") {
        var msg = "FullScreen Not Available";
        ynd = MUI.CreateDialog(msg, "Do you want to open the video in the youtube app?", "YES");
        ynd.SetOnTouch(OpenInYoutubeApp);
        ynd.Show();
    }
}

function webOnError(err) {
    if (err === 'ERR_INTERNET_DISCONNECTED') {
        web.LoadUrl('noInternet.html')
    }
    if (err === 'ERR_FILE_NOT_FOUND' && hasTel(web.GetUrl())) {
        app.Call(extractPhoneNumber(web.GetUrl())) || web.Back();
    }
    
}

function hasTel(url) {
    return url.startsWith('tel:');
}

function extractPhoneNumber(link) {
    const urlStartIndex = link.indexOf('tel:');
    if (urlStartIndex !== -1) {
        const url = link.slice(urlStartIndex);
        const phoneNumber = url.slice(4); // Remove the 'tel:' prefix
        return phoneNumber;
    }
    return null;
}


function webOnBack() {
    try {
        if (web.CanGoBack()) web.Back();
        else {
            goToHome();
            currentDomain = '#.cv';
        }
        getThemeColor(web.GetUrl())
    } catch (err) {
        goToHome();
    }

}

function webOnForward() {
    try {
        getThemeColor(web.GetUrl())
        if (web.CanGoForward()) web.Forward();
        else toasta = app.CreatePopUp(), toasta.SetType("toast"), toasta.SetText("[fa-info-circle] No Foward History Yet", "Bottom"), toasta.SetMargins(0.05, 0.02, 0.05, 0.1), toasta.Align("bottom"), toasta.SetColor("#262628"), toasta.Duration("short"), toasta.AnimateIn(""), toasta.AnimateOut("slidetoright"), toasta.Show();

    } catch (err) {
        toasta = app.CreatePopUp(), toasta.SetType("toast"), toasta.SetText("[fa-info-circle] No Foward History Yet", "Bottom"), toasta.SetMargins(0.05, 0.02, 0.05, 0.1), toasta.SetColor("#262628"), toasta.Duration("short"), toasta.AnimateIn(""), toasta.AnimateOut("slidetoright"), toasta.Show();

    }


}

function OnBack() {
    try {
        if (layHome.IsVisible()) ExitApp();
        if (layWeb.IsVisible() && web.CanGoBack()) webOnBack();
    } catch (err) {
        console.log(err);
    }
    if(editUrl.GetVisibility()==='Show'){
        hideBar()
    }
}

function ExitApp() {
    app.Exit();
}