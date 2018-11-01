function cleanString(str) {
    return str.substring(1,str.length - 1);
}

function parseSimpleJson(str) {
    var res = {};
    let tmp = str.substring(1,str.length-1).split(",");
    tmp.forEach(e => {
        let o = e.split(":");
        let attribute = cleanString(o[0]);
        res[attribute] = parseType(o[1]); 
    });
    return res;
}

function parseType(str) {
    if (!str) {
        return null;
    }
    if (isDigit(str[0])) {
        return parseNumber(str);
    }
    else if (str[0]=="'") {
        return cleanString(str);
    }
    else {
        return str;
    }
}

function isDigit(c) {
    let allDigits = "0123456789";
    return (allDigits.indexOf(c) != -1);
}

function parseNumber(str) {
    return parseInt(str,10);
}

function getAllNestedJsonPositions(str) {
    let left = 0;
    let right = str.length-1;
    let res = [];
    while (left < right) {
        while (left < str.length && str.charAt(left) != "{") {
            left += 1;
        }
        while (right >= 0 && str.charAt(right) != "}") {
            right -= 1;
        }
        if(right >= 0 && left < str.length - 1) {
            res.unshift({
                "start": left,
                "end": right
            });
        }

        left += 1;
        right -= 1;
    }
    return res;
}

function getRandomNumberBelow(r) {
    return Math.floor(Math.random() * r);
}
function getRandomChar () {
    let n = getRandomNumberBelow(26);
    if (getRandomNumberBelow(2) === 0) {
        return String.fromCharCode(65 + n);
    }
    else {
        return String.fromCharCode(97 + n);
    }
}

function getRandomStringOfSize(n) {
    let res = "";
    for(let i=1;i<=n;i++){
        res += getRandomChar();
    }
    return res;
}

function parseJson(str) {
    let nestedJsonPositions = getAllNestedJsonPositions(str);
    if (nestedJsonPositions.length === 1) {
        return parseSimpleJson(str);
    }
    let hashedObjects = {};
    let finalHash;
    nestedJsonPositions.forEach(function(pos) {
        let simpleJsonString = str.substring(pos.start, pos.end + 1);
        let simpleJsonObj = parseSimpleJson(simpleJsonString);
        let hash = getRandomStringOfSize(simpleJsonString.length);
        hashedObjects[hash] = simpleJsonObj;
        finalHash = hash;
        str=str.replace(simpleJsonString, hash);
    });
    let compressedJson = hashedObjects[finalHash];

    Object.keys(compressedJson).forEach(function(key){
        if(Object.keys(hashedObjects).indexOf(compressedJson[key]) != -1) {
            compressedJson[key] = hashedObjects[compressedJson[key]];
        }
    });

    return (compressedJson);
}

var testJson3 = "{'name':'ravi','age':23,'contact':{'phone':7893,'email':'krt@gmail.com'}}";

let sampleJsonStrings = [
    "{'name':'ravi','age':23,'contact':{'phone':7893,'email':'krt@gmail.com'}}",
    "{'name':'ravi'}",
    "{'age':24}",
    "{'pool':{'size':30}}",
    "{}"
]

sampleJsonStrings.forEach(s=>console.log(parseJson(s)));

