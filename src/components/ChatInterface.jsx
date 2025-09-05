import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';

export default function ChatInterface({ currentProject, nodes, edges, sections, onApplyChanges }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI assistant. I can help you with your canvas design, suggest improvements, or answer questions about your project.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    // Only attempt WebSocket connection if explicitly enabled
    const enableWebSocket = import.meta.env.VITE_ENABLE_WEBSOCKET === 'true';
    
    if (!enableWebSocket) {
      console.log('WebSocket disabled, using simulation mode');
      return;
    }

    const connectWebSocket = () => {
      try {
        const websocket = new WebSocket('ws://localhost:8080/chat');
        
        websocket.onopen = () => {
          console.log('WebSocket connected');
          setWsConnected(true);
          setWs(websocket);
        };
        
        websocket.onmessage = (event) => {
          try {
            const response = JSON.parse(event.data);
            
            const aiResponse = {
              id: Date.now(),
              type: 'bot',
              content: response.text || 'I received your message but couldn\'t generate a response.',
              timestamp: new Date(),
              hasChanges: !!response.graph
            };

            setMessages(prev => [...prev, aiResponse]);
            
            if (response.graph) {
              setPendingChanges(response.graph);
            }
            
            setIsLoading(false);
          } catch (error) {
            console.error('Error parsing WebSocket response:', error);
            setIsLoading(false);
          }
        };
        
        websocket.onclose = () => {
          console.log('WebSocket disconnected');
          setWsConnected(false);
          setWs(null);
        };
        
        websocket.onerror = (error) => {
          console.error('WebSocket error:', error);
          console.log('Falling back to simulation mode');
          setWsConnected(false);
          setWs(null);
          setIsLoading(false);
        };
        
        return websocket;
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        console.log('Using simulation mode instead');
        setWsConnected(false);
        return null;
      }
    };

    const websocket = connectWebSocket();
    
    // Set a timeout to fallback to simulation if connection fails
    const connectionTimeout = setTimeout(() => {
      if (!wsConnected) {
        console.log('WebSocket connection timeout, using simulation mode');
        setWsConnected(false);
        if (websocket) {
          websocket.close();
        }
      }
    }, 3000);
    
    return () => {
      clearTimeout(connectionTimeout);
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const getCurrentGraphData = () => {
    return {
      project: {
        id: currentProject?.id,
        name: currentProject?.name,
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
        label: edge.label,
        animated: edge.animated,
        style: edge.style,
      })),
      sections: sections || []
    };
  };

  const simulateAIResponse = (userMessage, graphData) => {
    // Enhanced AI responses with graph modifications
    const responses = {
      'add database': {
        text: 'I\'ll add a PostgreSQL database to your architecture. This will provide reliable data storage for your application.',
        changes: {
          nodes: [
            ...graphData.nodes,
            {
              id: `node-${Date.now()}`,
              type: 'custom',
              position: { x: 100, y: 300 },
              data: {
                title: 'PostgreSQL Database',
                techUsed: ['PostgreSQL'],
                usecase: 'Primary data storage',
                description: 'Main database for application data',
                type: 'database',
              }
            }
          ],
          edges: graphData.edges,
          sections: graphData.sections
        }
      },
      'add api': {
        text: 'I\'ll add an API Gateway to manage your service communications. This will help with routing and load balancing.',
        changes: {
          nodes: [
            ...graphData.nodes,
            {
              id: `node-${Date.now()}`,
              type: 'custom',
              position: { x: 400, y: 200 },
              data: {
                title: 'API Gateway',
                techUsed: ['Kong', 'NGINX'],
                usecase: 'API management',
                description: 'Central API routing and management',
                type: 'api',
              }
            }
          ],
          edges: graphData.edges,
          sections: graphData.sections
        }
      },
      'add cache': {
        text: 'I\'ll add a Redis cache layer to improve your application performance by storing frequently accessed data.',
        changes: {
          nodes: [
            ...graphData.nodes,
            {
              id: `node-${Date.now()}`,
              type: 'custom',
              position: { x: 600, y: 100 },
              data: {
                title: 'Redis Cache',
                techUsed: ['Redis'],
                usecase: 'Performance optimization',
                description: 'In-memory cache for fast data access',
                type: 'cache',
              }
            }
          ],
          edges: graphData.edges,
          sections: graphData.sections
        }
      },
      'connect services': {
        text: 'I\'ll connect your services with proper API connections to show the data flow.',
        changes: {
          nodes: graphData.nodes,
          edges: [
            ...graphData.edges,
            {
              id: `edge-${Date.now()}`,
              source: graphData.nodes[0]?.id,
              target: graphData.nodes[1]?.id,
              sourceHandle: 'right-source',
              targetHandle: 'left',
              type: 'smoothstep',
              label: 'REST API',
              style: { stroke: '#ffffff', strokeWidth: 2 },
              markerEnd: { type: 'arrowclosed', color: '#ffffff' },
              labelStyle: { fill: '#ffffff', fontSize: '12px', fontWeight: '500' },
              labelBgStyle: { fill: 'rgba(0, 0, 0, 0.7)', fillOpacity: 1, rx: 4, ry: 4 },
            }
          ],
          sections: graphData.sections
        }
      },
      'default': {
        text: 'I can help you with:\n• Adding services (database, API, cache, etc.)\n• Connecting services\n• Organizing your architecture\n• Best practices for system design\n\nTry asking me to "add database" or "connect services"!',
        changes: null
      }
    };

    const lowerMessage = userMessage.toLowerCase();
    
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    return responses.default;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const graphData = getCurrentGraphData();
      
      if (ws && wsConnected) {
        // Send via WebSocket
        const payload = {
          prompt: userMessage.content,
          currentGraph: graphData,
          timestamp: new Date().toISOString()
        };
        
        ws.send(JSON.stringify(payload));
        // Response will be handled in onmessage
      } else {
        // Fallback to simulation
        const response = simulateAIResponse(userMessage.content, graphData);
        
        const aiResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.text,
          timestamp: new Date(),
          hasChanges: !!response.changes
        };

        setMessages(prev => [...prev, aiResponse]);
        
        if (response.changes) {
          setPendingChanges(response.changes);
        }
        
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsLoading(false);
    }
  };

  const handleApplyChanges = () => {
    if (pendingChanges && onApplyChanges) {
      onApplyChanges(pendingChanges);
      setPendingChanges(null);
      
      // Add confirmation message
      const confirmMessage = {
        id: Date.now(),
        type: 'bot',
        content: '✅ Changes applied successfully to your canvas!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, confirmMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
            <div className="flex items-center gap-2">
              {wsConnected ? (
                <>
                  <Wifi className="w-3 h-3 text-green-400" />
                  <p className="text-green-400 text-xs">WebSocket Connected</p>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-yellow-400" />
                  <p className="text-yellow-400 text-xs">Simulation Mode</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                message.type === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
                  : 'bg-gradient-to-br from-purple-600 to-purple-700'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block max-w-[85%] p-3 rounded-2xl shadow-sm ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md'
                    : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-md'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-1">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>

            {/* Apply Changes Button */}
            {message.type === 'bot' && message.hasChanges && pendingChanges && (
              <div className="flex justify-start">
                <button
                  onClick={handleApplyChanges}
                  className="ml-11 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Apply Changes
                </button>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-md">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="inline-block bg-gray-800 border border-gray-700 p-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-900/50">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to add services, connect components, or improve your architecture..."
              className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
              rows={1}
              disabled={isLoading}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none min-w-[44px]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 px-1">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}