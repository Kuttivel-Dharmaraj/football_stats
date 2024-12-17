import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewStats() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);  // Track the current page
  const [totalPages, setTotalPages] = useState(1);  // Total pages for pagination

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/view', {
        params: { page, limit: 10 }  // Passing page and limit for pagination
      });
      if (response.status === 200 && response.data.teams) {
        setTeams(response.data.teams);
        // Assuming the response contains the total number of pages
        setTotalPages(response.data.totalPages); 
      } else {
        setError('No teams found in the database.');
      }
    } catch (err) {
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Team Stats</h2>
      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Team</th>
                <th style={styles.tableHeader}>Games Played</th>
                <th style={styles.tableHeader}>Wins</th>
                <th style={styles.tableHeader}>Draws</th>
                <th style={styles.tableHeader}>Losses</th>
                <th style={styles.tableHeader}>Goals For</th>
                <th style={styles.tableHeader}>Goals Against</th>
                <th style={styles.tableHeader}>Points</th>
                <th style={styles.tableHeader}>Year</th>
              </tr>
            </thead>
            <tbody>
              {teams.length > 0 ? (
                teams.map((team, index) => (
                  <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                    <td style={styles.tableCell}>{team.team}</td>
                    <td style={styles.tableCell}>{team.gamesPlayed}</td>
                    <td style={styles.tableCell}>{team.win}</td>
                    <td style={styles.tableCell}>{team.draw}</td>
                    <td style={styles.tableCell}>{team.loss}</td>
                    <td style={styles.tableCell}>{team.goalsFor}</td>
                    <td style={styles.tableCell}>{team.goalsAgainst}</td>
                    <td style={styles.tableCell}>{team.points}</td>
                    <td style={styles.tableCell}>{team.year}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={styles.noDataCell}>No teams found</td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={styles.pagination}>
            <button onClick={handlePrevPage} disabled={page === 1}>
              Previous
            </button>
            <span>{`Page ${page} of ${totalPages}`}</span>
            <button onClick={handleNextPage} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    fontSize: '26px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '20px',
    color: '#007bff',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: '18px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  tableHeader: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: '1px solid #ddd',
  },
  tableCell: {
    border: '1px solid #ddd',
    padding: '10px',
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
    color: '#555',
    fontSize: '16px',
  },
  pagination: {
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default ViewStats;
