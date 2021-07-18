let gallery = document.getElementById("gallery");
let total_pages = 1;
let page_number = 0;
let per_page = 20;
let term = "cats";

const light_gallery = lightGallery(gallery, {
  autoplayFirstVideo: false,
  pager: false,
  plugins: [lgZoom, lgThumbnail],
  mobileSettings: {
    controls: false,
    showCloseIcon: true,
    download: false,
    rotate: false,
  },
});

const getImages = () => {
  fetch(
    `https://api.unsplash.com/search/photos?client_id=04902b80294822aa86dbe5c57ee47e1c1f0e8a0f0f360979746970a1239001dd&query=${term}&per_page=${per_page}&page=${page_number}`
  )
    .then((response) => {
      response.json().then((data) => {
        total_pages = data.total_pages;

        data.results.forEach((item) => {
          let anchor = document.createElement("a");
          anchor.setAttribute("data-src", `${item.urls.regular}`);
          let img = document.createElement("img");
          img.setAttribute("src", `${item.urls.small}`);
          img.setAttribute("alt", `${item.description}`);
          anchor.appendChild(img);
          gallery.appendChild(anchor);
        });
        $("#gallery").justifiedGallery("norewind");
      });
    })
    .catch((err) => console.log(err));
};

$("#gallery")
  .justifiedGallery({
    rowHeight: 260,
    captions: false,
    margins: 5,
  })
  .on("jg.complete", () => {
    light_gallery.refresh();
  });

// Observer for lazy load
const observer_options = { root: null, threshold: 0.25, rootMargin: "400px" };
const observer_callback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      page_number++;
      if (page_number <= total_pages) {
        getImages();
      }
    }
  });
};
let observer = new IntersectionObserver(observer_callback, observer_options);

observer.observe(document.getElementById("loader"));
