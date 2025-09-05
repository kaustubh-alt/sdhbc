import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ResizablePanel({ 
  children, 
  side = 'left', 
  defaultWidth = 256, 
  minWidth = 200, 
  maxWidth = 500,
  className = '',
  isCollapsed: externalCollapsed,
  onToggle: externalToggle
}) {
  const [width, setWidth] = useState(defaultWidth);
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef(null);
  
  // Use external collapse state if provided, otherwise use internal
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const toggleCollapse = externalToggle || (() => setInternalCollapsed(!internalCollapsed));

  const handleMouseDown = useCallback((e) => {
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = width;
    
    const handleMouseMove = (e) => {
      const deltaX = side === 'left' ? e.clientX - startX : startX - e.clientX;
      const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + deltaX));
      setWidth(newWidth);
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [width, side, minWidth, maxWidth]);

  const getCollapsedWidth = () => {
    return 0; // Completely hidden for both sides
  };

  return (
    <div
      ref={panelRef}
      className={`relative bg-gray-900 border-gray-700 transition-all duration-300 ${
        side === 'left' ? 'border-r' : 'border-l'
      } ${className}`}
      style={{
        width: isCollapsed ? getCollapsedWidth() : width,
        minWidth: isCollapsed ? getCollapsedWidth() : minWidth,
        maxWidth: isCollapsed ? getCollapsedWidth() : maxWidth,
        overflow: isCollapsed ? 'hidden' : 'visible'
      }}
    >
      {/* Content */}
      <div className={`h-full overflow-hidden ${isCollapsed && side === 'left' ? 'opacity-0' : ''}`}>
        {children}
      </div>
      
      {/* Resize handle */}
      {!isCollapsed && (
        <div
          className={`absolute top-0 w-1 h-full cursor-col-resize hover:bg-purple-500/50 transition-colors ${
            side === 'left' ? 'right-0' : 'left-0'
          } ${isResizing ? 'bg-purple-500' : 'bg-transparent'}`}
          onMouseDown={handleMouseDown}
        />
      )}
      
      {/* Collapse/Expand button for left panel */}
      {side === 'left' && (
        <div className={`absolute top-4 right-4 transition-all duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button
            onClick={toggleCollapse}
            className="w-8 h-8 bg-gray-800/90 hover:bg-gray-700 border border-gray-600 rounded-lg flex items-center justify-center transition-all backdrop-blur-sm shadow-lg"
          >
            <ChevronLeft className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      )}
      
      {/* Collapse/Expand button for right panel */}
      {side === 'right' && (
        <div className={`absolute top-4 left-4 transition-all duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button
            onClick={toggleCollapse}
            className="w-8 h-8 bg-gray-800/90 hover:bg-gray-700 border border-gray-600 rounded-lg flex items-center justify-center transition-all backdrop-blur-sm shadow-lg"
          >
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      )}
    </div>
  );
}