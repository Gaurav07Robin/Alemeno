const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const sequelize = new Sequelize('Credit System Database', 'your_db_user', 'your_db_password', {
  host: 'your_db_host',
  dialect: 'postgres', // Use 'mysql' for MySQL
});

const Customer = sequelize.define('Customer', {
  customerId: DataTypes.INTEGER, 
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  phoneNumber:DataTypes.INTEGER,
  monthlySalary: DataTypes.FLOAT,
  approvedLimit: DataTypes.FLOAT,
  currentDebt : DataTypes.FLOAT,
});

const Loan = sequelize.define('Loan', {
  customerId: DataTypes.INTEGER,
  loanId : DataTypes.INTEGER,
  loanAmount: DataTypes.FLOAT,
  tenure: DataTypes.FLOAT,
  interestRate: DataTypes.FLOAT,
  monthlyRepayment: DataTypes.FLOAT,
  emi: DataTypes.FLOAT,
  startDate: DataTypes.date,
  endDate : DataTypes.date
});

//Customer.hasMany(Loan);
//Loan.belongsTo(Customer);

app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, age,  monthlyIncome, phoneNumber } = req.body;
    // Calculate approved limit
    const approvedLimit = Math.round(36 * monthlySalary / 100000) * 100000;

    // Create a new customer record
    const customer = await Customer.create({ firstName, lastName, monthlySalary, approvedLimit, phoneNumber });
    await Customer.save();

    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/create-loan', (req, res) => {
  try {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;

    // Implement eligibility checks based on credit score or other criteria
    // Replace this with your actual logic
    const isEligible = checkEligibility(customer_id, loan_amount);

    if (isEligible) {
      // Calculate the monthly installment based on the provided interest rate
      const monthly_installment = calculateMonthlyInstallment(loan_amount, interest_rate, tenure);

      // Create a new loan record
      const newLoan = {
        customer_id,
        loan_id: loans.length + 1,
        loan_amount,
        interest_rate,
        tenure,
        monthly_installment,
      };

      // Save the loan to your data store (e.g., database)
      loans.push(newLoan);

      res.status(201).json({
        loan_id: newLoan.loan_id,
        customer_id: newLoan.customer_id,
        loan_approved: true,
        message: 'Loan approved',
        monthly_installment: newLoan.monthly_installment,
      });
    } else {
      res.status(400).json({
        customer_id,
        loan_approved: false,
        message: 'Loan not approved',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/check-eligibility', async (req, res) => {
  try {
    // Implement logic to process new loans based on eligibility
    // Create a new loan record
    // Return loan details
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;

  // Implement credit score calculation and loan eligibility checks here
  // Mock approval logic for demonstration
  const approved = true;

  if (approved) {
    // If the loan is approved
    const loan = {
      customer_id,
      loan_id: loans.length + 1,
      loan_amount,
      interest_rate,
      tenure,
      monthly_installment: calculateMonthlyInstallment(loan_amount, interest_rate, tenure),
    };

    // Add the loan to the list (in a real system, you would save it to the database)
    loans.push(loan);

    res.status(201).json({
      customer_id,
      approval: true,
      interest_rate: loan.interest_rate,
      tenure: loan.tenure,
      monthly_installment: loan.monthly_installment,
    });
  } else {
    // If the loan is not approved
    res.status(400).json({
      customer_id,
      approval: false,
      message: 'Loan not approved',
    });
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add other API routes as per your assignment requirements

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

sequelize.sync()
  .then(() => {
    console.log('Database is synced');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
