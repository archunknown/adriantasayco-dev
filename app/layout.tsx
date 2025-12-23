import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <main>{children}</main>
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  )
}