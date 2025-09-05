import React, { useState, useCallback } from 'react';
import { Edit3, Save, X, Folder, ChevronDown, ChevronRight } from 'lucide-react';

export default function Section({ 
  id, 
  title, 
  description, 
  color, 
  position, 
  size, 
  isCollapsed,
  onUpdate, 
  onDelete 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({ title, description });

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(() => {
    onUpdate(id, tempData);
    setIsEditing(false);
  }, [id, tempData, onUpdate]);

  const handleCancel = useCallback(() => {
    setTempData({ title, description });
    setIsEditing(false);
  }, [title, description]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  const toggleCollapse = useCallback(() => {
    onUpdate(id, { isCollapsed: !isCollapsed });
  }, [id, isCollapsed, onUpdate]);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this section?')) {
      onDelete(id);
    }
  }, [id, onDelete]);

  return (
    <div
      className={`absolute border-2 border-dashed rounded-lg backdrop-blur-sm transition-all duration-200 group`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: isCollapsed ? 60 : size.height,
        borderColor: color,
        backgroundColor: `${color}10`,
      }}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      {/* Header */}
      <div 
        className="flex items-center gap-2 p-3 cursor-pointer"
        onClick={toggleCollapse}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
        
        <Folder className="w-4 h-4" style={{ color }} />
        
        {isEditing ? (
          <input
            type="text"
            value={tempData.title}
            onChange={(e) => setTempData(prev => ({ ...prev, title: e.target.value }))}
            onKeyDown={handleKeyPress}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-transparent text-white font-medium text-sm border-b border-purple-400 focus:outline-none focus:border-purple-300 px-1 py-1"
            placeholder="Section title"
            autoFocus
          />
        ) : (
          <h3 className="text-white font-medium text-sm flex-1">{title}</h3>
        )}

        {!isEditing && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit3 className="w-3 h-3 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="px-3 pb-3">
          {isEditing ? (
            <>
              <textarea
                value={tempData.description}
                onChange={(e) => setTempData(prev => ({ ...prev, description: e.target.value }))}
                onKeyDown={handleKeyPress}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-transparent text-gray-300 text-xs border border-gray-600 rounded focus:outline-none focus:border-gray-400 px-2 py-1 resize-none mb-3"
                placeholder="Section description"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleSave(); }}
                  className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-500 transition-colors flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  Save
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                  className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-300 text-xs">{description}</p>
          )}
        </div>
      )}

      {/* Resize handle */}
      {!isCollapsed && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ 
            background: `linear-gradient(-45deg, transparent 30%, ${color} 30%, ${color} 70%, transparent 70%)` 
          }}
        />
      )}
    </div>
  );
}