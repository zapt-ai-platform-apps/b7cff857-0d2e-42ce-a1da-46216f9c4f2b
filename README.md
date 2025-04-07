# Overtime Calculator

A simple application that allows you to upload screenshots of worker hours and calculate overtime payments. The app generates a formatted email template that can be easily copied to the clipboard.

## Features

- Upload screenshots for three workers: Brad, Kallen, and Jack
- Input total hours worked
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

1. Upload screenshots for each worker
2. Enter the total hours worked for each worker
3. The system automatically calculates overtime (hours beyond 8.5)
4. Click "Generate Email Template"
5. Copy the generated email to your clipboard

## Development

This project uses:
- React
- Vite
- Tailwind CSS
- Vitest for testing

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