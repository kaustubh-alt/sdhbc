import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  BackgroundVariant,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toPng } from 'html-to-image';
import { Download, Save, MessageCircle, Menu } from 'lucide-react';

import CustomNode from './components/CustomNode';
import AddNodeButton from './components/AddNodeButton';
import Section from './components/Section';
import MenuBar from './components/MenuBar';
import ChatInterface from './components/ChatInterface';
import ResizablePanel from './components/ResizablePanel';
import { saveToStorage, loadFromStorage, clearStorage } from './utils/storage';

const nodeTypes = {
  custom: CustomNode,
};

const getNodeDefaults = (type) => {
  const defaults = {
    // Frontend (Client Layer)
    frontend: { 
      title: 'Frontend App', 
      techUsed: ['React', 'TypeScript'],
      usecase: 'User interface',
      description: 'Client-side application for user interactions'
    },
    mobile: { 
      title: 'Mobile App', 
      techUsed: ['Flutter', 'React Native'],
      usecase: 'Mobile user interface',
      description: 'Native mobile application for iOS and Android'
    },
    cdn: { 
      title: 'CDN', 
      techUsed: ['Cloudflare', 'AWS CloudFront'],
      usecase: 'Content delivery',
      description: 'Global content delivery network for static assets'
    },
    
    // Backend (Application Layer)
    backend: { 
      title: 'Backend Service', 
      techUsed: ['Node.js', 'Express.js'],
      usecase: 'Business logic processing',
      description: 'Server-side application handling business logic'
    },
    api: { 
      title: 'API Gateway', 
      techUsed: ['Kong', 'AWS API Gateway'],
      usecase: 'API management and routing',
      description: 'Central entry point for all API requests'
    },
    microservice: { 
      title: 'Microservice', 
      techUsed: ['Node.js', 'Docker'],
      usecase: 'Specific business capability',
      description: 'Independent service handling specific business logic'
    },
    serverless: { 
      title: 'Serverless Function', 
      techUsed: ['AWS Lambda', 'Node.js'],
      usecase: 'Event-driven processing',
      description: 'Serverless function for specific tasks'
    },
    'message-broker': { 
      title: 'Message Broker', 
      techUsed: ['Kafka', 'RabbitMQ'],
      usecase: 'Asynchronous messaging',
      description: 'Message queue for decoupled communication'
    },
    
    // Database Layer
    database: { 
      title: 'SQL Database', 
      techUsed: ['PostgreSQL', 'MySQL'],
      usecase: 'Relational data storage',
      description: 'Primary database for structured data'
    },
    nosql: { 
      title: 'NoSQL Database', 
      techUsed: ['MongoDB', 'DynamoDB'],
      usecase: 'Document/key-value storage',
      description: 'NoSQL database for flexible data structures'
    },
    cache: { 
      title: 'Cache Layer', 
      techUsed: ['Redis', 'Memcached'],
      usecase: 'In-memory caching',
      description: 'High-speed data caching and session storage'
    },
    search: { 
      title: 'Search Engine', 
      techUsed: ['Elasticsearch', 'Solr'],
      usecase: 'Full-text search',
      description: 'Search and indexing service for data discovery'
    },
    'data-warehouse': { 
      title: 'Data Warehouse', 
      techUsed: ['BigQuery', 'Snowflake'],
      usecase: 'Analytics and reporting',
      description: 'Large-scale data storage for analytics'
    },
    
    // Cloud & Infrastructure
    cloud: { 
      title: 'Cloud Provider', 
      techUsed: ['AWS', 'Google Cloud'],
      usecase: 'Cloud infrastructure',
      description: 'Cloud platform hosting services and resources'
    },
    container: { 
      title: 'Container', 
      techUsed: ['Docker', 'Podman'],
      usecase: 'Application containerization',
      description: 'Containerized application deployment'
    },
    orchestration: { 
      title: 'Orchestration', 
      techUsed: ['Kubernetes', 'Amazon ECS'],
      usecase: 'Container management',
      description: 'Container orchestration and scaling'
    },
    'load-balancer': { 
      title: 'Load Balancer', 
      techUsed: ['HAProxy', 'NGINX'],
      usecase: 'Traffic distribution',
      description: 'Distributes incoming requests across multiple servers'
    },
    storage: { 
      title: 'Storage Service', 
      techUsed: ['Amazon S3', 'Google Cloud Storage'],
      usecase: 'Object storage',
      description: 'Scalable cloud storage for files and objects'
    },
    
    // Security & Authentication
    auth: { 
      title: 'Authentication Service', 
      techUsed: ['Auth0', 'OAuth 2.0'],
      usecase: 'User authentication',
      description: 'Identity and access management service'
    },
    security: { 
      title: 'Security Service', 
      techUsed: ['WAF', 'TLS/SSL'],
      usecase: 'Application security',
      description: 'Security layer protecting applications'
    },
    
    // Observability & Reliability
    monitoring: { 
      title: 'Monitoring', 
      techUsed: ['Prometheus', 'Grafana'],
      usecase: 'System monitoring',
      description: 'Real-time monitoring and alerting'
    },
    logging: { 
      title: 'Logging Service', 
      techUsed: ['ELK Stack', 'Splunk'],
      usecase: 'Log aggregation',
      description: 'Centralized logging and analysis'
    },
    tracing: { 
      title: 'Tracing Service', 
      techUsed: ['Jaeger', 'Zipkin'],
      usecase: 'Distributed tracing',
      description: 'Request tracing across microservices'
    },
    
    // Middleware & Supporting
    middleware: { 
      title: 'Middleware', 
      techUsed: ['NGINX', 'Envoy'],
      usecase: 'Request processing',
      description: 'Middleware layer for request/response processing'
    },
    proxy: { 
      title: 'Proxy Server', 
      techUsed: ['NGINX', 'Apache HTTP'],
      usecase: 'Request forwarding',
      description: 'Proxy server for routing and load balancing'
    },
    queue: { 
      title: 'Task Queue', 
      techUsed: ['Celery', 'Sidekiq'],
      usecase: 'Background processing',
      description: 'Background task processing and job queues'
    },
    analytics: { 
      title: 'Analytics Service', 
      techUsed: ['Google Analytics', 'Mixpanel'],
      usecase: 'User analytics',
      description: 'User behavior tracking and analytics'
    },
    
    // Version Control & CI/CD
    github: { 
      title: 'GitHub Repo', 
      techUsed: ['Git', 'GitHub Actions'],
      usecase: 'Version control and CI/CD',
      description: 'Source code repository with automated deployments'
    },
  };
  return defaults[type] || { 
    title: 'Service', 
    techUsed: [],
    usecase: 'Not specified',
    description: 'No description provided'
  };
};

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 200 },
    data: { 
      title: 'Postgres',
      techUsed: ['PostgreSQL'],
      usecase: 'Primary database',
      description: 'Main application database for user data and transactions',
      type: 'database',
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 600, y: 200 },
    data: { 
      title: 'determined-beauty',
      techUsed: ['React', 'Vite'],
      usecase: 'Frontend application',
      description: 'Main user interface built with React and Vite',
      type: 'github',
    },
  },
];

const initialEdges = [];

function App() {
  // Project management state
  const [projects, setProjects] = useState([
    {
      id: 'default',
      name: 'My First Project',
      nodes: initialNodes,
      edges: initialEdges,
      sections: [],
      createdAt: new Date(),
    }
  ]);
  const [currentProject, setCurrentProject] = useState(projects[0]);

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(currentProject.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentProject.edges);
  const [sections, setSections] = useState(currentProject.sections);
  const [contextMenu, setContextMenu] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  
  // ADD THESE STATE VARIABLES FOR PANEL MANAGEMENT
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  // UPDATE THESE TOGGLE FUNCTIONS
  const toggleLeftPanel = useCallback(() => {
    setLeftPanelCollapsed(!leftPanelCollapsed);
  }, [leftPanelCollapsed]);

  const toggleRightPanel = useCallback(() => {
    setRightPanelCollapsed(!rightPanelCollapsed);
  }, [rightPanelCollapsed]);

  // Fixed connection callback with proper edge styling
  const onConnect = useCallback(
    (params) => {
      // Get source and target nodes
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      // Determine arrow direction based on actual node positions and handles
      const sourceY = sourceNode?.position?.y || 0;
      const targetY = targetNode?.position?.y || 0;
      const sourceX = sourceNode?.position?.x || 0;
      const targetX = targetNode?.position?.x || 0;
      
      // Determine connection direction based on handle positions
      let connectionDirection = 'horizontal';
      if (params.sourceHandle?.includes('bottom') || params.targetHandle?.includes('top')) {
        connectionDirection = 'vertical-down';
      } else if (params.sourceHandle?.includes('top') || params.targetHandle?.includes('bottom')) {
        connectionDirection = 'vertical-up';
      } else if (sourceY < targetY) {
        connectionDirection = 'vertical-down';
      } else if (sourceY > targetY) {
        connectionDirection = 'vertical-up';
      }
      
      let edgeType = 'smoothstep';
      let markerEnd = {
        type: 'arrowclosed',
        color: '#ffffff',
        width: 16,
        height: 16,
      };
      
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        type: edgeType,
        animated: false,
        style: {
          stroke: '#ffffff',
          strokeWidth: 2,
          strokeDasharray: '0',
        },
        markerEnd,
        label: 'API',
        labelStyle: {
          fill: '#ffffff',
          fontSize: '12px',
          fontWeight: '500',
        },
        labelBgStyle: {
          fill: 'rgba(0, 0, 0, 0.7)',
          fillOpacity: 1,
          rx: 4,
          ry: 4,
        },
        labelBgPadding: [4, 8],
        labelBgBorderRadius: 4,
        data: {
          connectionDirection,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, nodes]
  );

  const addNode = useCallback((type) => {
    const defaults = getNodeDefaults(type);
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { 
        x: Math.random() * 400 + 200, 
        y: Math.random() * 300 + 150 
      },
      data: {
        title: defaults.title,
        techUsed: defaults.techUsed,
        usecase: defaults.usecase,
        description: defaults.description,
        type: type,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const addSection = useCallback(() => {
    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
    const newSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      description: 'Organize related services here',
      color: colors[Math.floor(Math.random() * colors.length)],
      position: { 
        x: Math.random() * 300 + 100, 
        y: Math.random() * 200 + 100 
      },
      size: { width: 400, height: 300 },
      isCollapsed: false,
    };
    setSections(prev => [...prev, newSection]);
  }, []);

  const updateSection = useCallback((id, updates) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ));
  }, []);

  const deleteSection = useCallback((id) => {
    setSections(prev => prev.filter(section => section.id !== id));
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const duplicateNode = useCallback((nodeId) => {
    const nodeToDuplicate = nodes.find(node => node.id === nodeId);
    if (nodeToDuplicate) {
      const newNode = {
        ...nodeToDuplicate,
        id: `node-${Date.now()}`,
        position: {
          x: nodeToDuplicate.position.x + 50,
          y: nodeToDuplicate.position.y + 50,
        },
        data: {
          ...nodeToDuplicate.data,
          title: `${nodeToDuplicate.data.title} Copy`,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    }
  }, [nodes, setNodes]);

  const toggleNodeDisabled = useCallback((nodeId) => {
    setNodes((nds) => 
      nds.map((node) => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, disabled: !node.data.disabled } }
          : node
      )
    );
    
    // Also fade the connected edges
    setEdges((eds) => 
      eds.map((edge) => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        const shouldFade = sourceNode?.data.disabled || targetNode?.data.disabled;
        
        return {
          ...edge,
          style: {
            ...edge.style,
            opacity: shouldFade ? 0.3 : 1,
          }
        };
      })
    );
  }, [nodes, setNodes, setEdges]);

  const handlePaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Project management functions
  const handleNewProject = useCallback(() => {
    const newProject = {
      id: `project-${Date.now()}`,
      name: `Project ${projects.length + 1}`,
      nodes: [],
      edges: [],
      sections: [],
      createdAt: new Date(),
    };
    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    setNodes([]);
    setEdges([]);
    setSections([]);
  }, [projects.length, setNodes, setEdges]);

  const handleSelectProject = useCallback((project) => {
    setCurrentProject(project);
    setNodes(project.nodes || []);
    setEdges(project.edges || []);
    setSections(project.sections || []);
  }, [setNodes, setEdges]);

  const handleDeleteProject = useCallback((projectId) => {
    if (projects.length <= 1) {
      alert('Cannot delete the last project');
      return;
    }
    
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    
    if (currentProject.id === projectId) {
      handleSelectProject(updatedProjects[0]);
    }
  }, [projects, currentProject, handleSelectProject]);

  const handleSaveProject = useCallback((projectId) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, nodes, edges, sections }
        : project
    ));
    
    // Save to localStorage
    saveToStorage({ projects: projects.map(p => 
      p.id === projectId ? { ...p, nodes, edges, sections } : p
    )});
  }, [nodes, edges, sections, projects]);

  const handleApplyAIChanges = useCallback((changes) => {
    if (changes.nodes) {
      setNodes(changes.nodes);
    }
    if (changes.edges) {
      setEdges(changes.edges);
    }
    if (changes.sections) {
      setSections(changes.sections);
    }
  }, [setNodes, setEdges]);
  const exportToPng = useCallback(async () => {
    if (reactFlowWrapper.current === null) return;

    setIsExporting(true);
    try {
      // Hide all UI elements during export
      const controls = reactFlowWrapper.current.querySelector('.react-flow__controls');
      const minimap = reactFlowWrapper.current.querySelector('.react-flow__minimap');
      const toolbar = document.querySelector('[class*="absolute"][class*="top-6"][class*="right-6"]');
      const addButton = document.querySelector('[class*="absolute"][class*="bottom-6"][class*="right-6"]');
      const chatButton = document.querySelector('[class*="fixed"][class*="top-6"][class*="right-6"]');
      const leftToggle = document.querySelector('[class*="fixed"][class*="top-6"][class*="left-6"]');
      
      if (controls) controls.style.display = 'none';
      if (minimap) minimap.style.display = 'none';
      if (toolbar) toolbar.style.display = 'none';
      if (addButton) addButton.style.display = 'none';
      if (chatButton) chatButton.style.display = 'none';
      if (leftToggle) leftToggle.style.display = 'none';

      // Get the actual flow viewport for better bounds
      const flowViewport = reactFlowWrapper.current.querySelector('.react-flow__viewport');
      const targetElement = flowViewport || reactFlowWrapper.current;

      const dataUrl = await toPng(targetElement, {
        backgroundColor: '#0f0f1a',
        pixelRatio: 2,
        quality: 1,
        filter: (node) => {
          // Filter out all UI elements
          if (!node.classList) return true;
          return !node.classList.contains('react-flow__controls') && 
                 !node.classList.contains('react-flow__minimap') &&
                 !node.classList.contains('react-flow__attribution') &&
                 !node.closest('[class*="absolute"]') &&
                 !node.closest('[class*="fixed"]');
        },
      });

      // Restore hidden elements
      if (controls) controls.style.display = '';
      if (minimap) minimap.style.display = '';
      if (toolbar) toolbar.style.display = '';
      if (addButton) addButton.style.display = '';
      if (chatButton) chatButton.style.display = '';
      if (leftToggle) leftToggle.style.display = '';

      const link = document.createElement('a');
      link.download = `railway-canvas-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export:', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const exportToJson = useCallback(() => {
    const exportData = {
      project: {
        id: currentProject.id,
        name: currentProject.name,
        createdAt: currentProject.createdAt,
      },
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          title: node.data.title,
          techUsed: node.data.techUsed || [],
          usecase: node.data.usecase || '',
          description: node.data.description || '',
          type: node.data.type,
          customColor: node.data.customColor || '',
          disabled: node.data.disabled || false,
        }
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
        animated: edge.animated,
        style: edge.style,
      })),
      sections: sections,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.download = `${currentProject.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [currentProject, nodes, edges, sections]);

  // Auto-save on changes
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentProject) {
        handleSaveProject(currentProject.id);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [nodes, edges, sections, currentProject, handleSaveProject]);

  return (
    <div className="w-full h-screen bg-[#0f0f1a] overflow-hidden flex">
      {/* Left Menu Bar - FIXED VERSION */}
      <ResizablePanel 
        side="left" 
        defaultWidth={320} 
        minWidth={250} 
        maxWidth={500} 
        isCollapsed={leftPanelCollapsed} 
        onToggle={toggleLeftPanel}
      >
        <MenuBar
          projects={projects}
          currentProject={currentProject}
          onNewProject={handleNewProject}
          onSelectProject={handleSelectProject}
          onDeleteProject={handleDeleteProject}
          onSaveProject={handleSaveProject}
        />
      </ResizablePanel>

      {/* Left panel reopen button when collapsed */}
      {leftPanelCollapsed && (
        <button
          onClick={toggleLeftPanel}
          className="fixed top-6 left-6 z-50 w-12 h-12 bg-gray-800/90 hover:bg-purple-600 text-gray-300 hover:text-white rounded-full border border-gray-600 hover:border-purple-500 backdrop-blur-sm transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Center Canvas */}
      <div className="flex-1 relative">
        <ReactFlowProvider>
          <div ref={reactFlowWrapper} className="w-full h-full">
            {/* Sections */}
            {sections.map(section => (
              <Section
                key={section.id}
                {...section}
                onUpdate={updateSection}
                onDelete={deleteSection}
              />
            ))}
            
            <ReactFlow
              nodes={nodes}
              edges={edges.map(edge => ({
                ...edge,
                style: {
                  ...edge.style,
                  stroke: hoveredEdge === edge.id ? '#8b5cf6' : '#ffffff',
                  strokeWidth: hoveredEdge === edge.id ? 3 : 2,
                },
                markerEnd: {
                  ...edge.markerEnd,
                  color: hoveredEdge === edge.id ? '#8b5cf6' : '#ffffff',
                }
              }))}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onPaneClick={handlePaneClick}
              nodeTypes={nodeTypes}
              fitView
              className="bg-[#0f0f1a]"
              connectionMode={ConnectionMode.Loose}
              defaultEdgeOptions={{
                style: { 
                  stroke: '#ffffff', 
                  strokeWidth: 2,
                },
                type: 'smoothstep',
                animated: false,
                markerEnd: {
                  type: 'arrowclosed',
                  color: '#ffffff',
                },
              }}
              connectionLineStyle={{
                stroke: '#ffffff',
                strokeWidth: 2,
                strokeDasharray: '5,5',
              }}
              onEdgeMouseEnter={(event, edge) => {
                setEdges((eds) => 
                  eds.map((e) => 
                    e.id === edge.id 
                      ? { 
                          ...e, 
                          style: { 
                            ...e.style, 
                            stroke: '#8b5cf6', 
                            strokeWidth: 3 
                          },
                          markerEnd: {
                            ...e.markerEnd,
                            color: '#8b5cf6',
                          }
                        }
                      : e
                  )
                );
              }}
              onEdgeClick={(event, edge) => {
                event.stopPropagation();
                const action = confirm('Click OK to edit label, Cancel to delete connection');
                if (action) {
                  // Edit label
                  const newLabel = prompt('Enter connection label:', edge.label || 'API');
                  if (newLabel !== null) {
                    const trimmedLabel = newLabel.trim();
                    if (trimmedLabel !== '') {
                    setEdges((eds) => 
                      eds.map((e) => 
                        e.id === edge.id 
                          ? { 
                                label: trimmedLabel,
                              label: newLabel.trim(),
                              labelStyle: {
                                fill: '#ffffff',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer',
                              },
                              labelBgStyle: {
                                fill: 'rgba(0, 0, 0, 0.7)',
                                fillOpacity: 1,
                                rx: 4,
                                ry: 4,
                              },
                              labelBgPadding: [4, 8],
                              style: {
                                ...e.style,
                                stroke: '#ffffff',
                                strokeWidth: 2,
                              },
                              markerEnd: {
                                ...e.markerEnd,
                                type: 'arrowclosed',
                                color: '#ffffff',
                              }
                            }
                          : e
                      )
                    );
                    }
                  }
                } else {
                  // Delete edge
                  setEdges((eds) => eds.filter((e) => e.id !== edge.id));
                  setHoveredEdge(null);
                }
              }}
            >
              <Controls 
                className="!bg-gray-800/80 !border-gray-700 !rounded-lg !backdrop-blur-sm shadow-xl"
                showZoom={true}
                showFitView={true}
                showInteractive={true}
              />
              <MiniMap 
                className="!bg-gray-800/80 !border-gray-700 !rounded-lg !backdrop-blur-sm shadow-xl"
                nodeColor="#4c4c6d"
                maskColor="rgba(15, 15, 26, 0.8)"
                pannable={true}
                zoomable={true}
              />
              <Background 
                variant={BackgroundVariant.Dots}
                gap={24}
                size={1}
                color="#2a2a3a"
              />
            </ReactFlow>
          </div>
          
          {/* Toolbar - Top Right */}
          <div className="absolute top-6 right-6 z-40 flex gap-3">
            <div className="flex gap-2">
              <button
                onClick={exportToPng}
                disabled={isExporting}
                className="px-4 py-2 bg-gray-800/90 text-gray-200 rounded-lg border border-gray-700 hover:bg-gray-700/80 transition-colors backdrop-blur-sm flex items-center gap-2 disabled:opacity-50 shadow-lg"
                title="Export to PNG"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Exporting...' : 'PNG'}
              </button>
              <button
                onClick={exportToJson}
                className="px-4 py-2 bg-gray-800/90 text-gray-200 rounded-lg border border-gray-700 hover:bg-gray-700/80 transition-colors backdrop-blur-sm flex items-center gap-2 shadow-lg"
                title="Export to JSON"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
            </div>
          </div>

          {/* Add Node Button - Bottom Right */}
          <div className="absolute bottom-6 right-6 z-40">
            <AddNodeButton onAdd={addNode} onAddSection={addSection} />
          </div>

          {/* Welcome message for empty canvas */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center text-gray-400">
                <h2 className="text-2xl font-light mb-2">Welcome to {currentProject.name}</h2>
                <p className="text-sm">Click the + button to add your first service</p>
              </div>
            </div>
          )}
        </ReactFlowProvider>
      </div>

      {/* Right Chat Interface */}
      {!rightPanelCollapsed && (
        <ResizablePanel 
          side="right" 
          defaultWidth={320} 
          minWidth={280} 
          maxWidth={500} 
          isCollapsed={rightPanelCollapsed} 
          onToggle={toggleRightPanel}
        >
          <ChatInterface 
            currentProject={currentProject}
            nodes={nodes}
            edges={edges}
            sections={sections}
            onApplyChanges={handleApplyAIChanges}
          />
        </ResizablePanel>
      )}
      
      {/* Chat toggle button when right panel is collapsed */}
      {rightPanelCollapsed && (
        <button
          onClick={toggleRightPanel}
          className="fixed top-6 right-6 z-50 w-12 h-12 bg-gray-800/90 hover:bg-purple-600 text-gray-300 hover:text-white rounded-full border border-gray-600 hover:border-purple-500 backdrop-blur-sm transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
          title="Open Chat"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default App;