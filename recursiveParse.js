function isDigit (c) {
    return ("1234567890".indexOf(c) > -1);
}
function parseElement(str, i, type) {
    let e = "";
    let arrayElement;
    while(str[i] != "," && str[i] != "]" && str[i] != "}" && str[i]!="'") {
        e += str[i];
        i++;
    }
    switch (type) {
        case "number" :
            arrayElement = parseInt (e, 10);
            break;
        case "string" :
            arrayElement = e;
            i++;
            break;
        default :
            let typeException = (type) ? "element type not found" : "type is undefined";
            throw typeException;
    }
    return {
        "arrayElement": arrayElement,
        "index" : i
    };
}

function arrayParse (str, i) {
    let res = [];
    let obj = {}
    while (str && i < str.length) {
        c = str[i];
        if (c === "]") {
            // console.log(res);
            return {
                arrayElement: res,
                index: i+1
            };
        }
        else if (c === ",") {
            i++;
        }
        else if (isDigit(c)) {
            obj = parseElement(str, i , "number");
            res.push(obj.arrayElement);
            i = obj.index;
        }
        else if (c === "[") {
            obj = arrayParse(str, i+1);
            res.push(obj.arrayElement);
            i = obj.index;
        }
        else if (c === "'") {
            obj = parseElement(str, i+1, "string");
            res.push(obj.arrayElement);
            i = obj.index;
        }
        else {
            throw "Wrong syntax for array"
        }
    }
    
    throw "Syntax Error";
}

let arrayExamples = [
    "[[12,13,[1,2,3,[4],5]],1]",
    "[1,['hello',35,'37',34,5]]]"
];

arrayExamples.forEach(a=>console.log(JSON.stringify(arrayParse(a,1))));
