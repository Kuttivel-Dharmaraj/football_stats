// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables from .env file

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(bodyParser.json());

// MongoDB connection retry function
function connectWithRetry() {
  mongoose
    .connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 60000, // 60 seconds
      socketTimeoutMS: 300000, // 5 minutes
      maxPoolSize: 50, // Allow up to 50 concurrent connections
    })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => {
      console.error('MongoDB connection error. Retrying in 5 seconds...', err);
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    });
}

// Initial MongoDB connection attempt
connectWithRetry();

// Define Mongoose Schema and Model
const footballSchema = new mongoose.Schema({
  team: { type: String, required: true },
  gamesPlayed: { type: Number, required: true, min: 0 },
  win: { type: Number, required: true, min: 0 },
  draw: { type: Number, required: true, min: 0 },
  loss: { type: Number, required: true, min: 0 },
  goalsFor: { type: Number, required: true, min: 0 },
  goalsAgainst: { type: Number, required: true, min: 0 },
  points: { type: Number, required: true, min: 0 },
  year: { type: Number, required: true },
});

// Ensure combination of team and year is unique
footballSchema.index({ team: 1, year: 1 }, { unique: true });

const Football = mongoose.model('Football', footballSchema);

// REST API Endpoints

// Health Check Endpoint
app.get('/health', async (req, res) => {
  const mongoState = mongoose.connection.readyState; // 1 = connected
  const status = mongoState === 1 ? 'Healthy' : 'Unhealthy';
  res.status(200).json({ status, mongoState });
});

// Add Data Endpoint
app.post('/add', async (req, res) => {
  const { team, gamesPlayed, win, draw, loss, goalsFor, goalsAgainst, points, year } = req.body;

  if (!team || !gamesPlayed || !win || !draw || !loss || !goalsFor || !goalsAgainst || !points || !year) {
    return res.status(400).json({ error: 'Missing required fields. Please provide all the fields.' });
  }

  try {
    // Check if the team already exists for the given year
    const existingTeam = await Football.findOne({ team, year });

    if (existingTeam) {
      return res.status(400).json({ error: 'Team already exists for this year. Cannot add duplicate team-year.' });
    }

    const newTeam = new Football({
      team,
      gamesPlayed,
      win,
      draw,
      loss,
      goalsFor,
      goalsAgainst,
      points,
      year,
    });

    await newTeam.save();
    res.status(201).json({ message: 'Team added successfully', team: newTeam });
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).json({ error: 'Error adding data. Please try again.' });
  }
});

// Check if a team exists for the given year
app.get('/view-team/:team/:year', async (req, res) => {
  const { team, year } = req.params;

  try {
    const existingTeam = await Football.findOne({ team, year });

    if (existingTeam) {
      res.status(200).json(existingTeam); // Team exists
    } else {
      res.status(404).json({ message: 'Team not found' }); // Team doesn't exist
    }
  } catch (err) {
    console.error('Error fetching team:', err);
    res.status(500).json({ error: 'Error checking team existence' });
  }
});


// Update Data Endpoint
app.put('/update', async (req, res) => {
  const { team, year, dataToUpdate, newValue } = req.body;

  if (!team || !year || !dataToUpdate || newValue === undefined) {
    return res.status(400).json({ error: 'Ensure team, year, dataToUpdate, and newValue are provided.' });
  }

  // Prepare the update query
  const updateQuery = { [dataToUpdate]: newValue };

  try {
    // Find the existing team entry for the given team and year
    const existingTeam = await Football.findOne({ team, year });

    if (!existingTeam) {
      return res.status(404).json({ error: 'Team not found for this year. Update failed.' });
    }

    // Update the existing team record
    const updatedTeam = await Football.findOneAndUpdate(
      { team, year },  // Find the team based on its name and year
      updateQuery,     // Update only the specified field
      { new: true }    // Return the updated document
    );

    // Return the updated team information
    res.status(200).json({ message: 'Team updated successfully', team: updatedTeam });

  } catch (error) {
    console.error('Error during update:', error);
    res.status(500).json({ error: 'Server Error. Please try again later.' });
  }
});



app.delete('/delete', async (req, res) => {
  const { team } = req.body;  // Expecting the team name in the body

  if (!team) {
    return res.status(400).json({ error: 'Team name is required' });
  }

  try {
    // Attempt to delete the team from the database
    const deletedTeam = await Football.findOneAndDelete({ team });

    if (deletedTeam) {
      res.status(200).json({ message: 'Team deleted successfully', team: deletedTeam });
    } else {
      res.status(404).json({ error: 'Team not found' });
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Error deleting data' });
  }
});


// View All Stats Endpoint
app.get('/view', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const teams = await Football.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ team: 1 });

    const totalTeams = await Football.countDocuments();

    res.json({
      teams,
      totalTeams,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTeams / limit),
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Error fetching data. Please try again later.' });
  }
});

// Fetch Top Teams Endpoint (Dynamic limit and sorting)
app.get('/top-teams', async (req, res) => {
  const { limit = 5, sort = 'points' } = req.query;

  try {
    const topTeams = await Football.find()
      .sort({ [sort]: -1 }) // Sort dynamically
      .limit(parseInt(limit));

    res.json(topTeams);
  } catch (error) {
    console.error('Error fetching top teams:', error);
    res.status(500).json({ error: 'Error fetching top teams. Please try again later.' });
  }
});

// Fetch Average Goals Endpoint
app.get('/average-goals', async (req, res) => {
  const { year } = req.query;

  if (!year) return res.status(400).json({ error: 'Year is required' });

  try {
    const averageGoals = await Football.aggregate([ 
      { $match: { year: parseInt(year) } }, 
      { 
        $project: {
          team: 1,
          averageGoals: {
            $round: [{ $divide: ['$goalsFor', { $ifNull: ['$gamesPlayed', 1] }] }, 0],
          },
        },
      },
      { $sort: { averageGoals: -1 } },
    ]);

    res.json(averageGoals);
  } catch (error) {
    console.error('Error fetching average goals:', error);
    res.status(500).json({ error: 'Error fetching average goals. Please try again.' });
  }
});

// Fetch Available Years Endpoint
app.get('/available-years', async (req, res) => {
  try {
    const years = await Football.distinct('year'); // Fetch all unique years
    console.log('Available Years:', years); // Add logging here
    if (years.length === 0) {
      return res.status(404).json({ message: 'No years found in the database.' });
    }
    res.status(200).json(years.sort((a, b) => a - b)); // Sort years ascending
  } catch (error) {
    console.error('Error fetching available years:', error);
    res.status(500).json({ error: 'Error fetching available years.' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
