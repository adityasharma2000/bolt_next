import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";
import Provider from "./Provider";

export const metadata = {
  title: "Volt",
  description: "Creted by Dastagir",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` antialiased`}>
        <ConvexClientProvider>
          <Provider>{children}</Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
