/* ----- DEBUG OUTPUT FUNCTIONS ------*/
function log(arguments) {
  if (DEBUG) {
  	GM_log("Log: " + arguments);
  }
}
function warn(arguments) {
  if (DEBUG) {
    GM_log("Warning: " + arguments);
  }
}
function error(arguments) {
  if (DEBUG) {
    GM_log("Error: " + arguments);
  }
}
/* USAGE: createElement('table',{style:"border-collapse:seperate;"});append(image_table,dummy_images); */
function createElement(type, attributes){
	var node = document.createElement(type), attr;
	for (attr in attributes) if (attributes.hasOwnProperty(attr)){
		node.setAttribute(attr, attributes[attr]);
	}
	return node;
}
function createElementIn(type, attributes, toThis){	
	var node = createElement(type, attributes);
	if (toThis){
		append(node, toThis);
	}
	return node;
}

function append(thisElement, toThis){
	return toThis.appendChild(thisElement);
}



function fillTemplate(mapping, template){
    var j, dummy;
	for(j = 0 ; j<mapping.length ; j++){
		template = template.replace(new RegExp("###"+mapping[j][0]+"###","g"),mapping[j][1]);
	}
	
	dummy = createElement('div');
	dummy.innerHTML = template
	return dummy.firstChild;
}

function trim (zeichenkette) {
  // Erst führende, dann Abschließende Whitespaces entfernen
  // und das Ergebnis dieser Operationen zurückliefern
  return zeichenkette.replace (/^\s+/, '').replace (/\s+$/, '');
}

// rot13.js from gc.com
function createROT13array() {
	var A = 0, C = [], D = "abcdefghijklmnopqrstuvwxyz", B = D.length;
	for (A = 0; A < B; A++) {
		C[D.charAt(A)] = D.charAt((A + 13) % 26)
	}
	for (A = 0; A < B; A++) {
		C[D.charAt(A).toUpperCase()] = D.charAt((A + 13) % 26).toUpperCase()
	}
	return C
}
function convertROT13String(C) {
	var A = 0, B = C.length, D = "";
	if (!rot13array) {
		rot13array = createROT13array()
	}
	for (A = 0; A < B; A++) {
		D += convertROT13Char(C.charAt(A))
	}
	return D
}
function convertROT13Char(A) {
	return (A >= "A" && A <= "Z" || A >= "a" && A <= "z" ? rot13array[A] : A)
}

function convertROTStringWithBrackets(C) {
	var F = "", D = "", E = true, A = 0, B = C.length;
	if (!rot13array) {
		rot13array = createROT13array()
	}
	for (A = 0; A < B; A++) {
		F = C.charAt(A);
		if (A < (B - 4)) {
			if (C.toLowerCase().substr(A, 4) == "<br/>") {
				D += "<br>";
				A += 3;
				continue
			}
		}
		if (F == "[" || F == "<") {
			E = false
		} else {
			if (F == "]" || F == ">") {
				E = true
			} else {
				if ((F == " ") || (F == "&dhbg;")) {
				} else {
					if (E) {
						F = convertROT13Char(F)
					}
				}
			}
		}
		D += F
	}
	return D
}

function DM2Dec(cor1, cor2){
	var x = parseFloat(cor1) + parseFloat(cor2) / 60;
	x = Math.round(x * 100000) / 100000;
	debug("DM2Dec:"+cor1+ "  " +cor2+" "+x);
	return x;
}

function Dec2DM(coord){
	var d = parseFloat(coord),
	m = Math.floor(((d - Math.floor(d)) * 60)*1000)/1000,
	d = Math.floor(d),
	coords = new Array();
	
	coords[0] = d;
	coords[1] = m;
	return coords;
}


/* TODO: remove this function */
function getElementsByAttribute(the_attribute, the_value, the_node) {
    var node_tags, results, i,j;
        if ( the_node == null )
             the_node = document;
             
             
    node_tags = the_node.getElementsByTagName('*');
	results = new Array();
	for (i=0, j=0; i<node_tags.length;i++) {
		if (node_tags[i].hasAttribute(the_attribute)) {
			if (node_tags[i].getAttribute(the_attribute) == the_value) {			
			  	results[j] = node_tags[i];
            	                j++;
			}
		}
	}
	return results;
}

/* TODO: remove this function */
function insertAfter( referenceNode, newNode )
{
    referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
}

/* Replace all  &,< and > with there HTML tag */
function encodeHtml(htmlString) {
	if(!htmlString) return "";
	return htmlString.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
} 

function xsdDateTime(date)
{
  function pad(n) {
	 var s = n.toString();
	 return s.length < 2 ? '0'+s : s;
  };

  var yyyy = date.getFullYear(),
      mm1  = pad(date.getMonth()+1),
      dd   = pad(date.getDate()),
      hh   = pad(date.getHours()),
      mm2  = pad(date.getMinutes()),
      ss   = pad(date.getSeconds());

  return yyyy +'-' +mm1 +'-' +dd +'T' +hh +':' +mm2 +':' +ss+'Z';
}


function post(url, data, cb) {
	log("---POST---");
	log(url);
	log(data);
	log("---/POST/---");

	GM_xmlhttpRequest({
		method: "POST",
		url: url,
		headers:{'Content-type':'application/x-www-form-urlencoded'},
		data:encodeURI(data),
		onload: function(xhr) { cb(xhr.responseText); }
	});
}

function dumpProps(obj, parent) {
    var i, msg;
	// Go through all the properties of the passed-in object
	for (i in obj) {
		// if a parent (2nd parameter) was passed in, then use that to
		// build the message. Message includes i (the object's property name)
		// then the object's property value on a new line
		if (parent) {msg = parent + "." + i + "\n" + obj[i]; } else {msg = i + "\n" + obj[i]; }
		GM_log(msg);
		//~ if (!confirm(msg)) { return; }
		// If this property (i) is an object, then recursively process the object
		//~ if (typeof obj[i] == "object") {
			//~ if (parent) { dumpProps(obj[i], parent + "." + i); } else { dumpProps(obj[i], i); }
		//~ }
	}
}

function appendScript(href, domNode) {

   var script = document.createElement("script");
   script.setAttribute("type", "text/javascript");
     if (href) {        script.setAttribute("src", href);
   }

   (domNode || head).appendChild(script);
     return script;
}
