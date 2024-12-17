import React, { useState } from 'react';
import axios from 'axios';

function DeleteData() {
  const [teamName, setTeamName] = useState(''); 
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send DELETE request to server
      const response = await axios.delete('http://localhost:5000/delete', { data: { team: teamName } });

      setMessage(response.data.message);  // Access the message correctly
      alert(response.data.message); 
    } catch (err) {
      console.error('Error deleting team:', err);
      setMessage('Error deleting team. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <label>Team Name:</label>
        <input
          type="text"
          name="teamName"
          placeholder="Enter Team Name (e.g., Team Abc)"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          style={styles.input}
        />
      </div>
      <button type="submit" style={styles.button}>Delete Team</button>
      {message && <p>{message}</p>} 
    </form>
  );
}

export default DeleteData;

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
    background: '#dc3545',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
