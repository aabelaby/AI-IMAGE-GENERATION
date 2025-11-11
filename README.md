# Resume Mocker AI

This web application is a fun and interactive tool that uses a powerful AI API to humorously "roast" user-submitted resumes. Users can upload their resume as a **PDF or image file**, select a "roast intensity" level from 1 to 10, and receive a witty, sarcastic, and brutally honest critique from our AI persona.

The goal is to provide entertainment and a lighthearted perspective on resume writing, transforming a typically stressful document into a source of comedy.

## ✨ Features

-   **AI-Powered Roasts**: Leverages a powerful multimodal AI model to generate creative and humorous critiques of resumes.
-   **File Upload Support**: Accepts resumes in **PDF (.pdf)** and common image formats **(.png, .jpg, .jpeg)**.
-   **Drag & Drop Interface**: A user-friendly drop zone for easy file uploads.
-   **Adjustable Intensity**: A slider lets the user choose a roast level from 1 (gentle teasing) to 10 (savage mockery).
-   **Interactive Roast Report**: The output is a beautifully formatted report with collapsible sections, ratings, and emojis.
-   **Mock Score & Label**: Generates a hilarious "Mock Score" out of 100 with a funny title (e.g., "Certified Buzzword Specialist").
-   **Witty Persona**: The AI is instructed to be witty, sarcastic, and funny, but never cruel or genuinely disrespectful.
-   **Responsive UI**: A sleek, dark-themed interface built with Tailwind CSS that works on all screen sizes.
-   **Modern Tech Stack**: Built with React, TypeScript, and a modern AI SDK.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI Model**: AI Model API

## 📂 File Structure

The project is organized into a modular structure to separate concerns and improve maintainability.

```
.
├── components/
│   ├── RoastResultDisplay.tsx # Renders the structured roast data in an interactive report
│   ├── Spinner.tsx            # Reusable SVG loading spinner component
│   └── icons.tsx              # Reusable SVG icons for the UI
├── services/
│   └── geminiService.ts       # Handles all communication with the AI API
├── App.tsx                    # Main application component, manages state and UI
├── index.html                 # The main HTML file and entry point for the app
├── index.tsx                  # Renders the React application into the DOM
└── metadata.json              # Application metadata
```

### Code Breakdown

-   **`index.html`**: The standard HTML entry point. It includes a script for Tailwind CSS and an `importmap` to manage ES module imports for React and the AI SDK directly from a CDN.

-   **`index.tsx`**: The main TypeScript file that bootstraps the React application by rendering the `<App />` component into the DOM.

-   **`App.tsx`**: This is the core of the application.
    -   It manages the application's state, including the `selectedFile`, `roastLevel`, the structured `mockResult`, `isLoading` status, and any `error` messages.
    -   The `handleRoastResume` function orchestrates the process by passing the `File` object to the API service.
    -   It now renders the new **`<RoastResultDisplay />`** component to show the final, structured output.

-   **`services/geminiService.ts`**: This file abstracts the AI API logic.
    -   It defines the data structures (`RoastData`, `RoastSection`) for the expected API response.
    -   The `generateResumeMock` function now requests a **structured JSON object** from the AI API by defining a `responseSchema`. This schema includes fields for the `mockScore`, `mockLabel`, and section-by-section critiques.
    -   It parses the JSON response and returns the typed `RoastData` object.

-   **`components/`**: This directory contains reusable React components.
    -   **`RoastResultDisplay.tsx`**: A new component that takes the `RoastData` object and renders it as a polished, interactive report. It prominently displays the **Mock Score** and label, followed by cards for each section of the roast.
    -   **`Spinner.tsx`**: A simple, customizable SVG spinner.
    -   **`icons.tsx`**: Contains functional SVG components, now including a `StarIcon`.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You need to have an API key from an AI service provider.

1.  Visit the website of your chosen AI provider.
2.  Follow their instructions to create and obtain a new API key.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/resume-mocker.git
    cd resume-mocker
    ```

2.  **Set up your environment variables:**
    This project expects the AI API key to be available as an environment variable (`process.env.API_KEY`). You will need to configure this in your deployment environment or local development setup.

3.  **Run the application:**
    Open the `index.html` file in your browser, preferably using a local server extension like "Live Server" for VS Code to avoid any potential CORS issues.
