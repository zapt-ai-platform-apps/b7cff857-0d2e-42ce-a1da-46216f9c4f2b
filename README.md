# Overtime Calculator

A simple application that allows you to upload Excel worksheets or screenshots of worker hours and calculate overtime payments. The app automatically extracts hours from the uploaded files and generates a formatted email template that can be easily copied to the clipboard.

## Features

- Upload Excel worksheets or screenshots for three workers: Brad, Kallen, and Jack
- Automatic extraction of hours worked from uploaded files
- Manual override option for extracted hours
- Automatic calculation of overtime (hours beyond 8.5 hours)
- Generate formatted email template
- Copy to clipboard functionality

## Workers and Rates

- **Brad**: Overtime rate of £19.8/hour
- **Kallen**: Regular rate of £10/hour, overtime rate of £12/hour
- **Jack**: Overtime rate of £14.65/hour (base is full time, 8 hrs/day at minimum wage)

## Overtime Calculation

- Standard workday is 8 hours plus 30 minutes unpaid lunch
- Any time worked beyond 8.5 hours is considered overtime
- Example: If a worker logged 13.5 hours in a day, the overtime would be 5 hours

## How to Use

1. Upload Excel worksheets or screenshots for each worker
2. The system will attempt to extract hours automatically
3. Review and adjust extracted hours if needed
4. The system automatically calculates overtime (hours beyond 8.5)
5. Click "Generate Email Template"
6. Copy the generated email to your clipboard

## Supported File Types

- Excel files (.xlsx, .xls)
- Image files (screenshots in common formats like .png, .jpg)

## Development

This project uses:
- React
- Vite
- Tailwind CSS
- Vitest for testing
- XLSX for Excel parsing
- Tesseract.js for OCR

To run locally:
```
npm install
npm run dev
```

To run tests:
```
npm test
```

To build for production:
```
npm run build
```