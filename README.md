# TechZen Booking.com Price Calculator

A comprehensive hotel booking rate calculator with advanced promotion stacking logic, built with React and Node.js.

## Features

- **Advanced Promotion Stacking**: Complex business rules for discount combinations
- **Real-time Calculations**: Instant rate calculations with validation
- **Multiple Customer Scenarios**: Generate and compare different customer pricing scenarios
- **Export Functionality**: Export results to CSV and Excel formats
- **Responsive Design**: Optimized for desktop and mobile devices
- **Professional UI**: Clean, modern interface with TechZen branding

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Deployment**: Vercel

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nepalqubit/price-calculator.git
cd price-calculator
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

### Running the Application

1. Start the backend server:
```bash
npm start
```
The server will run on http://localhost:3001

2. Start the frontend development server:
```bash
cd client
npm start
```
The client will run on http://localhost:3000

## Deployment on Vercel

### Automatic Deployment (Recommended)

1. **Connect GitHub Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository: `https://github.com/nepalqubit/price-calculator.git`

2. **Configure Project Settings**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty (handled by vercel.json)
   - **Output Directory**: Leave empty (handled by vercel.json)

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your application
   - Your app will be available at `https://your-project-name.vercel.app`

### Manual Deployment

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

## Project Structure

```
price-calculator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.tsx        # Main application component
│   │   └── ...
│   ├── package.json
│   └── ...
├── server.js              # Express backend
├── vercel.json           # Vercel deployment configuration
├── package.json          # Backend dependencies
└── README.md
```

## API Endpoints

### POST /api/calculate-rate
Calculates hotel booking rates with applied promotions.

**Request Body**:
```json
{
  "baseRate": 100,
  "commissionPercentage": 15,
  "promotions": [
    {
      "id": "1",
      "label": "Genius Discount",
      "discountPercentage": 10,
      "isApplicable": true,
      "type": "genius"
    }
  ]
}
```

**Response**:
```json
{
  "baseRate": 100,
  "finalPriceToCustomer": 90,
  "totalDiscountAmount": 10,
  "totalDiscountPercentage": 10,
  "commissionPercentage": 15,
  "commissionAmount": 13.5,
  "netAmountToHotel": 76.5,
  "appliedPromotions": [
    {
      "label": "Genius Discount",
      "discountPercentage": 10,
      "discountAmount": 10
    }
  ]
}
```

## Promotion Stacking Rules

1. **Deep Deals**: Completely exclusive - no stacking with any other discount
2. **Basic Deal vs Campaign Deal**: Mutually exclusive (Campaign Deal takes priority)
3. **Target Discount**: Only stacks with Basic Deal, not with Campaign Deal
4. **Genius Discount**: Can stack with Target, Campaign, or Basic Deal

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Developed by [TechZen Corporation](https://techzeninc.com) | [RevX.pro](https://revx.pro)

## Support

For support and inquiries, please visit:
- [TechZen Corporation](https://techzeninc.com)
- [RevX.pro](https://revx.pro)