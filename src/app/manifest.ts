import type { MetadataRoute } from "next";

/** Web app manifest: name, colours and icons when the site is saved to a phone's home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mohamed Elsaeed – Interior Design & Finishing, Tanta",
    short_name: "M. Elsaeed",
    description: "Interior design and finishing engineer in Tanta, Egypt.",
    start_url: "/",
    display: "browser",
    background_color: "#1d1f1c",
    theme_color: "#1d1f1c",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  };
}
