## ʻŌlelo Honua with Remix

Looking to make your Remix application multilingual? ʻŌlelo Honua simplifies localization, allowing you to manage and sync translations effortlessly. Follow these steps to enable seamless internationalization in your Remix project.

Steps:

1. Install ʻŌlelo Honua CLI

   Run the following command to install the CLI globally:

   ```bash
   npm install -g npx && npx --yes olelo-honua
   ```

2. Initialize Localization in Your Remix Project

   Inside your Remix project directory, run:

   ```bash
   npx olelo-honua init
   ```

This will generate a localization folder with default translation files.

3. Configure Localization in remix.config.js

   Modify your remix.config.js to define supported languages:

   ```js
   module.exports = {
     future: {},
     serverModuleFormat: "cjs",
     i18n: {
       locales: ["en", "es", "fr", "de"], // Add your desired languages
       defaultLocale: "en",
     },
   };
   ```

4. Create a Language Switcher Component

   Use Remix’s useFetcher to switch locales dynamically:

   ```js
   import { useFetcher } from "@remix-run/react";
   import { useLocation } from "react-router-dom";

   export function LanguageSwitcher() {
     const fetcher = useFetcher();
     const location = useLocation();

     const changeLanguage = (lang) => {
       fetcher.submit(
         { locale: lang },
         { method: "post", action: location.pathname },
       );
     };

     return (
       <div>
         <button onClick={() => changeLanguage("en")}>English</button>
         <button onClick={() => changeLanguage("es")}>Español</button>
       </div>
     );
   }
   ```

5. Load Translations in Remix Loaders

   Modify your route loaders to include translations:

   ```js
   import translations from "../locales/en.json"; // Load dynamically based on locale

   export async function loader({ request }) {
     const url = new URL(request.url);
     const locale = url.searchParams.get("locale") || "en";

     return { translations: translations[locale] || translations["en"] };
   }
   ```

6. Sync Translations

   Whenever you update your translations, run:

   ```bash
   npx olelo-honua sync
   ```

This ensures your translation files stay updated.
