# Hotel Booking Rate Calculator

A full-stack application that calculates final booking rates for hotel rooms based on Booking.com-style promotion stacking logic.

## Features

### Frontend (React + TypeScript + Tailwind CSS)
- **Rate Configuration Form**: Input base rate and Booking.com commission percentage
- **Dynamic Promotion Management**: Add, edit, and remove promotions with:
  - Custom promotion labels (e.g., Genius, Mobile Rate, Early Bird)
  - Discount percentages
  - Applicability toggles for different customer types
- **Real-time Calculations**: Instant rate calculations with detailed breakdown
- **Responsive Design**: Clean, modern UI that works on all devices

### Backend (Node.js + Express)
- **Rate Calculation API**: POST `/calculate-rate` endpoint
- **Promotion Stacking Logic**: Sequential discount application (compounded)
- **Commission Calculation**: Booking.com commission deducted after discounts
- **Detailed Response**: Returns final price, discounts, commission, and net amount

## Promotion Stacking Logic

1. **Sequential Application**: Promotions are applied in order, each on the discounted price
2. **Compounded Discounts**: 10% + 10% = 19% total discount (not 20%)
3. **Conditional Application**: Only applies promotions where `isApplicable = true`
4. **Commission Deduction**: Booking.com commission calculated on final discounted price

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Backend Setup
```bash
# Install backend dependencies
npm install

# Start the backend server (runs on port 3001)
npm start
```

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install frontend dependencies (if not already installed)
npm install

# Start the React development server (runs on port 3000)
npm start
```

### Running Both Servers
You can run both servers simultaneously using:
```bash
# From the root directory
npm run dev:full
```

## API Documentation

### POST `/calculate-rate`

**Request Body:**
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
      "order": 1
    },
    {
      "id": "2",
      "label": "Mobile Rate",
      "discountPercentage": 5,
      "isApplicable": false,
      "order": 2
    }
  ]
}
```

**Response:**
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

## Usage Example

1. **Set Base Rate**: Enter the original room rate (e.g., $100)
2. **Set Commission**: Enter Booking.com commission percentage (e.g., 15%)
3. **Configure Promotions**: 
   - Add promotions like "Genius Discount" (10%)
   - Toggle "Is Applicable?" based on customer type
   - Promotions are applied in the order they appear
4. **Calculate**: Click "Calculate Rate" to see:
   - Final price customer pays
   - Total discounts applied
   - Commission amount
   - Net amount hotel receives

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Development**: Create React App, Nodemon
- **Styling**: Tailwind CSS for responsive design

## Project Structure

```
├── server.js              # Express backend server
├── package.json           # Backend dependencies
├── client/                # React frontend
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   ├── index.css      # Tailwind CSS imports
│   │   └── ...
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
└── README.md              # This file
```

## Development Notes

- Backend runs on port 3001
- Frontend runs on port 3000
- CORS is enabled for cross-origin requests
- No database required - all data is managed in frontend state
- Responsive design works on mobile and desktop

## Future Enhancements

- Add promotion priority/ordering functionality
- Implement promotion date ranges
- Add customer type profiles
- Include tax calculations
- Add data persistence with database
- Implement user authentication for admin features