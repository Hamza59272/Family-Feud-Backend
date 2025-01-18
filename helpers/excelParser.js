const xlsx = require('xlsx');

const parseExcel = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 }); // Extract rows as arrays (not objects)

    const surveys = rows.map((row, rowIndex) => {
        if (rowIndex === 0 && typeof row[0] === 'string' && row[0].toLowerCase().includes('question')) {
            // If the first row has headers, skip it
            return null;
        }

        const question = row[0]; // First column is always the question
        const answers = [];

        for (let i = 1; i < row.length; i += 2) {
            // Columns after the question alternate as answers and points
            const answerText = row[i];
            const points = parseInt(row[i + 1], 10);

            if (answerText && !isNaN(points)) {
                answers.push({
                    text: answerText,
                    points,
                });
            }
        }

        return question && answers.length > 0
            ? { question, answers }
            : null; // Filter out invalid rows
    });

    return surveys.filter((survey) => survey !== null); // Remove null entries
};

module.exports = parseExcel;
