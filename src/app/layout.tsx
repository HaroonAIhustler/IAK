import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "AI Growth Studio - Resume Visibility Score",
  description: "Resume Visibility Check by AI Growth Studio"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-55H2MPM8');`}
        </Script>
        <Script
          src="https://link.desinelabs.com/js/external-tracking.js"
          data-tracking-id="tk_20528733b6e7433cbc38044d10dda053"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-55H2MPM8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
