const key = "d1e397ae431b4768a453ce4a5ae26a93";
const img_placeholder = `https://placehold.co/300x180?text=no+preview\\nimg+available+:(`;
// (backslash muss doppelt sein damit js ihn als pagebreak erkennt)

// - fetch url variables
let q = "";
let language = "";
let sort_by = "";
let page_size = 60;

let keyword = document.getElementById("keyword");
let language_code = document.getElementById("lanInput");
let sort = document.getElementById("sortInput");

let fetch_url = "";

// - button click function
submitButton.addEventListener("click", () => {
  document.querySelector(".content-gallery").innerHTML = ""; // vorherige suchergebnisse löschen

  //   - variablen die input values zuordnen & fetch link aktualisieren
  q = encodeURIComponent(keyword.value); // url encoding für eingabe von mehreren wörtern
  language = language_code.value;
  sort_by = sort.value;

  fetch_url = `https://newsapi.org/v2/everything?q=${q}&language=${language}&sortBy=${sort_by}&pageSize=${page_size}&apiKey=d1e397ae431b4768a453ce4a5ae26a93`;

  // - fetch function auslösen
  fetchData();

  //   button style beim klicken

  submitButton.style.backgroundColor = "darkslategrey";
  setTimeout(() => {
    submitButton.style.backgroundColor = "";
  }, 100);
});

// - API fetch

const fetchData = () => {
  // check ob suchbegriff eingegeben wurde:
  if (q) {
    fetch(fetch_url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.articles); // array mit den beiträgen

        // - data processing

        data.articles.forEach((article) => {
          let title = article.title;
          let description = article.description;
          let img_url = article.urlToImage;
          let source_url = article.url;

          //   console.log({ article });

          // - output

          // * container für die einzelnen beiträge
          let gallery_item = document.createElement("article");

          // * headline
          let headline = document.createElement("h2");
          headline.textContent = title;
          gallery_item.appendChild(headline);

          //  * description
          let topic = document.createElement("p");
          topic.textContent = description;
          gallery_item.appendChild(topic);

          // * image
          let image = document.createElement("img");
          if (img_url) {
            image.setAttribute("src", img_url);
          } else {
            image.setAttribute("src", img_placeholder);
          }

          image.setAttribute("alt", "article image");
          gallery_item.appendChild(image);

          // * link zur news source
          let button = document.createElement("button");
          button.textContent = "Zum Artikel";
          button.addEventListener("click", () => {
            window.open(source_url);
          });
          gallery_item.appendChild(button);

          // * sortieren der ergebnisse ohne img_url ans ende (vermutlich paywall)
          data.articles.sort((a, b) => {
            // wenn img_url von a null ist und von b nicht, dann wird a nach hinten sortiert
            if (a.urlToImage === null && b.urlToImage !== null) {
              return 1;
            }
            // wenn img_url von a nicht null ist, dann vice versa
            else if (a.urlToImage !== null && b.urlToImage === null) {
              return -1;
            }
            // wenn beide gleich keine änderung
            else {
              return 0;
            }
          });

          // * fertige elemente ins html einfügen
          document.querySelector(".content-gallery").appendChild(gallery_item);

          inputError.innerHTML = ""; // error reset wenn eingabe korrekt war
        });
      })
      //
      // * error handling
      .catch((error) => {
        console.error("Fehler beim laden der Daten", error);
      });
  } else {
    inputError.innerHTML = "Fehler. Bitte Suchbegriff eingeben!";
  }
};
