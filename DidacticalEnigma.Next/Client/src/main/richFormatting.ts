export function generateHtmlFromRichFormatting(rawInputDocument : string) {
    const doc = new DOMParser().parseFromString(rawInputDocument, "application/xml");
    if(doc.getElementsByTagNameNS("http://www.mozilla.org/newlayout/xml/parsererror.xml", "parsererror").length !== 0) {
      throw "invalid document";
    }
    const result = document.createElement("div");
    for(const el of doc.getElementsByTagName("root")[0].children) {
      if(el.tagName == "link") {
        const pElement = document.createElement("p");
        const aElement = document.createElement("a");
        const target = el.getAttribute("target");
        const text = el.getAttribute("text");
        if(!target || !text) {
          continue;
        }
        aElement.setAttribute("href", target);
        aElement.innerText = text;
        pElement.appendChild(aElement);
        result.appendChild(pElement);
      }
      if(el.tagName == "par") {
        const pElement = document.createElement("p");
        for(const span of el.children) {
          if(span.tagName == "span") {
            const spanElement = document.createElement("span");
            const fontSize = span.getAttribute("fontSize");
            switch(fontSize) {
              case "ExtraSmall":
                spanElement.classList.add("textelement-extrasmall")
                break;
              case "Small":
                spanElement.classList.add("textelement-small")
                break;
              case "Medium":
                spanElement.classList.add("textelement-medium")
                break;
              case "Normal":
                spanElement.classList.add("textelement-normal")
                break;
              case "Large":
                spanElement.classList.add("textelement-large")
                break;
              case "ExtraLarge":
                spanElement.classList.add("textelement-extralarge")
                break;
              case "Humonguous":
                spanElement.classList.add("textelement-humonguous")
                break;
            }
            const fontName = span.getAttribute("fontName");
            switch (fontName) {
              case "kanji":
                spanElement.classList.add("kanjifont")
                break;
            }
            const emphasis = span.getAttribute("emphasis");
            if(emphasis === "true") {
              spanElement.classList.add("textelement-emphasis");
            }
            const text = span.textContent;
            if(text) {
              spanElement.innerText = text;
            }
            
            pElement.appendChild(spanElement);
          }
        }
        result.appendChild(pElement);
      }
    }
  
    return result;
  }