import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

const techCategories = {
  frontend: {
    name: 'Frontend (Client Layer)',
    color: 'text-blue-400',
    technologies: [
      { name: 'React', icon: '⚛️' },
      { name: 'Angular', icon: '🅰️' },
      { name: 'Vue.js', icon: '💚' },
      { name: 'Svelte', icon: '🧡' },
      { name: 'Flutter', icon: '📱' },
      { name: 'Swift', icon: '🍎' },
      { name: 'Kotlin', icon: '🤖' },
      { name: 'Redux', icon: '🔄' },
      { name: 'MobX', icon: '📦' },
      { name: 'Vuex', icon: '🗃️' },
      { name: 'Next.js', icon: '▲' },
      { name: 'Nuxt.js', icon: '💚' },
      { name: 'SSR', icon: '🖥️' },
      { name: 'CSR', icon: '🌐' },
      { name: 'REST Client', icon: '🔗' },
      { name: 'GraphQL Client', icon: '📊' },
      { name: 'gRPC Client', icon: '⚡' },
      { name: 'Cloudflare CDN', icon: '☁️' },
      { name: 'Akamai CDN', icon: '🌍' },
      { name: 'AWS CloudFront', icon: '📡' }
    ]
  },
  backend: {
    name: 'Backend (Application Layer)',
    color: 'text-green-400',
    technologies: [
      { name: 'Node.js', icon: '🟢' },
      { name: 'Express.js', icon: '🚂' },
      { name: 'NestJS', icon: '🐱' },
      { name: 'Django', icon: '🐍' },
      { name: 'Flask', icon: '🌶️' },
      { name: 'FastAPI', icon: '⚡' },
      { name: 'Spring Boot', icon: '🍃' },
      { name: 'Ruby on Rails', icon: '💎' },
      { name: 'Kong', icon: '🦍' },
      { name: 'NGINX', icon: '🌐' },
      { name: 'AWS API Gateway', icon: '🚪' },
      { name: 'Envoy', icon: '📮' },
      { name: 'Microservices', icon: '🔧' },
      { name: 'Monolith', icon: '🏗️' },
      { name: 'AWS Lambda', icon: '⚡' },
      { name: 'GCP Functions', icon: '☁️' },
      { name: 'Azure Functions', icon: '🔷' },
      { name: 'Kafka', icon: '📨' },
      { name: 'RabbitMQ', icon: '🐰' },
      { name: 'Redis Streams', icon: '🔴' },
      { name: 'ActiveMQ', icon: '📬' }
    ]
  },
  database: {
    name: 'Database Layer (Data Storage)',
    color: 'text-purple-400',
    technologies: [
      { name: 'MySQL', icon: '🐬' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'Oracle', icon: '🔴' },
      { name: 'MS SQL Server', icon: '🗄️' },
      { name: 'MongoDB', icon: '🍃' },
      { name: 'Cassandra', icon: '🏛️' },
      { name: 'DynamoDB', icon: '⚡' },
      { name: 'CouchDB', icon: '🛋️' },
      { name: 'Redis', icon: '🔴' },
      { name: 'Memcached', icon: '💾' },
      { name: 'Elasticsearch', icon: '🔍' },
      { name: 'Solr', icon: '☀️' },
      { name: 'Meilisearch', icon: '🔎' },
      { name: 'BigQuery', icon: '📊' },
      { name: 'Snowflake', icon: '❄️' },
      { name: 'Redshift', icon: '🔴' },
      { name: 'Hadoop', icon: '🐘' }
    ]
  },
  cloud: {
    name: 'Cloud & Infrastructure',
    color: 'text-orange-400',
    technologies: [
      { name: 'AWS', icon: '☁️' },
      { name: 'Google Cloud', icon: '🌤️' },
      { name: 'Microsoft Azure', icon: '🔷' },
      { name: 'Docker', icon: '🐳' },
      { name: 'Podman', icon: '🦭' },
      { name: 'Kubernetes', icon: '⚓' },
      { name: 'Amazon ECS', icon: '📦' },
      { name: 'OpenShift', icon: '🔴' },
      { name: 'HAProxy', icon: '⚖️' },
      { name: 'NGINX LB', icon: '🌐' },
      { name: 'AWS ELB', icon: '⚖️' },
      { name: 'Amazon S3', icon: '🪣' },
      { name: 'Google Cloud Storage', icon: '☁️' },
      { name: 'Azure Blob Storage', icon: '🔷' },
      { name: 'Cloudflare', icon: '☁️' },
      { name: 'Akamai', icon: '🌍' },
      { name: 'Fastly', icon: '⚡' }
    ]
  },
  security: {
    name: 'Security & Authentication',
    color: 'text-red-400',
    technologies: [
      { name: 'OAuth 2.0', icon: '🔐' },
      { name: 'OpenID Connect', icon: '🆔' },
      { name: 'SAML', icon: '🔒' },
      { name: 'JWT', icon: '🎫' },
      { name: 'RBAC', icon: '👥' },
      { name: 'ABAC', icon: '🏷️' },
      { name: 'Auth0', icon: '🔐' },
      { name: 'Okta', icon: '🔑' },
      { name: 'Keycloak', icon: '🗝️' },
      { name: 'AWS IAM', icon: '👤' },
      { name: 'TLS/SSL', icon: '🔒' },
      { name: 'AES Encryption', icon: '🔐' },
      { name: 'RSA Encryption', icon: '🔑' },
      { name: 'WAF', icon: '🛡️' },
      { name: 'Cloudflare Security', icon: '🛡️' },
      { name: 'ModSecurity', icon: '🔒' }
    ]
  },
  observability: {
    name: 'Observability & Reliability',
    color: 'text-yellow-400',
    technologies: [
      { name: 'Prometheus', icon: '📊' },
      { name: 'Grafana', icon: '📈' },
      { name: 'Datadog', icon: '🐕' },
      { name: 'New Relic', icon: '📊' },
      { name: 'ELK Stack', icon: '🦌' },
      { name: 'Elasticsearch', icon: '🔍' },
      { name: 'Logstash', icon: '📝' },
      { name: 'Kibana', icon: '📊' },
      { name: 'Splunk', icon: '🔍' },
      { name: 'Graylog', icon: '📋' },
      { name: 'Jaeger', icon: '🕵️' },
      { name: 'Zipkin', icon: '📍' },
      { name: 'OpenTelemetry', icon: '📡' },
      { name: 'PagerDuty', icon: '📟' },
      { name: 'Opsgenie', icon: '🚨' },
      { name: 'VictorOps', icon: '⚡' },
      { name: 'Gremlin', icon: '👹' },
      { name: 'Chaos Monkey', icon: '🐒' }
    ]
  },
  middleware: {
    name: 'Middleware & Supporting Components',
    color: 'text-cyan-400',
    technologies: [
      { name: 'NGINX Proxy', icon: '🌐' },
      { name: 'Envoy Proxy', icon: '📮' },
      { name: 'Apache HTTP', icon: '🪶' },
      { name: 'Celery', icon: '🌿' },
      { name: 'Sidekiq', icon: '💎' },
      { name: 'BullMQ', icon: '🐂' },
      { name: 'Google Analytics', icon: '📊' },
      { name: 'Mixpanel', icon: '🧪' },
      { name: 'Segment', icon: '📈' }
    ]
  }
};

export default function TechSelector({ isOpen, onClose, selectedTechs = [], onTechToggle }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('frontend');

  if (!isOpen) return null;

  const filteredTechs = searchTerm
    ? Object.values(techCategories).flatMap(category =>
        category.technologies.filter(tech =>
          tech.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : techCategories[activeCategory]?.technologies || [];

  const handleTechClick = (techName) => {
    onTechToggle(techName);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl w-[98vw] h-[90vh] flex flex-col max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-white">🏗️ System Design Components & Technologies</h2>
            <p className="text-sm text-gray-400 mt-1">Choose the technologies used in this service</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-700 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 text-white text-sm border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
            />
          </div>
        </div>

        {/* Horizontal Categories */}
        {!searchTerm && (
          <div className="px-6 py-4 border-b border-gray-700 flex-shrink-0">
            <div className="flex gap-2 overflow-x-auto">
              {Object.entries(techCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                    activeCategory === key
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
                  }`}
                >
                  <span className={`${category.color} mr-2`}>●</span>{category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Technologies Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
            {filteredTechs.map((tech) => (
              <button
                key={tech.name}
                onClick={() => handleTechClick(tech.name)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:scale-[1.02] ${
                  selectedTechs.includes(tech.name)
                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-300 shadow-lg shadow-purple-500/20'
                    : 'bg-gray-900/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500'
                }`}
              >
                <span className="text-2xl flex-shrink-0">{tech.icon}</span>
                <span className="text-sm font-medium text-left">{tech.name}</span>
              </button>
            ))}
          </div>
          
          {filteredTechs.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <p className="text-lg">No technologies found matching "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex items-center justify-between flex-shrink-0">
          <div className="text-base text-gray-400">
            <span className="font-medium text-purple-400">{selectedTechs.length}</span> technologies selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => selectedTechs.forEach(tech => onTechToggle(tech))}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors text-base"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-xl transition-all shadow-lg hover:shadow-xl text-base font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}