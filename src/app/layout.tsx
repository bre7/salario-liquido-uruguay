import generatedGitInfo from "#generated/git-info.json"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import classNames from "classnames"
import type { Metadata } from "next"
import Image from "next/image"
import React from "react"
import GithubImage from "./assets/githubLogo.svg"
import { BPC } from "./data/constants"
import styles from "./index.module.scss"
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-UY">
      <body className={styles.body}>
        <div className={styles.App}>
          <div className={styles.content}>
            <header className={styles.title}>
              <h1 className={styles.titleText}>
                Salario líquido Uruguay{" "}
                <span className={styles.anio}>
                  {Array.from(BPC.keys()).sort((a: number, b: number) => b - a)[0]}
                </span>
              </h1>
            </header>
            <main className={styles.main}>{children}</main>
          </div>
          <footer className={styles.footer}>
            <div className={styles.footerAbout}>
              <span className={classNames(styles.footerTxt, styles.autor)}>
                Creado por{" "}
                <a
                  className={styles.autorLink}
                  href="https://www.linkedin.com/in/ismaelpadilla/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ismael Padilla
                </a>{" "}
                <a
                  className={styles.autorLink}
                  href="https://github.com/bre7/salario-liquido-uruguay"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  et al
                </a>
                .
              </span>
              <span className={classNames(styles.footerTxt, styles.ultimaActualizacion)}>
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
                className={styles.githubLogo}
                height="40"
                width="40"
              />
            </a>
          </footer>
        </div>

        <SpeedInsights />
        <Analytics />
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
