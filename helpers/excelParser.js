const xlsx = require('xlsx');

const parseExcel = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const surveys = rows.map(row => {
        const answers = [];
        for (let i = 1; i <= 8; i++) { // Updated to handle up to 8 answers
            if (row[`Answer ${i}`] && row[`Points ${i}`]) {
                answers.push({
                    text: row[`Answer ${i}`],
                    points: parseInt(row[`Points ${i}`], 10),
                });
            }
        }
        return {
            question: row.Question,
            answers,
        };
    });

    return surveys;
};

module.exports = parseExcel;
