const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate calculation endpoint
app.post('/api/calculate-rate', (req, res) => {
  try {
    const { baseRate, commissionPercentage, promotions } = req.body;

    // Validate input
    if (!baseRate || !commissionPercentage || !Array.isArray(promotions)) {
      return res.status(400).json({
        error: 'Invalid input. Please provide baseRate, commissionPercentage, and promotions array.'
      });
    }

    // Validate discount percentages
    const invalidPromotions = promotions.filter(promo => 
      promo.discountPercentage && (promo.discountPercentage > 100 || promo.discountPercentage < 0)
    );
    if (invalidPromotions.length > 0) {
      return res.status(400).json({
        error: 'Discount percentage must be between 0% and 100%. Please check your promotion settings.'
      });
    }

    // Validate commission percentage
    if (commissionPercentage > 100 || commissionPercentage < 0) {
      return res.status(400).json({
        error: 'Commission percentage must be between 0% and 100%.'
      });
    }

    // Validate base rate
    if (baseRate <= 0) {
      return res.status(400).json({
        error: 'Base rate must be greater than 0.'
      });
    }

    // Separate promotions by type
    const applicablePromotions = promotions.filter(promo => 
      promo.isApplicable && promo.discountPercentage > 0
    );
    
    const basicDeal = applicablePromotions.find(promo => 
      promo.isBasicDeal || promo.type === 'basic'
    );
    
    const campaignDeal = applicablePromotions.find(promo => 
      promo.type === 'campaign'
    );
    
    const deepDeal = applicablePromotions.find(promo => 
      promo.type === 'deep'
    );
    
    const geniusPromo = applicablePromotions.find(promo => 
      promo.type === 'genius'
    );
    
    const targetPromo = applicablePromotions.find(promo => 
      promo.type === 'target'
    );

    // Calculate final price with new stacking rules
    let currentPrice = parseFloat(baseRate);
    let totalDiscountAmount = 0;
    const appliedPromotions = [];

    // Deep Deals are completely exclusive - no stacking with any other discount
    if (deepDeal) {
      const discountAmount = currentPrice * (parseFloat(deepDeal.discountPercentage) / 100);
      currentPrice -= discountAmount;
      totalDiscountAmount += discountAmount;
      
      appliedPromotions.push({
        label: deepDeal.label,
        discountPercentage: deepDeal.discountPercentage,
        discountAmount: parseFloat(discountAmount.toFixed(2))
      });
    } else {
      // Basic Deal and Campaign Deal are mutually exclusive
      let baseDeal = null;
      if (campaignDeal) {
        // Campaign Deal takes priority over Basic Deal
        baseDeal = campaignDeal;
      } else if (basicDeal) {
        baseDeal = basicDeal;
      }

      // Apply the base deal (Basic or Campaign)
      if (baseDeal) {
        const discountAmount = currentPrice * (parseFloat(baseDeal.discountPercentage) / 100);
        currentPrice -= discountAmount;
        totalDiscountAmount += discountAmount;
        
        appliedPromotions.push({
          label: baseDeal.label,
          discountPercentage: baseDeal.discountPercentage,
          discountAmount: parseFloat(discountAmount.toFixed(2))
        });
      }

      // Apply Target promotion (only stacks with Basic Deal, not with Campaign Deal)
      if (targetPromo && basicDeal && !campaignDeal) {
        const discountAmount = currentPrice * (parseFloat(targetPromo.discountPercentage) / 100);
        currentPrice -= discountAmount;
        totalDiscountAmount += discountAmount;
        
        appliedPromotions.push({
          label: targetPromo.label,
          discountPercentage: targetPromo.discountPercentage,
          discountAmount: parseFloat(discountAmount.toFixed(2))
        });
      }

      // Apply Genius promotion (can stack with Target, Campaign, or Basic Deal)
      if (geniusPromo) {
        const discountAmount = currentPrice * (parseFloat(geniusPromo.discountPercentage) / 100);
        currentPrice -= discountAmount;
        totalDiscountAmount += discountAmount;
        
        appliedPromotions.push({
          label: geniusPromo.label,
          discountPercentage: geniusPromo.discountPercentage,
          discountAmount: parseFloat(discountAmount.toFixed(2))
        });
      }
    }

    // Calculate final customer price
    const finalPriceToCustomer = parseFloat(currentPrice.toFixed(2));
    
    // Calculate commission on final customer payment amount (as per Basic Deal rules)
    const commissionAmount = parseFloat((finalPriceToCustomer * (parseFloat(commissionPercentage) / 100)).toFixed(2));
    const netAmountToHotel = parseFloat((finalPriceToCustomer - commissionAmount).toFixed(2));
    const totalDiscountPercentage = parseFloat(((totalDiscountAmount / baseRate) * 100).toFixed(2));

    // Response
    const result = {
      baseRate: parseFloat(baseRate),
      finalPriceToCustomer,
      totalDiscountAmount: parseFloat(totalDiscountAmount.toFixed(2)),
      totalDiscountPercentage,
      commissionPercentage: parseFloat(commissionPercentage),
      commissionAmount,
      netAmountToHotel,
      appliedPromotions
    };

    res.json(result);
  } catch (error) {
    console.error('Error calculating rate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hotel booking calculator API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;