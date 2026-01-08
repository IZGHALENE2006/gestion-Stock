import React from "react";
import "./Dialog.css";

const Dialog = ({ isOpen, onClose, title, children , width }) => {
  if (!isOpen) return null;

  return (
    // ⬇️ كليك على الفراغ يسدّ
    <div className="dialog-overlay" onClick={onClose}>
      
      {/* ⬇️ منع انتشار الكليك داخل الـ dialog */}
      <div className="dialog"
            style={{width : width}}
      onClick={(e) => e.stopPropagation()}>
        
        <div className="dialog-header">
          <h3 className="tracking-wide font-semibold text-xl">
              {title}
              </h3>
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
