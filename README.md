
# ☕ Espresso Edge - Your Perfect Brew Awaits

Welcome to **Espresso Edge**, a modern, immersive, and progressive web application designed to bring the rich experience of a high-end coffee shop right to your fingertips. Built with a cutting-edge tech stack, Espresso Edge offers a seamless and delightful user journey, from browsing our interactive menu to learning our story.

## ✨ Key Features

Espresso Edge is brewing with features designed to engage and satisfy:

*   ** captivating Homepage Hero:** A visually stunning welcome with an engaging video or animated background and a clear call-to-action.
*   **Highly Interactive Menu:** Explore coffees, pastries, and snacks with smooth hover effects, scroll animations, intuitive category filters, and a quick front-end search.
*   **Animated "Our Story" Page:** Discover the journey of Espresso Edge through an animated timeline and beautifully presented team introductions.
*   **Engaging Contact Form:** Reach out via an animated form with floating labels, real-time validation, and interactive social media icons.
*   **Dynamic & Sticky Navigation:** A persistent navbar with smooth scrolling, transforming into an animated hamburger menu on mobile devices for consistent accessibility.
*   **Informative Footer:** Quick access to operating hours, social links, and an interactive newsletter signup.
*   **Progressive Web App (PWA):** Installable on your device for an app-like experience, with offline support capabilities.
*   **Responsive Design:** Fully responsive components ensuring a great experience on any device, built with Tailwind CSS and enhanced with Framer Motion.
*   **AI-Powered (with Genkit):** Foundation for integrating intelligent features, enhancing user interaction and personalization.

## 🚀 Tech Stack

Espresso Edge is built using a modern and robust technology stack:

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Library:** [React](https://reactjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **AI Integration:** [Genkit (by Firebase)](https://firebase.google.com/docs/genkit)
*   **PWA:** Enabled via `next-pwa` for service worker and manifest generation.

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed:
*   Node.js (v18 or later recommended)
*   npm or yarn

### Installation

1.  **Clone the repository (if applicable):**
    ```bash
    # git clone https://your-repository-url.git
    # cd espresso-edge
    ```
2.  **Install NPM packages:**
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  **Environment Variables:**
    If you plan to use Genkit with specific API keys (e.g., Google AI Studio), create a `.env.local` file in the root of the project and add your keys:
    ```env
    GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
    ```
    Refer to the Genkit documentation for more details on environment setup.

### Running the Development Server

*   **Main Application:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:9002](http://localhost:9002) (or the port specified in your `dev` script) with your browser to see the result.

*   **Genkit Development Server (for AI flows):**
    If you are working on or testing Genkit flows, run the Genkit development server in a separate terminal:
    ```bash
    npm run genkit:dev
    ```
    This will typically start the Genkit development UI on [http://localhost:4000](http://localhost:4000).

## 📜 Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in development mode.
*   `npm run build`: Builds the app for production.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
*   `npm run typecheck`: Runs TypeScript to check for type errors.
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server with hot-reloading for flow changes.

## 🎨 Styling Guidelines

Espresso Edge aims for a warm, elegant, and high-end feel:

*   **Primary Color:** Deep brown (`#6F4E37`) - Evokes warmth and comfort.
*   **Background Color:** Light tan (`#F5E7D2`) - Provides a soft, inviting backdrop.
*   **Accent Color:** Burnt orange (`#CC6633`) - Highlights key interactive elements.
*   **Fonts:**
    *   Headlines: 'Playfair Display' (serif)
    *   Body Text: 'PT Sans' (sans-serif)
*   **Icons:** Primarily uses `lucide-react` for a clean and modern look, with the PRD suggesting a future direction towards hand-drawn styles for thematic elements.
*   **Textures:** The design incorporates subtle cozy textures.

## 📱 Progressive Web App (PWA)

Espresso Edge is a PWA, offering:
*   **Installability:** Add the app to your home screen on supported devices.
*   **Offline Indicator:** Users are notified of their online/offline status.
*   **Improved Performance:** Service workers help cache assets for faster load times and offline access to previously visited pages.

## 🧠 AI Capabilities (Genkit)

The project is set up with Genkit, allowing for the integration of generative AI features. This could include:
*   Personalized recommendations.
*   AI-powered customer support.
*   Content generation for menu descriptions or blog posts.
*   And much more!

---

Thank you for exploring Espresso Edge! We're excited to brew something special.
