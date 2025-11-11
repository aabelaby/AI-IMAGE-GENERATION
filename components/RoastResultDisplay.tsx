import React from 'react';
import { RoastData, RoastSection } from '../services/geminiService';
import { StarIcon } from './icons';

interface RoastResultDisplayProps {
    data: RoastData;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex">
            {[...Array(5)].map((_, index) => (
                <StarIcon
                    key={index}
                    className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-600'}`}
                />
            ))}
        </div>
    );
};

export const RoastResultDisplay: React.FC<RoastResultDisplayProps> = ({ data }) => {
    const scoreColor = data.mockScore >= 75 ? 'text-green-400' : data.mockScore >= 40 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="w-full text-gray-300 animate-fade-in">
            <div className="text-center mb-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">Your Mock Score</p>
                <p className={`text-7xl font-bold my-2 ${scoreColor}`}>{data.mockScore}</p>
                <p className="text-lg font-semibold text-orange-400">{data.mockLabel}</p>
            </div>

            <div className="space-y-6">
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
                        🔥 The Roast Begins...
                    </h2>
                    <p className="text-lg italic text-gray-400">"{data.introduction}"</p>
                </div>
                
                {data.sections.map((section, index) => (
                    <div key={index} className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 transition-shadow hover:shadow-lg hover:shadow-orange-500/10">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">
                                <span className="mr-3 text-2xl">{section.emoji}</span>
                                {section.title}
                            </h3>
                            <StarRating rating={section.rating} />
                        </div>
                        <p className="text-gray-300 leading-relaxed">{section.comment}</p>
                    </div>
                ))}
                
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                        ⚙️ Final Verdict
                    </h2>
                    <p className="text-lg font-medium text-gray-300">{data.finalVerdict}</p>
                </div>
            </div>
        </div>
    );
};