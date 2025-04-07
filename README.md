# Overtime Calculator

A simple application that allows you to upload screenshots of worker hours and calculate overtime payments. The app generates a formatted email template that can be easily copied to the clipboard.

## Features

- Upload screenshots for three workers: Brad, Kallen, and Jack
- Input regular and overtime hours
- Automatic calculation based on predefined rates
- Generate formatted email template
- Copy to clipboard functionality

## Workers and Rates

- **Brad**: Overtime rate of £19.8/hour
- **Kallen**: Regular rate of £10/hour, overtime rate of £12/hour
- **Jack**: Overtime rate of £14.65/hour (base is full time, 8 hrs/day at minimum wage)

## How to Use

1. Upload screenshots for each worker
2. Enter the required hours information
3. Click "Generate Email Template"
4. Copy the generated email to your clipboard

## Development

This project uses:
- React
- Vite
- Tailwind CSS

To run locally:
```
npm install
npm run dev
```

To build for production:
```
npm run build
```