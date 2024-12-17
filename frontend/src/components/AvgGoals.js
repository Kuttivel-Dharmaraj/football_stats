import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function AvgGoals() {
  const [teams, setTeams] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

// Fetch available years
const fetchYears = useCallback(async () => {
  setError(null);
  try {
    const response = await axios.get('http://localhost:5000/available-years');
    console.log('Available Years Response:', response.data); // Log the response
    if (response.data?.length > 0) {
      setYears(response.data);
      setSelectedYear(response.data[0]); // Set first year as default
    } else {
      throw new Error('No years available');
    }
  } catch (err) {
    console.error('Error fetching years:', err);
    setYears([2021]); // Fallback to 2021 if backend fails
    setSelectedYear(2021);
    setError('Failed to load available years. Defaulting to 2021.');
  }
}, []);


  // Fetch average goals per team for the selected year
  const fetchAvgGoals = async (year) => {
    setLoading(true);
    setError(null);
    setTeams([]);

    try {
      const response = await axios.get(`http://localhost:5000/average-goals?year=${year}`);
      if (response.data?.length) {
        setTeams(response.data);
      } else {
        setError(`No average goals data found for ${year}.`);
      }
    } catch (err) {
      console.error('Error fetching average goals:', err);
      setError('Failed to fetch average goals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  useEffect(() => {
    if (selectedYear) fetchAvgGoals(selectedYear);
  }, [selectedYear]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Average Goals Per Team</h2>

      <div style={styles.inputContainer}>
        <label htmlFor="year" style={styles.label}>Select Year:</label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={styles.select}
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Team</th>
            <th style={styles.tableHeader}>Average Goals</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="2" style={styles.loadingCell}>Loading...</td>
            </tr>
          ) : teams.length ? (
            teams.map((team, index) => (
              <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                <td style={styles.tableCell}>{team.team}</td>
                <td style={styles.tableCell}>{team.averageGoals}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={styles.noDataCell}>No data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' },
  inputContainer: { marginBottom: '20px' },
  label: { marginRight: '10px', fontWeight: 'bold', fontSize: '16px' },
  select: { padding: '5px', fontSize: '16px', borderRadius: '4px' },
  error: { color: 'red', marginTop: '10px', fontSize: '14px' },
  table: { width: '90%', margin: 'auto', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#4CAF50', color: 'white', padding: '12px', textAlign: 'center' },
  tableCell: { border: '1px solid #ddd', padding: '10px', fontSize: '14px', textAlign: 'center' },
  evenRow: { backgroundColor: '#f9f9f9' },
  oddRow: { backgroundColor: '#fff' },
  loadingCell: { textAlign: 'center', padding: '20px' },
  noDataCell: { textAlign: 'center', padding: '20px', fontStyle: 'italic' },
};

export default AvgGoals;
