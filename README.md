
# AI Image Generator using Gemini API

This is a web application that demonstrates the power of Google's Gemini API, specifically using the `imagen-4.0-generate-001` model to generate high-quality images from textual descriptions. The user can input a detailed prompt, and the application will render a visual representation created by the AI.

The interface is designed to be clean, modern, and user-friendly, providing real-time feedback during the image generation process with loading states and clear error handling.

## ✨ Features

-   **Text-to-Image Generation**: Converts detailed text prompts into images.
-   **High-Quality Model**: Utilizes Google's powerful `imagen-4.0-generate-001` model.
-   **Responsive UI**: A sleek and responsive interface built with Tailwind CSS that works on all screen sizes.
-   **Interactive Experience**: Features a loading spinner and user-friendly messages during image generation.
-   **Robust Error Handling**: Displays clear error messages if the API call fails.
-   **Modern Tech Stack**: Built with React, TypeScript, and the official `@google/genai` SDK.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI Model**: [Google Gemini API](https://ai.google.dev/) (`@google/genai` SDK)

## 📂 File Structure

The project is organized into a modular structure to separate concerns and improve maintainability.

```
.
├── components/
│   ├── Spinner.tsx       # Reusable SVG loading spinner component
│   └── icons.tsx         # Reusable SVG icons for the UI
├── services/
│   └── geminiService.ts  # Handles all communication with the Gemini API
├── App.tsx               # Main application component, manages state and UI
├── index.html            # The main HTML file and entry point for the app
├── index.tsx             # Renders the React application into the DOM
└── metadata.json         # Application metadata
```

### Code Breakdown

-   **`index.html`**: The standard HTML entry point. It includes a script for Tailwind CSS and an `importmap` to manage ES module imports for React and the GenAI SDK directly from a CDN.

-   **`index.tsx`**: The main TypeScript file that bootstraps the React application. It finds the `root` DOM element and renders the `<App />` component into it.

-   **`App.tsx`**: This is the core of the application.
    -   It manages the application's state using `useState`, including the user's `prompt`, the `generatedImage` URL, the `isLoading` status, and any `error` messages.
    -   It defines the UI structure, including the header, the textarea for the prompt, the "Generate" button, and the display area for the resulting image.
    -   The `handleGenerateImage` function orchestrates the image generation process by setting loading states and calling the API service.

-   **`services/geminiService.ts`**: This file abstracts the Gemini API logic away from the UI components.
    -   The `generateImageFromPrompt` function is an `async` function that takes a `prompt` string.
    -   It initializes the `GoogleGenAI` client with the API key from environment variables.
    -   It calls `ai.models.generateImages` with the specified model (`imagen-4.0-generate-001`), the prompt, and configuration options like `aspectRatio` and `outputMimeType`.
    -   It processes the response, extracts the base64-encoded image data, and returns it as a data URI (`data:image/jpeg;base64,...`) ready to be used in an `<img>` tag.
    -   It includes error handling to catch and report issues during the API call.

-   **`components/`**: This directory contains reusable React components.
    -   **`Spinner.tsx`**: A simple, customizable SVG spinner to indicate that an operation is in progress.
    -   **`icons.tsx`**: Contains functional SVG components (`SparklesIcon`, `ExclamationIcon`) used in buttons and alerts to improve visual communication.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You need to have an API key from Google AI Studio.

1.  Visit [Google AI Studio](https://aistudio.google.com/).
2.  Click **"Get API key"** and create a new key.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-image-generator.git
    cd ai-image-generator
    ```

2.  **Set up your environment variables:**
    This project expects the Google Gemini API key to be available as an environment variable. You will need to configure this in your deployment environment or local development setup.

    For local development, you can often use a `.env` file (though this project's setup doesn't explicitly include a build tool like Vite or Create React App to process it, the code expects `process.env.API_KEY`). Ensure your local server or build tool makes this variable available to the application.

    Create a file named `.env.local` in the root of your project and add your API key:
    ```
    API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
    ```

3.  **Run the application:**
    Open the `index.html` file in your browser, preferably using a local server extension like "Live Server" for VS Code to avoid any potential CORS issues.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/ai-image-generator/issues).

---
