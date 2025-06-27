import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";
import Provider from "./Provider";

export const metadata = {
  title: "MathKraft",
  description: "Discover the joy of math learning with the world's first AI + coach solution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased light">
        <ConvexClientProvider>
          <Provider>{children}</Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
