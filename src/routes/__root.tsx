import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import { MotionConfig } from "framer-motion";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  Cursor,
  PageEnter,
  Preloader,
  RouteCurtain,
  ScrollProgress,
  SmoothScroll,
} from "@/components/site/Transitions";

const SITE_URL = "https://jakindustries.net";

// Business details Google reads for search results and the knowledge panel.
const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": `${SITE_URL}/#organization`,
  name: "JAK Industries",
  url: SITE_URL,
  logo: `${SITE_URL}/jak/logo-jak.png`,
  image: `${SITE_URL}/og-image.jpg`,
  description:
    "ISO-certified heavy fabrication of wind turbine components and pollution control equipment in Chennai since 2004.",
  foundingDate: "2004",
  telephone: "+91-72999-87393",
  email: "jakindustries2007@yahoo.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "28/A, New Street, Arjuna Nagar, Thirumullaivoyal",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    postalCode: "600062",
    addressCountry: "IN",
  },
  areaServed: "IN",
  knowsAbout: ["Wind turbine components", "Heavy fabrication", "Pollution control equipment", "Hot-dip galvanizing"],
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Never add og:image or twitter:image here: every page would inherit it.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "JAK Industries | Heavy Fabrication for Wind & Pollution Control" },
      {
        name: "description",
        content:
          "JAK Industries, Chennai: ISO-certified heavy fabrication of wind turbine components and pollution control equipment since 2004.",
      },
      { name: "author", content: "JAK Industries" },
      { property: "og:title", content: "JAK Industries | Heavy Fabrication for Wind & Pollution Control" },
      {
        property: "og:description",
        content: "ISO-certified heavy fabrication of wind turbine components and pollution control equipment since 2004.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "JAK Industries" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#f6f6f2" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&family=Unbounded:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className="light" suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before first paint so there is no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="dark"){var c=document.documentElement.classList;c.remove("light");c.add("dark")}}catch(e){}`,
          }}
        />
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }} />
      </head>
      <body className="grain">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <SmoothScroll />
        <ScrollProgress />
        <Preloader />
        <RouteCurtain />
        <Cursor />
        <Header />
        <main>
          <PageEnter>
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </PageEnter>
        </main>
        <Footer />
      </MotionConfig>
    </QueryClientProvider>
  );
}
