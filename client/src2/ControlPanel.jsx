import React from "react";

export default function ControlPanel({ offset, scale, centerOffset, topLeftOffset, resetScale }) {
  return (
    <div
      style={{
        marginTop: "1.5rem",
        padding: "0.8rem 1rem",
      }}
    >
      <details open>
        <summary
          style={{
            marginBottom: "0.5rem",
            cursor: "pointer",
            fontWeight: "bold",
            textDecoration: "underline",
          }}
        >
          Zoom
        </summary>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.8rem" }}>
          <button onClick={() => resetScale(0.25)}>0.25</button>
          <button onClick={() => resetScale(0.5)}>0.5</button>
          <button onClick={() => resetScale(0.9)}>0.9</button>
          <button onClick={() => resetScale(1.1)}>1.1</button>
          <button onClick={() => resetScale(2.0)}>2.0</button>
          <button onClick={() => resetScale(4.0)}>4.0</button>
          <button onClick={() => resetScale(0)}>Home</button>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          Zoom-Faktor: <strong>{scale.toFixed(5)}</strong>
        </div>
        <hr />
      </details>

      
      <details open>
        <summary
          style={{
            marginBottom: "0.5rem",
            cursor: "pointer",
            fontWeight: "bold",
            textDecoration: "underline",
          }}
        >
          Offset
        </summary>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.3rem" }}>
          <button onClick={centerOffset}>Center</button>
          <button onClick={topLeftOffset}>TopLeft</button>
        </div>
        <div>
          <strong>Offset in px:</strong> {offset.x.toFixed(0)} / {offset.y.toFixed(0)}
        </div>
        <hr />
      </details>
    </div>
  );
}
