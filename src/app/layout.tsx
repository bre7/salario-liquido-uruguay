import generatedGitInfo from "#generated/git-info.json"
import type { Metadata } from "next"
import Image from "next/image"
import React from "react"
import GithubImage from "./assets/githubLogo.svg"
import { BPC } from "./data/constants"
import "./index.scss"
import reportWebVitals from "./reportWebVitals"

// replace console.* for disable log on production
if (process.env.NODE_ENV === "production") {
  console.log = () => {}
  console.debug = () => {}
  // console.error = () => {}
  // console.warn = () => {}
}

export const metadata: Metadata = {
  title: "Salario líquido Uruguay",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-UY">
      <body>
        <div className="App">
          <div className="content">
            <header className="title">
              <h1 className="title-text">
                Salario líquido Uruguay{" "}
                <span className="anio">
                  {Array.from(BPC.keys()).sort((a: number, b: number) => b - a)[0]}
                </span>
              </h1>
            </header>
            <main>{children}</main>
          </div>
          <footer className="footer">
            <div className="footer-about">
              <span className="footer-txt autor">
                Creado por{" "}
                <a
                  className="autor-link"
                  href="https://www.linkedin.com/in/ismaelpadilla/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ismael Padilla
                </a>{" "}
                <a
                  className="autor-link"
                  href="https://github.com/bre7/salario-liquido-uruguay"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  et al
                </a>
                .
              </span>
              <span className="footer-txt ultimaActualizacion">
                #{generatedGitInfo?.gitCommitHash}
              </span>
            </div>
            <a
              href="https://github.com/bre7/salario-liquido-uruguay"
              aria-label="Source code"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={GithubImage}
                alt="Github logo"
                className="githubLogo"
                height="40"
                width="40"
              />
            </a>
          </footer>
        </div>
      </body>
    </html>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (typeof window !== "undefined") {
  reportWebVitals(console.log)
}
// reportWebVitals((metric) => {
//   // @ts-ignore
//   window.gtag("event", "web_vitals", {
//     eventCategory: "Web Vitals",
//     eventAction: metric.name,
//     eventValue: Math.round(metric.name === 'CLS' ? metric.value * 1_000 : metric.value), // values must be integers
//     eventLabel: metric.id, // id unique to current page load
//     nonInteraction: true, // avoids affecting bounce rate
//   })
// })
