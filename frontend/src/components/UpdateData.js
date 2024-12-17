import React, { useState } from 'react';
import axios from 'axios';

function UpdateData() {
  const [team, setTeam] = useState('');
  const [dataToUpdate, setDataToUpdate] = useState('');
  const [newValue, setNewValue] = useState('');
  const [message, setMessage] = useState('');

  const getPlaceholder = () => {
    switch (dataToUpdate) {
      case 'team':
        return 'Enter the Team (e.g., Team Abc)';
      case 'year':
        return 'Enter Year (e.g., 2024)';
      case 'points':
      case 'gamesPlayed':
      case 'win':
      case 'draw':
      case 'loss':
      case 'goalsFor':
      case 'goalsAgainst':
        return 'Enter Numeric Value (e.g., 123)';
      default:
        return 'Enter Value';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); 

    if (!team || !dataToUpdate || !newValue) {
      alert('Please fill in all fields');
      return;
    }

    if (isNaN(newValue) && (dataToUpdate !== 'team' && dataToUpdate !== 'year')) {
      alert('New value must be a number (for Points, Games Played, etc.)');
      return;
    }

    try {
      const response = await axios.put('http://localhost:5000/update', {
        team,
        dataToUpdate,
        newValue,
      });

      setMessage(response.data.message);
      alert(response.data.message); // Alert success message
      setTeam('');
      setDataToUpdate('');
      setNewValue('');
    } catch (err) {
      alert('Error updating data. Please check the inputs.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <label>Team Name:</label>
        <input
          type="text"
          name="team"
          placeholder="e.g., Team Abc"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Field to Update:</label>
        <select
          name="dataToUpdate"
          value={dataToUpdate}
          onChange={(e) => {
            setDataToUpdate(e.target.value);
            setNewValue('');
          }}
          style={styles.input}
        >
          <option value="">Select a Field</option>
          <option value="team">Team</option>
          <option value="points">Points</option>
          <option value="gamesPlayed">Games Played</option>
          <option value="win">Wins</option>
          <option value="draw">Draws</option>
          <option value="loss">Losses</option>
          <option value="goalsFor">Goals For</option>
          <option value="goalsAgainst">Goals Against</option>
          <option value="year">Year</option>
        </select>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>New Value:</label>
        <input
          type="text"
          name="newValue"
          placeholder={getPlaceholder()}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          style={styles.input}
        />
      </div>
      <button type="submit" style={styles.button}>Update Data</button>
      {message && <div>{message}</div>}
    </form>
  );
}

export default UpdateData;

const styles = {
  input: {
    padding: '8px',
    width: '100%',
    margin: '5px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    background: '#007bff',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
