/**
 * Science Quiz Pro - Markdown to JSON Converter (Helper)
 * This script demonstrates how to parse the MCQ markdown files into
 * a JSON format compatible with the app.
 */

function parseMarkdownToQuiz(mdText) {
    const questions = [];
    // Split by question number (e.g., "1. ", "2. ")
    const blocks = mdText.split(/\n\d+\.\s+\*\*/);

    blocks.slice(1).forEach(block => {
        const lines = block.split('\n');
        const questionText = lines[0].replace(/\*\*/g, '').trim();

        let options = [];
        let answer = 0;

        lines.forEach(line => {
            const optMatch = line.match(/^\s+([A-D])\)\s+(.*)/);
            if (optMatch) {
                options.push(optMatch[2].trim());
            }
            const ansMatch = line.match(/\*Answer:\s+([A-D])/i);
            if (ansMatch) {
                answer = ansMatch[1].toUpperCase().charCodeAt(0) - 65; // A=0, B=1, ...
            }
        });

        if (options.length > 0) {
            questions.push({
                question: questionText,
                options: options,
                answer: answer
            });
        }
    });

    return questions;
}

// Example usage:
// const quizJson = parseMarkdownToQuiz(topic01Text);
// console.log(JSON.stringify(quizJson, null, 2));
