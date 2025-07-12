import React from 'react';

const ImportPreviewModal = ({ 
  show, onClose, previewData, importErrors, onImport, getSubjectName 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Import Preview</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{previewData.length}</div>
              <div className="text-sm text-green-700">Valid Questions</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{importErrors.length}</div>
              <div className="text-sm text-red-700">Errors Found</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{previewData.length + importErrors.length}</div>
              <div className="text-sm text-blue-700">Total Rows</div>
            </div>
          </div>

          {/* Errors Section */}
          {importErrors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                Errors Found
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-lg max-h-60 overflow-y-auto">
                {importErrors.map((error, index) => (
                  <div key={index} className="p-3 border-b border-red-200 last:border-b-0">
                    <div className="text-sm font-medium text-red-800">Row {error.row}:</div>
                    <ul className="text-sm text-red-700 ml-4 mt-1">
                      {error.errors.map((err, errIndex) => (
                        <li key={errIndex}>• {err}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Valid Questions Preview */}
          {previewData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                <i className="fas fa-check-circle mr-2"></i>
                Valid Questions ({previewData.length})
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Options</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Answer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {previewData.slice(0, 10).map((question, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getSubjectName(question.subject)}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 max-w-xs truncate">
                            {question.text}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {question.options.map(opt => `${opt.id}: ${opt.text}`).join(', ')}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {question.correctAnswer}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {previewData.length > 10 && (
                  <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 text-center">
                    ... and {previewData.length - 10} more questions
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            {previewData.length > 0 && (
              <button
                onClick={onImport}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Import {previewData.length} Questions
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportPreviewModal;