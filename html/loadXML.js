function loadXMLDoc(filename) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", filename, false);
    xhttp.send();

    if (xhttp.readyState === 4 && xhttp.status === 200) {
        let xmlDoc = xhttp.responseXML;
        let xmlObj = {};

        let nodes = xmlDoc.getElementsByTagName("*");
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let children = node.childNodes;
            let obj = {};

            for (let j = 0; j < children.length; j++) {
                let child = children[j];
                if (child.nodeType === 1) {
                    obj[child.nodeName] = child.textContent;
                }
            }

            if (xmlObj[node.nodeName]) {
                xmlObj[node.nodeName].push(obj);
            } else {
                xmlObj[node.nodeName] = [obj];
            }
        }

        return xmlObj;
    } else {
        console.error("Failed to load XML file:", xhttp.statusText);
        return null;
    }
}

let myXMLObject = loadXMLDoc("example.xml");
if (myXMLObject) {
    console.log(myXMLObject);
}
