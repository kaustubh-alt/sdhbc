import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Search, SortAsc, User, CreditCard } from 'lucide-react';

export default function MenuBar({ 
  projects, 
  currentProject, 
  onNewProject, 
  onSelectProject, 
  onDeleteProject,
  onSaveProject 
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'date', 'nodes'
  const [tempProjectData, setTempProjectData] = useState({ name: '', description: '' });

  // Mock user data - in real app this would come from props or context
  const userData = {
    name: 'John Doe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
    credits: 1250
  };

  const handleDeleteClick = (projectId, e) => {
    e.stopPropagation();
    setShowDeleteConfirm(projectId);
  };

  const confirmDelete = (projectId) => {
    onDeleteProject(projectId);
    setShowDeleteConfirm(null);
  };

  const handleEditClick = (project, e) => {
    e.stopPropagation();
    setEditingProject(project.id);
    setTempProjectData({ 
      name: project.name, 
      description: project.description || '' 
    });
  };

  const handleSaveEdit = (projectId) => {
    // Update project data - this would typically call a parent function
    const updatedProjects = projects.map(p => 
      p.id === projectId 
        ? { ...p, name: tempProjectData.name, description: tempProjectData.description }
        : p
    );
    setEditingProject(null);
    // In real implementation, you'd call an onUpdateProject function here
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setTempProjectData({ name: '', description: '' });
  };

  // Filter and sort projects
  const filteredAndSortedProjects = projects
    .filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'nodes':
          return (b.nodes?.length || 0) - (a.nodes?.length || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/30">
            <img 
              src={userData.avatar} 
              alt={userData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm truncate">{userData.name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <CreditCard className="w-3 h-3" />
              <span>{userData.credits.toLocaleString()} credits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Projects Header */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-white font-semibold text-lg mb-3">Projects</h2>
          
          {/* Action Bar */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={onNewProject}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-xs transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1.5 bg-gray-800 text-gray-300 border border-gray-600 rounded-md text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="nodes">Sort by Nodes</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-800 text-gray-300 border border-gray-600 rounded-md text-sm focus:outline-none focus:border-purple-500 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto">
          {filteredAndSortedProjects.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <p className="text-sm">
                {searchTerm ? 'No projects found' : 'No projects yet'}
              </p>
              {!searchTerm && (
                <p className="text-xs mt-1">Create your first project to get started</p>
              )}
            </div>
          ) : (
            <div className="p-3">
              {filteredAndSortedProjects.map((project) => (
                <div key={project.id} className="mb-2">
                  <div
                    className={`group flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      currentProject?.id === project.id
                        ? 'bg-gray-800/50 border-l-2 border-purple-500'
                        : 'hover:bg-gray-800/30 border-l-2 border-transparent'
                    }`}
                    onClick={() => onSelectProject(project)}
                  >
                    <div className="flex-1 min-w-0">
                      {editingProject === project.id ? (
                        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={tempProjectData.name}
                            onChange={(e) => setTempProjectData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-gray-800 text-white text-sm border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                            placeholder="Project name"
                            autoFocus
                          />
                          <textarea
                            value={tempProjectData.description}
                            onChange={(e) => setTempProjectData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full bg-gray-800 text-gray-300 text-xs border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 resize-none"
                            placeholder="Project description"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(project.id)}
                              className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-500 transition-colors font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1.5 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-500 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-white font-semibold text-base truncate mb-2">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                              <span>{project.nodes?.length || 0} nodes</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {editingProject !== project.id && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={(e) => handleEditClick(project, e)}
                          className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors"
                          title="Edit project"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(project.id, e)}
                          className="p-1.5 hover:bg-red-600/20 rounded-md text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Delete Confirmation */}
                  {showDeleteConfirm === project.id && (
                    <div className="mt-3 p-4 bg-red-600/10 border border-red-500/30 rounded-xl">
                      <p className="text-red-400 text-sm mb-3">Delete "{project.name}"?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => confirmDelete(project.id)}
                          className="px-4 py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-500 transition-colors font-medium"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-2 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}