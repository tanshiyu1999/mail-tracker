import React from 'react';

export default function FileInput({ label, file, setFile }) {
  const handleFileChange = (e) => {
    console.log(e.target.files[0])
    setFile(e.target.files[0])
  };

  return (
    <div className="file-input">
      <label>{label}:</label>
      <input type="file" onChange={handleFileChange} />
      {file && <p>Selected file: {file.name}</p>}
    </div>
  );
}