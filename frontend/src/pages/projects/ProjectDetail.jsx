import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import '../../styles/projects.css';
import '../../styles/dashboard.css';

const getStatusClass = (status) => {
  if (status === 'Pending') return 'pending';
  if (status === 'In Progress') return 'progress';
  return 'completed';
};

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', assignedTo: '', dueDate: ''
  });

  const isOwner = project?.owner?._id === user._id;
  const canManage = user.role === 'admin' || isOwner;

  const fetchAll = async () => {
    try {
      const [proj, taskData] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/tasks/project/${id}`),
      ]);
      setProject(proj.data);
      setTasks(taskData.data);
    } catch {
      toast.error('Failed to load project');
    }
  };

  useEffect(() => { fetchAll(); }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', {
        ...taskForm,
        projectId: id,
        // If no one is selected, assign to yourself automatically
        assignedTo: taskForm.assignedTo || user._id,
      });
      toast.success('Task created!');
      setShowTaskForm(false);
      setTaskForm({ title: '', description: '', assignedTo: '', dueDate: '' });
      fetchAll();
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchAll();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      fetchAll();
    } catch {
      toast.error('Not authorized');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/projects/${id}/members`, { email: memberEmail });
      toast.success('Member added!');
      setMemberEmail('');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await API.delete(`/projects/${id}/members/${userId}`);
      toast.success('Member removed');
      fetchAll();
    } catch {
      toast.error('Failed to remove');
    }
  };

  if (!project) return <p className="loading" style={{ padding: 30 }}>Loading project...</p>;

  return (
    <div className="page-container">
      <h1 className="page-title">{project.name}</h1>
      <p className="page-subtitle">{project.description}</p>

      {/* Members */}
      <div className="form-card">
        <h3>👥 Team Members</h3>
        <div className="member-chips">
          {project.members?.map(m => (
            <div key={m._id} className="chip">
              {m.name}
              {canManage && m._id !== project.owner._id && (
                <button className="chip-remove" onClick={() => handleRemoveMember(m._id)}>×</button>
              )}
            </div>
          ))}
        </div>
        {canManage && (
          <form className="add-member-form" onSubmit={handleAddMember}>
            <input
              type="email"
              placeholder="Add member by email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-small">+ Add</button>
          </form>
        )}
      </div>

      {/* Tasks */}
      <div className="tasks-header">
        <div className="section-title">✅ Tasks ({tasks.length})</div>
        <button className="btn-create" onClick={() => setShowTaskForm(!showTaskForm)}>
          + Add Task
        </button>
      </div>

      {showTaskForm && (
        <div className="form-card">
          <h3>Create New Task</h3>
          <form onSubmit={handleCreateTask}>
            <div className="form-group">
              <label>Task Title</label>
              <input
                type="text"
                placeholder="Enter task title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Task description"
                rows={2}
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              />
            </div>
            <div className="task-form-grid">
              <div className="form-group">
                <label>Assign To</label>
                <select
  value={taskForm.assignedTo}
  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
>
  <option value="">Assign to myself</option>
  {project.members?.map(m => (
    <option key={m._id} value={m._id}>{m.name}</option>
  ))}
</select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-submit">Create Task</button>
              <button type="button" className="btn-cancel" onClick={() => setShowTaskForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">No tasks yet. Add one!</div>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="task-item">
              <div>
                <div className="task-title">{task.title}</div>
                <div className="task-desc">{task.description}</div>
                <div className="task-meta">
                  👤 {task.assignedTo?.name || 'Unassigned'}
                  {task.dueDate && <> &nbsp;• Due: {new Date(task.dueDate).toLocaleDateString()}</>}
                </div>
              </div>
              <div className="task-right">
                <select
                  className={`status-select ${getStatusClass(task.status)}`}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                {(canManage || task.createdBy?._id === user._id) && (
                  <button
                    className="btn-icon danger"
                    onClick={() => handleDeleteTask(task._id)}
                    title="Delete task"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;