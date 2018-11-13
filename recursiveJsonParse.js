function isDigit (c) {
    return ("1234567890".indexOf(c) > -1);
}

function parseArrayElement(str, i, type) {
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

function parseArray (str, i) {
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
            obj = parseArrayElement(str, i , "number");
            res.push(obj.arrayElement);
            i = obj.index;
        }
        else if (c === "[") {
            obj = parseArray(str, i+1);
            res.push(obj.arrayElement);
            i = obj.index;
        }
        else if (c === "'") {
            obj = parseArrayElement(str, i+1, "string");
            res.push(obj.arrayElement);
            i = obj.index;
        }
        else if (c === "{") {
            obj = parseJson(str, i+1);
            res.push(obj.element);
            i = obj.index;
        }
        else {
            throw "Wrong syntax for array at " + i +" position"
        }
    }
    
    throw "Syntax Error";
}

function parseNumber (str, i) {
    let e = "";
    while (i < str.length && str[i]!="," && str[i]!="}" && str[i]!="]") {
        e += str[i];
        i++;
    }
    return {
        "element": parseInt(e,10),
        "index": i
    }
}
function parseString(str, i) {
    let e = "";
    while (str[i] != "'") {
        e += str[i];
        i++;
    }
    return {
        "element": e,
        "index": i+1
    }
}
function parseJson (str, i) {
    let isAttribute = true;
    let attribute = "";
    let value = "";
    let res = {};
    while (i < str.length) {
        let c = str[i];
        if (c === "'") {
            if (isAttribute) {
                let attributeObj = parseString(str,i+1);
                attribute = attributeObj.element;
                i = attributeObj.index;
            }
            else {
                let valueObj = parseString(str,i+1);
                value = valueObj.element;
                i = valueObj.index;
                res[attribute] = value;
            }
        }
        else if (isDigit(c)) {
            let numObj = parseNumber(str,i);
            value = numObj.element;
            i = numObj.index;
            res[attribute] = value;

        }
        else if (c === ":") {
            isAttribute = false;
            i++;
        }
        else if (c === ",") {
            isAttribute = true;
            i++;
        }
        else if (c === "}") {
            return {
                "element": res,
                "index": i+1
            }
        }
        else if (c === "{") {
            let jsonObj = parseJson(str,i+1);
            value = jsonObj.element;
            i = jsonObj.index;
            res[attribute] = value;
        }
        else if (c === "[") {
            let arrayObj = parseArray(str,i+1);
            value = arrayObj.arrayElement;
            i = arrayObj.index;
            res[attribute] = value;
        }
    }
}

let sampleJsonObjs = [
    "{}",
    "{'num_value':12}",
    "{'str_value':'hello...'}",
    "{'obj_value':{'child':{'test':'OK'}}}",
    "{'name':'Mr.ABC','contact':{'phone':{'mobile':123,'home':789},'email':'xyz@gmail.com'}}",
    "{'users':[1,2,3,'hello',['abc',{'name':'hello','phoneNumbers':[12,13]}]]}"
];

sampleJsonObjs.forEach(a=>console.log(JSON.stringify(parseJson(a,1))));
