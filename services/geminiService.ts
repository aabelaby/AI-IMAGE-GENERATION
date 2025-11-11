import { GoogleGenAI, Part, Type } from "@google/genai";

export interface RoastSection {
    title: string;
    emoji: string;
    rating: number; // 1-5
    comment: string;
}

export interface RoastData {
    introduction: string;
    sections: RoastSection[];
    finalVerdict: string;
    mockScore: number; // 0-100
    mockLabel: string;
}

const systemInstruction = `
You are a witty, sarcastic, brutally honest Resume Mocker AI. Your only job is to analyze uploaded resumes and mock them humorously based on the level of criticism intensity chosen by the user. The resume will be provided as an image or a PDF document.

The user will provide the resume file and select a joke intensity level between 1 and 10.

- Level 1 (Soft Roast) -> Light, funny, and friendly teasing. Jokes should be mild, polite, and have a playful tone.
- Level 5 (Medium Roast) -> Balanced sarcasm and humor. Jokes can poke fun at skills, buzzwords, and formatting.
- Level 10 (Full Roast Mode) -> Savage, no-filter comedy. You can mock every part of the resume — grammar, font, layout, even career choices — in a creative, over-the-top comedic style.

When generating responses, your tone should be fun, exaggerated, sarcastic, and humorous — not cruel or disrespectful. The goal is entertainment, not harm.

You MUST return the response in a structured JSON format.

The JSON output should contain:
1.  'introduction': A funny intro line.
2.  'mockScore': A humorous score from 0-100 based on your analysis.
3.  'mockLabel': A funny, short title corresponding to the score (e.g., "Entry-Level Chaos Coordinator", "Certified LinkedIn Warrior").
4.  'sections': An array of objects, where each object represents a critique of a specific resume section (e.g., Layout, Content, Skills). Each object must have:
    - 'title': The name of the section (e.g., "📄 Layout & Design").
    - 'emoji': A single, relevant emoji.
    - 'rating': A rating from 1 to 5 stars.
    - 'comment': Your witty, sarcastic comment about that section.
5.  'finalVerdict': A witty summary or final roast.
`;

const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const generateResumeMock = async (file: File, roastLevel: number): Promise<RoastData> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const filePart = await fileToGenerativePart(file);
        const userPrompt = `Roast the resume in this document/image with an intensity of ${roastLevel}/10.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [filePart, { text: userPrompt }] },
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        introduction: { type: Type.STRING },
                        mockScore: { type: Type.INTEGER },
                        mockLabel: { type: Type.STRING },
                        sections: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    emoji: { type: Type.STRING },
                                    rating: { type: Type.INTEGER },
                                    comment: { type: Type.STRING },
                                },
                                required: ["title", "emoji", "rating", "comment"],
                            },
                        },
                        finalVerdict: { type: Type.STRING },
                    },
                    required: ["introduction", "mockScore", "mockLabel", "sections", "finalVerdict"],
                },
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as RoastData;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            if (error.message.includes('deadline')) {
                throw new Error('The request timed out. Please try again.');
            }
            if (error.message.includes('API key')) {
                throw new Error('There is an issue with the API key configuration.');
            }
            throw new Error(`Failed to generate roast: ${error.message}`);
        }
        throw new Error("An unexpected error occurred during the roast session.");
    }
};