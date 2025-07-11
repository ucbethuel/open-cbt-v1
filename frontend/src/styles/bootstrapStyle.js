// Bootstrap CSS and JS
  const bootstrapStyle = `
    .exam-container {
      height: 100vh;
    //   overflow: hidden;
    }
    
    .exam-header {
      height: auto;
      min-height: 120px;
    }
    
    .exam-main {
      flex: 1 1 auto; overflow-y: auto;
    }
    
    .exam-footer {
    //   height: 10vh;
      min-height: 60px;
    }
    
    .question-area {
      height: 100%;
      overflow-y: auto;
    }
    
    .sidebar {
      height: 100%;
      overflow-y: auto;
    }
    
    .question-palette {
      max-height: 200px;
      overflow-y: auto;
    }
    
    .calculator {
      position: fixed;
      z-index: 1050;
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 0.375rem;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    
    .calculator-header {
      background: #343a40;
      color: white;
      cursor: move;
      user-select: none;
    }
    
    .time-critical {
      background-color: #f8d7da !important;
      color: #721c24 !important;
    }
    
    .time-warning {
      background-color: #fff3cd !important;
      color: #856404 !important;
    }
    
    .answer-option {
      transition: all 0.2s ease;
      cursor: pointer;
    }
    
    .answer-option:hover {
      background-color: #f8f9fa !important;
    }
    
    .answer-option.selected {
      background-color: #cce7ff !important;
      border-color: #0d6efd !important;
    }
    
    .question-btn {
      width: 40px;
      height: 40px;
      font-size: 0.875rem;
      font-weight: bold;
    }
    
    .question-btn.active {
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }
  `;


  export default bootstrapStyle;