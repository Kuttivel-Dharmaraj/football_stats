import React, { useState } from 'react';
import axios from 'axios';

function AddData() {
  const [formData, setFormData] = useState({
    team: '',
    gamesPlayed: '',
    win: '',
    draw: '',
    loss: '',
    goalsFor: '',
    goalsAgainst: '',
    points: '',
    year: '',
  });

  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false); // Track if it's updating an existing team

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    // Check if updating or adding
    const endpoint = isUpdating ? 'http://localhost:5000/update' : 'http://localhost:5000/add';
    const method = isUpdating ? 'put' : 'post';

    try {
      const response = await axios[method](endpoint, formData);

      if (isUpdating) {
        setMessage('Team updated successfully!');
      } else {
        setMessage('Team added successfully!');
      }
      alert(response.data.message);
    } catch (err) {
      console.error(err);
      setError('Failed to add/update data. Please check your input and try again.');
    }
  };

  const handleCheckIfTeamExists = async () => {
    const { team, year } = formData;

    if (team && year) {
      try {
        const response = await axios.get(`http://localhost:5000/view-team/${team}/${year}`);
        if (response.data) {
          setIsUpdating(true); // If team exists, switch to update mode
        } else {
          setIsUpdating(false); // If team doesn't exist, stay in add mode
        }
      } catch (err) {
        console.error('Error checking team existence:', err);
        setIsUpdating(false); // Default to add if error occurs
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      {Object.keys(formData).map((key) => (
        <div key={key} style={{ marginBottom: '10px' }}>
          <label>{key.toUpperCase()}:</label>
          <input
            type="text"
            name={key}
            placeholder={
              `${key === 'team' ? 'e.g., Team Abc' :
                key === 'year' ? 'e.g., 2024' : 'e.g., 123'}`
            }
            value={formData[key]}
            onChange={handleChange}
            onBlur={handleCheckIfTeamExists} // Check if team exists on blur
            style={styles.input}
          />
        </div>
      ))}
      <button type="submit" style={styles.button}>
        {isUpdating ? 'Update Team' : 'Add Team'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </form>
  );
}

export default AddData;

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
    background: '#28a745',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
