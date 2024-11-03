import React from 'react';

export default function ProgressLog({ logMessages }) {
  return (
    <div className="progress-log" style={{ backgroundColor: '#E6E6FA' }}>
      <h3>Progress log:</h3>
      <div className="log-messages">
        {logMessages.map((msg, index) => (
          <pre key={index}>{msg}</pre>  // Using <pre> tag
        ))}
      </div>
    </div>
  );
}
