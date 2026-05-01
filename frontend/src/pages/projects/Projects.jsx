import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import '../../styles/projects.css';
import '../../styles/dashboard.css';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projects', form);
      toast.success('Project created!');
      setForm({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await API.delete(`/projects/${id}`);
      toast.success('Project deleted');
      fetchProjects();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📁 Projects</h1>
        <button className="btn-create" onClick={() => setShowForm(!showForm)}>
          + New Project
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>Create New Project</h3>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                placeholder="Enter project name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Project description (optional)"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-submit">Create Project</button>
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="loading">Loading...</p>
      ) : projects.length === 0 ? (
        <div className="empty-state">No projects yet. Create one!</div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project._id} className="project-card">
              <div className="project-card-header">
                <div className="project-name">{project.name}</div>
                <div className="project-actions">
                  {(user.role === 'admin' || project.owner?._id === user._id) && (
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDelete(project._id)}
                      title="Delete project"
                    >
                      🗑️
                    </button>
                  )}
                  <Link to={`/projects/${project._id}`} className="btn-icon primary" title="Open project">
                    →
                  </Link>
                </div>
              </div>
              <div className="project-desc">{project.description || 'No description provided.'}</div>
              <div className="project-meta">
                <span>👤 {project.owner?.name}</span>
                <span>👥 {project.members?.length} member(s)</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;