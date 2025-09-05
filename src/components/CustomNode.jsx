import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Database, Github, Server, Zap, Globe, Code, MoreVertical, Edit3, Copy, Power, Trash2, Palette, Settings, ChevronDown, ChevronUp, Router } from 'lucide-react';
import TechSelector from './TechSelector';

const getIcon = (type) => {
  switch (type) {
    // Frontend (Client Layer)
    case 'frontend':
      return <Globe className="w-6 h-6 text-blue-400" />;
    case 'mobile':
      return <Globe className="w-6 h-6 text-purple-400" />;
    case 'cdn':
      return <Zap className="w-6 h-6 text-cyan-400" />;
    
    // Backend (Application Layer)
    case 'backend':
      return <Code className="w-6 h-6 text-orange-400" />;
    case 'api':
      return <Server className="w-6 h-6 text-green-400" />;
    case 'microservice':
      return <Server className="w-6 h-6 text-emerald-400" />;
    case 'serverless':
      return <Zap className="w-6 h-6 text-yellow-400" />;
    case 'message-broker':
      return <Router className="w-6 h-6 text-pink-400" />;
    
    // Database Layer
    case 'database':
      return <Database className="w-6 h-6 text-blue-400" />;
    case 'nosql':
      return <Database className="w-6 h-6 text-purple-500" />;
    case 'cache':
      return <Zap className="w-6 h-6 text-yellow-400" />;
    case 'search':
      return <Database className="w-6 h-6 text-indigo-400" />;
    case 'data-warehouse':
      return <Database className="w-6 h-6 text-blue-600" />;
    
    // Cloud & Infrastructure
    case 'cloud':
      return <Server className="w-6 h-6 text-sky-400" />;
    case 'container':
      return <Server className="w-6 h-6 text-gray-400" />;
    case 'orchestration':
      return <Server className="w-6 h-6 text-blue-500" />;
    case 'load-balancer':
      return <Router className="w-6 h-6 text-green-500" />;
    case 'storage':
      return <Database className="w-6 h-6 text-teal-400" />;
    
    // Security & Authentication
    case 'auth':
      return <Server className="w-6 h-6 text-red-400" />;
    case 'security':
      return <Server className="w-6 h-6 text-red-500" />;
    
    // Observability & Reliability
    case 'monitoring':
      return <Server className="w-6 h-6 text-yellow-500" />;
    case 'logging':
      return <Server className="w-6 h-6 text-amber-400" />;
    case 'tracing':
      return <Server className="w-6 h-6 text-orange-500" />;
    
    // Middleware & Supporting
    case 'middleware':
      return <Router className="w-6 h-6 text-cyan-500" />;
    case 'proxy':
      return <Router className="w-6 h-6 text-gray-500" />;
    case 'queue':
      return <Server className="w-6 h-6 text-violet-400" />;
    case 'analytics':
      return <Server className="w-6 h-6 text-pink-500" />;
    
    // Version Control & CI/CD
    case 'github':
      return <Github className="w-6 h-6 text-gray-300" />;
    
    default:
      return <Server className="w-6 h-6 text-gray-400" />;
  }
};

const colorOptions = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4',
  '#ec4899', '#84cc16', '#f97316', '#6366f1', '#14b8a6', '#f43f5e'
];

export default function CustomNode({ data, id, selected }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTechSelector, setShowTechSelector] = useState(false);
  const [tempData, setTempData] = useState({
    title: data.title || '',
    techUsed: data.techUsed || [],
    usecase: data.usecase || '',
    description: data.description || '',
    customColor: data.customColor || '',
  });

  const handleEdit = useCallback(() => {
    setTempData({
      title: data.title || '',
      techUsed: data.techUsed || [],
      usecase: data.usecase || '',
      description: data.description || '',
      customColor: data.customColor || '',
    });
    setIsEditing(true);
    setShowMenu(false);
    setIsExpanded(true);
  }, [data]);

  const handleSave = useCallback(() => {
    Object.assign(data, tempData);
    setIsEditing(false);
  }, [tempData, data]);

  const handleCancel = useCallback(() => {
    setTempData({
      title: data.title || '',
      techUsed: data.techUsed || [],
      usecase: data.usecase || '',
      description: data.description || '',
      customColor: data.customColor || '',
    });
    setIsEditing(false);
  }, [data]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  const handleTechToggle = useCallback((techName) => {
    setTempData(prev => ({
      ...prev,
      techUsed: prev.techUsed.includes(techName)
        ? prev.techUsed.filter(t => t !== techName)
        : [...prev.techUsed, techName]
    }));
  }, []);

  const handleColorSelect = useCallback((color) => {
    setTempData(prev => ({ ...prev, customColor: color }));
    if (!isEditing) {
      data.customColor = color;
    }
    setShowColorPicker(false);
  }, [isEditing, data]);

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setShowMenu(true);
  }, []);

  const getNodeStyle = () => {
    const baseColor = data.customColor || getDefaultColor(data.type);
    return {
      background: `linear-gradient(135deg, ${baseColor}15 0%, ${baseColor}25 100%)`,
      borderColor: selected ? '#8b5cf6' : `${baseColor}50`,
      borderWidth: selected ? '2px' : '1px',
      boxShadow: data.disabled ? 'none' : `0 4px 20px ${baseColor}20`,
    };
  };

  const getDefaultColor = (type) => {
    switch (type) {
      case 'database': return '#3b82f6';
      case 'github': return '#6b7280';
      case 'api': return '#10b981';
      case 'cache': return '#f59e0b';
      case 'frontend': return '#8b5cf6';
      case 'backend': return '#f97316';
      default: return '#6b7280';
    }
  };

  const handleStyle = {
    width: '12px',
    height: '12px',
    background: '#ffffff',
    border: '2px solid #6b7280',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    zIndex: 1000,
  };

  return (
    <>
      {/* Connection Handles - Positioned for proper connections */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ ...handleStyle, top: '-6px' }}
        className="hover:!bg-purple-400 hover:!border-purple-300"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        style={{ ...handleStyle, right: '-6px' }}
        className="hover:!bg-purple-400 hover:!border-purple-300"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ ...handleStyle, bottom: '-6px' }}
        className="hover:!bg-purple-400 hover:!border-purple-300"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ ...handleStyle, left: '-6px' }}
        className="hover:!bg-purple-400 hover:!border-purple-300"
      />
      
      {/* Additional source handles for full connectivity */}
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={{ ...handleStyle, top: '-6px' }}
        className="hover:!bg-purple-400 hover:!border-purple-300"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{ ...handleStyle, right: '-6px' }}
        className="hover:!bg-purple-400 hover:!border-purple-300"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={{ ...handleStyle, left: '-6px' }}
        className="hover:!bg-purple-400 hover:!border-purple-300"
      />

      <div 
        className={`relative min-w-[280px] max-w-[380px] p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl group ${
          data.disabled ? 'opacity-50 grayscale' : ''
        } ${isExpanded ? 'hover:scale-102' : 'hover:scale-105'} z-10`}
        style={getNodeStyle()}
        onContextMenu={handleContextMenu}
      >

        {/* Compact Header - Always Visible */}
        <div className="flex items-center gap-3 mb-2">
          {getIcon(data.type)}
          
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempData.title}
                  onChange={(e) => setTempData(prev => ({ ...prev, title: e.target.value }))}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-transparent text-white font-medium text-sm border-b border-purple-400 focus:outline-none focus:border-purple-300 px-1 py-1"
                  placeholder="Service title"
                  autoFocus
                />
                <button
                  onClick={() => setShowColorPicker(true)}
                  className="w-6 h-6 rounded-full border-2 border-gray-600 hover:border-gray-400 transition-colors flex-shrink-0"
                  style={{ backgroundColor: tempData.customColor || getDefaultColor(data.type) }}
                  title="Change color"
                />
              </div>
            ) : (
              <h3 className="text-white font-medium text-sm truncate">{data.title}</h3>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            {!isEditing && (
              <button
                onClick={(e) => { e.stopPropagation(); toggleExpand(); }}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
            )}
            
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>

              {/* Context menu */}
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-8 bg-gray-800/95 backdrop-blur-sm rounded-lg border border-gray-700 shadow-2xl z-50 py-2 min-w-[140px]">
                    <button
                      onClick={handleEdit}
                      className="w-full px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => { setShowColorPicker(true); setShowMenu(false); }}
                      className="w-full px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Palette className="w-3 h-3" />
                      Color
                    </button>
                    <button
                      onClick={() => console.log('Duplicate:', id)}
                      className="w-full px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Copy className="w-3 h-3" />
                      Duplicate
                    </button>
                    <button
                      onClick={() => { data.disabled = !data.disabled; setShowMenu(false); }}
                      className="w-full px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Power className="w-3 h-3" />
                      {data.disabled ? 'Enable' : 'Disable'}
                    </button>
                    <div className="border-t border-gray-700 my-1" />
                    <button
                      onClick={() => console.log('Delete:', id)}
                      className="w-full px-3 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Content - Only visible when expanded */}
        <div className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          {/* Tech Used */}
          <div className="mb-3">
            <label className="text-xs text-gray-400 block mb-1">Technologies</label>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 min-h-[24px] flex flex-wrap gap-1">
                  {tempData.techUsed.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded border border-purple-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                  {tempData.techUsed.length === 0 && (
                    <span className="text-gray-500 text-xs">No technologies selected</span>
                  )}
                </div>
                <button
                  onClick={() => setShowTechSelector(true)}
                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" />
                  Select
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1">
                {(data.techUsed || []).length > 0 ? (
                  data.techUsed.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-xs">No technologies specified</span>
                )}
              </div>
            )}
          </div>

          {/* Use Case */}
          <div className="mb-3">
            <label className="text-xs text-gray-400 block mb-1">Use Case</label>
            {isEditing ? (
              <textarea
                value={tempData.usecase}
                onChange={(e) => setTempData(prev => ({ ...prev, usecase: e.target.value }))}
                onKeyDown={handleKeyPress}
                className="w-full bg-transparent text-gray-300 text-xs border border-gray-600 rounded focus:outline-none focus:border-gray-400 px-2 py-1 resize-none"
                placeholder="What is this service used for?"
                rows={2}
              />
            ) : (
              <p className="text-gray-300 text-xs">
                {data.usecase || 'No use case specified'}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="text-xs text-gray-400 block mb-1">Description</label>
            {isEditing ? (
              <textarea
                value={tempData.description}
                onChange={(e) => setTempData(prev => ({ ...prev, description: e.target.value }))}
                onKeyDown={handleKeyPress}
                className="w-full bg-transparent text-gray-300 text-xs border border-gray-600 rounded focus:outline-none focus:border-gray-400 px-2 py-1 resize-none"
                placeholder="Detailed description of the service"
                rows={2}
              />
            ) : (
              <p className="text-gray-300 text-xs">
                {data.description || 'No description provided'}
              </p>
            )}
          </div>

          {/* Edit controls */}
          {isEditing && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700">
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-1.5 bg-purple-600 text-white text-xs rounded hover:bg-purple-500 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-3 py-1.5 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Keyboard shortcut hint */}
          {isEditing && (
            <div className="text-xs text-gray-500 mt-2 text-center">
              Ctrl+Enter to save • Esc to cancel
            </div>
          )}
        </div>

        {/* Color picker */}
        {showColorPicker && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowColorPicker(false)}
            />
            <div className="absolute top-0 right-0 bg-gray-800/95 backdrop-blur-sm rounded-lg border border-gray-700 shadow-2xl z-50 p-3">
              <h4 className="text-white text-xs font-medium mb-2">Choose Color</h4>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleColorSelect('')}
                  className="w-6 h-6 rounded border-2 border-gray-500 bg-gradient-to-br from-gray-500/20 to-gray-700/20"
                  title="Default"
                />
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className="w-6 h-6 rounded border-2 border-gray-600 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tech Selector Modal */}
      <TechSelector
        isOpen={showTechSelector}
        onClose={() => setShowTechSelector(false)}
        selectedTechs={tempData.techUsed}
        onTechToggle={handleTechToggle}
      />
    </>
  );
}