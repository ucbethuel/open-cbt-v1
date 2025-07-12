import React, { useState } from 'react';

const QuestionModal = ({ 
  show, onClose, questionForm, setQuestionForm, editingQuestion, 
  CONFIG, onSave, setError 
}) => {
  const [formData, setFormData] = useState(questionForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.subject || !formData.text || !formData.correctAnswer) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.options.some(opt => !opt.text.trim())) {
      setError('Please fill in all option texts');
      return;
    }

    onSave(formData);
  };

  const handleOptionChange = (optionId, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(opt => 
        opt.id === optionId ? { ...opt, text: value } : opt
      )
    }));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Subject</option>
                {CONFIG.SUBJECTS.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text *
              </label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter the question text..."
                required
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Answer Options *
              </label>
              <div className="space-y-3">
                {formData.options.map(option => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                      {option.id}
                    </span>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(option.id, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Option ${option.id}`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Correct Answer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answer *
              </label>
              <select
                value={formData.correctAnswer}
                onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Correct Answer</option>
                {formData.options.map(option => (
                  <option key={option.id} value={option.id}>
                    Option {option.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {editingQuestion ? 'Update Question' : 'Add Question'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;