import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddData from './components/AddData';
import UpdateData from './components/UpdateData';
import DeleteData from './components/DeleteData';
import ViewStats from './components/ViewStats';
import TopTeams from './components/TopTeams';
import AvgGoals from './components/AvgGoals';

function App() {
  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav style={styles.navBar}>
          <Link to="/add" style={styles.linkButton}>
            <button style={styles.button}>Add Data</button>
          </Link>

          <Link to="/update" style={styles.linkButton}>
            <button style={styles.button}>Update Data</button>
          </Link>

          <Link to="/delete" style={styles.linkButton}>
            <button style={styles.button}>Delete Data</button>
          </Link>

          <Link to="/view" style={styles.linkButton}>
            <button style={styles.button}>View Stats</button>
          </Link>

          <Link to="/top-teams" style={styles.linkButton}>
            <button style={styles.button}>Top Teams</button>
          </Link>

          <Link to="/avg-goals" style={styles.linkButton}>
            <button style={styles.button}>Average Goals</button>
          </Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/add" element={<AddData />} />
          <Route path="/update" element={<UpdateData />} />
          <Route path="/delete" element={<DeleteData />} />
          <Route path="/view" element={<ViewStats />} />
          <Route path="/top-teams" element={<TopTeams />} />
          <Route path="/avg-goals" element={<AvgGoals />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  navBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    padding: '20px',
    background: '#f4f4f4',
    flexWrap: 'wrap', // Ensures it wraps on smaller screens
  },
  button: {
    padding: '10px 20px',
    background: '#007bff',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '100%', // Makes button expand inside the Link
  },
  buttonHover: {
    background: '#0056b3', // Darker shade for hover effect
  },
  linkButton: {
    textDecoration: 'none',
    display: 'block', // Ensures the Link behaves like a block
    width: 'auto',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
  },
};

export default App;
