// layout.js

export const metadata = {
  title: "Store example using zambool",
  description: "Example for zambool",
};

const CONTENT_URL =
  "https://zambool-store-933344993326-ap-south-1-an.s3.ap-south-1.amazonaws.com/content";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href={`${CONTENT_URL}/reset.css`}
        />
        <link
          rel="stylesheet"
          href={`${CONTENT_URL}/store.css`}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
