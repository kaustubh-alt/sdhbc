import React, { useState } from 'react';
import { Plus, Database, Github, Server, Zap, Globe, Code, FolderPlus, Router, Shield, BarChart3, Settings, Cloud } from 'lucide-react';

const nodeTemplates = [
  // Frontend (Client Layer)
  { type: 'frontend', label: 'Frontend App', icon: Globe, color: 'text-blue-400' },
  { type: 'mobile', label: 'Mobile App', icon: Globe, color: 'text-purple-400' },
  { type: 'cdn', label: 'CDN', icon: Cloud, color: 'text-cyan-400' },
  
  // Backend (Application Layer)
  { type: 'backend', label: 'Backend Service', icon: Code, color: 'text-orange-400' },
  { type: 'api', label: 'API Gateway', icon: Server, color: 'text-green-400' },
  { type: 'microservice', label: 'Microservice', icon: Server, color: 'text-emerald-400' },
  { type: 'serverless', label: 'Serverless Function', icon: Zap, color: 'text-yellow-400' },
  { type: 'message-broker', label: 'Message Broker', icon: Router, color: 'text-pink-400' },
  
  // Database Layer
  { type: 'database', label: 'Database', icon: Database, color: 'text-blue-400' },
  { type: 'nosql', label: 'NoSQL Database', icon: Database, color: 'text-purple-500' },
  { type: 'cache', label: 'Cache', icon: Zap, color: 'text-yellow-400' },
  { type: 'search', label: 'Search Engine', icon: Database, color: 'text-indigo-400' },
  { type: 'data-warehouse', label: 'Data Warehouse', icon: Database, color: 'text-blue-600' },
  
  // Cloud & Infrastructure
  { type: 'cloud', label: 'Cloud Provider', icon: Cloud, color: 'text-sky-400' },
  { type: 'container', label: 'Container', icon: Settings, color: 'text-gray-400' },
  { type: 'orchestration', label: 'Orchestration', icon: Settings, color: 'text-blue-500' },
  { type: 'load-balancer', label: 'Load Balancer', icon: Router, color: 'text-green-500' },
  { type: 'storage', label: 'Storage Service', icon: Database, color: 'text-teal-400' },
  
  // Security & Authentication
  { type: 'auth', label: 'Authentication', icon: Shield, color: 'text-red-400' },
  { type: 'security', label: 'Security Service', icon: Shield, color: 'text-red-500' },
  
  // Observability & Reliability
  { type: 'monitoring', label: 'Monitoring', icon: BarChart3, color: 'text-yellow-500' },
  { type: 'logging', label: 'Logging', icon: BarChart3, color: 'text-amber-400' },
  { type: 'tracing', label: 'Tracing', icon: BarChart3, color: 'text-orange-500' },
  
  // Middleware & Supporting
  { type: 'middleware', label: 'Middleware', icon: Router, color: 'text-cyan-500' },
  { type: 'proxy', label: 'Proxy', icon: Router, color: 'text-gray-500' },
  { type: 'queue', label: 'Task Queue', icon: Settings, color: 'text-violet-400' },
  { type: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-pink-500' },
  
  // Version Control & CI/CD
  { type: 'github', label: 'GitHub Repo', icon: Github, color: 'text-gray-300' },
];

export default function AddNodeButton({ onAdd, onAddSection }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddNode = (type) => {
    onAdd(type);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      {/* Node type selector */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Template menu */}
          <div className="absolute bottom-16 right-0 bg-gray-900/95 backdrop-blur-sm border border-gray-600 rounded-lg p-4 shadow-2xl min-w-[220px] max-w-[280px] z-50 max-h-[70vh] overflow-y-auto">
            <h3 className="text-white font-medium text-sm mb-3">🏗️ Add Component</h3>
            <div className="space-y-1.5">
              <button
                onClick={() => { onAddSection(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 p-2.5 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors border-b border-gray-700 mb-3 pb-3"
              >
                <FolderPlus className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-sm font-medium">New Section</span>
              </button>
              {nodeTemplates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <button
                    key={template.type}
                    onClick={() => handleAddNode(template.type)}
                    className="w-full flex items-center gap-3 p-2.5 text-left text-gray-300 hover:text-white hover:bg-gray-800/70 rounded-md transition-all duration-200 hover:scale-[1.02]"
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${template.color}`} />
                    <span className="text-sm font-medium">{template.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Main add button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 bg-gray-900/80 hover:bg-purple-600 text-gray-300 hover:text-white rounded-full border border-gray-600 hover:border-purple-500 backdrop-blur-sm transition-all duration-200 flex items-center justify-center group ${
          isOpen ? 'rotate-45' : 'hover:scale-110'
        }`}
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}