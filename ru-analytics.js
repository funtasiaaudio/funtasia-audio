/* Russian localization experiment. Tracks page visits and outbound download CTA clicks, not completed downloads. */
(() => {
  const lang = (document.documentElement.lang || "").toLowerCase();
  if (lang !== "ru") return;
  const section = document.body?.getAttribute("data-ru-site-section") || "other";
  if (typeof gtag === "function") {
    gtag("event", "ru_localized_page_view", {language: "ru", site_section: section});
  }
  document.querySelectorAll("a[data-ru-download]").forEach(link => {
    link.addEventListener("click", () => {
      if (typeof gtag === "function") {
        gtag("event", "ru_download_click", {
          language: "ru",
          site_section: section,
          product_name: link.getAttribute("data-ru-download") || "unknown",
          link_url: link.href
        });
      }
    });
  });
})();
