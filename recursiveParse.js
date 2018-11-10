function isDigit (c) {
    return ("1234567890".indexOf(c) > -1);
}
function parseElement(str, i) {
    let e = "";
    while(str[i] != "," && str[i] != "]" && str[i] != "}") {
        e += str[i];
        i++;
    }
    return {
        arrayElement: parseInt(e,10),
        index : i
    };
}


function arrayParse (str, i) {
    i = i || 1;
    let res = [];
    let obj = {}
    while (str && i < str.length) {
        c = str[i];
        if (c === "]") {
            console.log(res);
            return {
                arrayElement: res,
                index: i+1
            };
        }
        else if (c===",") {
            i++;
        }
        else if (isDigit(c)) {
            obj = parseElement(str, i);
            res.push(obj.arrayElement);
            i = obj.index;
        }
        else if (c === "[") {
            obj = arrayParse(str, i+1);
            res.push(obj.arrayElement);
            i = obj.index;
        }
        else {
            let {arrayElement, rest} = parseElement(str.substring(i), "string");
            str = rest;
            res.push(arrayElement);
        }
    }
    
}

let arrayExamples = [
    "[[12,13,[1,2,3,[4],5]],1]"
];

arrayExamples.forEach(a=>console.log(JSON.stringify(arrayParse(a,1))));
