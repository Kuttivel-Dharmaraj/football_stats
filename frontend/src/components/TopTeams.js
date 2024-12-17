import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TopTeams() {
  const [teams, setTeams] = useState([]);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopTeams = async (teamLimit) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/top-teams?limit=${teamLimit}`);
      if (response.data?.length) {
        setTeams(response.data);
      } else {
        setError('No teams found.');
      }
    } catch (err) {
      setError('Failed to fetch top teams. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopTeams(limit);
  }, [limit]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Top Teams</h2>

      <div style={styles.inputContainer}>
        <label htmlFor="limit" style={styles.label}>Number of Teams:</label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          style={styles.select}
        >
          {[5, 10, 15, 20].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Team</th>
              <th style={styles.tableHeader}>Games Played</th>
              <th style={styles.tableHeader}>Wins</th>
              <th style={styles.tableHeader}>Points</th>
            </tr>
          </thead>
          <tbody>
            {teams.length ? (
              teams.map((team, index) => (
                <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                  <td style={styles.tableCell}>{team.team || 'N/A'}</td>
                  <td style={styles.tableCell}>{team.gamesPlayed || 0}</td>
                  <td style={styles.tableCell}>{team.win || 0}</td>
                  <td style={styles.tableCell}>{team.points || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={styles.noDataCell}>No teams found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    fontSize: '26px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  label: {
    marginRight: '10px',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  select: {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  loading: {
    fontSize: '18px',
    color: '#007bff',
    fontStyle: 'italic',
  },
  table: {
    width: '90%',
    margin: 'auto',
    borderCollapse: 'collapse',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  tableHeader: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px',
    fontSize: '16px',
    textAlign: 'center',
    fontWeight: 'bold',
    border: '1px solid #ddd',
    textTransform: 'uppercase',
  },
  tableCell: {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#333',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  noDataCell: {
    textAlign: 'center',
    padding: '20px',
    fontStyle: 'italic',
    color: '#000',
    fontSize: '16px',
  },
};

export default TopTeams;
