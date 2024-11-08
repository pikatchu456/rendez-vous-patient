import React from "react";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
      <p className="loading-text" aria-live="polite">
        Chargement de la page web...
      </p>
      <style jsx>{`
        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 1rem;
          background-color: #f3f4f6;
        }
        .loader {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .circle {
          width: 0.75rem;
          height: 0.75rem;
          margin: 0 0.25rem;
          background-color: #3b82f6;
          border-radius: 50%;
          animation: bounce 0.5s ease-in-out infinite;
        }
        .circle:nth-child(2) {
          animation-delay: 0.1s;
        }
        .circle:nth-child(3) {
          animation-delay: 0.2s;
        }
        .circle:nth-child(4) {
          animation-delay: 0.3s;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-0.75rem);
          }
        }
        .loading-text {
          margin-top: 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: #4b5563;
          text-align: center;
        }
        @media (min-width: 640px) {
          .circle {
            width: 1rem;
            height: 1rem;
            margin: 0 0.5rem;
          }
          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-1rem);
            }
          }
          + n! .loading-text {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
