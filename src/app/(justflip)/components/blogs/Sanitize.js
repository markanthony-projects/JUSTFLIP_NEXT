import DOMPurify from "isomorphic-dompurify";

export function sanitizeHTML(html = "") {
  let cleanHTML = DOMPurify.sanitize(html);

  if (typeof window === "undefined") {
    return cleanHTML.replace(
      /<a /g,
      '<a class="font-bold underline" target="_blank" rel="noopener noreferrer" '
    );
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanHTML, "text/html");

  doc.querySelectorAll("a").forEach((a) => {
    a.classList.add("font-bold", "underline");
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
  });

  return doc.body.innerHTML;
}