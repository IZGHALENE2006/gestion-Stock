import React from "react";
import "./Dialog.css";

const Dialog = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // ⬇️ كليك على الفراغ يسدّ
    <div className="dialog-overlay" onClick={onClose}>
      
      {/* ⬇️ منع انتشار الكليك داخل الـ dialog */}
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        
        <div className="dialog-header">
          <h3>{title}</h3>
          <button className="close-btn scale-150" onClick={onClose}>×</button>
        </div>

        <div className="dialog-body">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Dialog;
