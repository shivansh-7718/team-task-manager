import { useEffect, useState, useCallback } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import '../../styles/dashboard.css';

const getBadgeClass = (status) => {
  if (status === 'Pending') return 'badge badge-pending';
  if (status === 'In Progress') return 'badge badge-progress';
  return 'badge badge-completed';
};

const getStatusClass = (status) => {
  if (status === 'Pending') return 'pending';
  if (status === 'In Progress') return 'progress';
  return 'completed';
};

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await API.get('/tasks/my');
      setTasks(data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success(`Marked as ${newStatus}`);
      fetchTasks(); // Refresh immediately
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      fetchTasks(); // Refresh immediately
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const now = new Date();
  const pending = tasks.filter(t => t.status === 'Pending');
  const inProgress = tasks.filter(t => t.status === 'In Progress');
  const completed = tasks.filter(t => t.status === 'Completed');
  const overdue = tasks.filter(
    t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Completed'
  );

  const filteredTasks = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Good day, {user?.name}! 👋</h1>
          <p className="page-subtitle">Here's your live task overview.</p>
        </div>
        <button className="btn-refresh" onClick={fetchTasks}>🔄 Refresh</button>
      </div>

      {/* Stats Cards - clicking them filters tasks */}
      <div className="stats-grid">
        <div
          className={`stat-card indigo ${filter === 'All' ? 'stat-active' : ''}`}
          onClick={() => setFilter('All')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-icon">📋</div>
          <div>
            <div className="stat-number">{tasks.length}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>
        <div
          className={`stat-card yellow ${filter === 'Pending' ? 'stat-active' : ''}`}
          onClick={() => setFilter('Pending')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-icon">⏳</div>
          <div>
            <div className="stat-number">{pending.length}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div
          className={`stat-card blue ${filter === 'In Progress' ? 'stat-active' : ''}`}
          onClick={() => setFilter('In Progress')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-icon">🔄</div>
          <div>
            <div className="stat-number">{inProgress.length}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div
          className={`stat-card green ${filter === 'Completed' ? 'stat-active' : ''}`}
          onClick={() => setFilter('Completed')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-icon">✅</div>
          <div>
            <div className="stat-number">{completed.length}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

      {/* Overdue Alert */}
      {overdue.length > 0 && (
        <div className="overdue-box">
          <div className="overdue-title">⚠️ Overdue Tasks ({overdue.length})</div>
          {overdue.map(t => (
            <div key={t._id} className="overdue-item">
              • {t.title} — Due: {new Date(t.dueDate).toLocaleDateString()}
              {t.project && <span style={{ color: '#a0aec0' }}> [{t.project.name}]</span>}
            </div>
          ))}
        </div>
      )}

      {/* Filter Label */}
      <div className="tasks-filter-bar">
        <div className="section-title">
          {filter === 'All' ? 'All My Tasks' : `${filter} Tasks`}
          <span className="task-count">({filteredTasks.length})</span>
        </div>
        {filter !== 'All' && (
          <button className="btn-clear-filter" onClick={() => setFilter('All')}>
            ✕ Clear filter
          </button>
        )}
      </div>

      {/* Task List */}
      {loading ? (
        <p className="loading">Loading your tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          {filter === 'All' ? 'No tasks assigned to you yet.' : `No ${filter} tasks.`}
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map(task => (
            <div
              key={task._id}
              className={`task-card ${task.status === 'Completed' ? 'task-card-done' : ''}`}
            >
              <div className="task-card-left">
                {/* Quick Complete Checkbox */}
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.status === 'Completed'}
                  onChange={() =>
                    handleStatusChange(
                      task._id,
                      task.status === 'Completed' ? 'Pending' : 'Completed'
                    )
                  }
                  title="Mark complete / incomplete"
                />
                <div>
                  <div className={`task-title ${task.status === 'Completed' ? 'task-strikethrough' : ''}`}>
                    {task.title}
                  </div>
                  <div className="task-desc">{task.description}</div>
                  <div className="task-meta">
                    {task.dueDate && (
                      <span className={new Date(task.dueDate) < now && task.status !== 'Completed' ? 'overdue-text' : ''}>
                        📅 {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.project && (
                      <span className="task-project">📁 {task.project.name}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="task-card-right">
                {/* Status Dropdown */}
                <select
                  className={`status-select ${getStatusClass(task.status)}`}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                >
                  <option value="Pending">⏳ Pending</option>
                  <option value="In Progress">🔄 In Progress</option>
                  <option value="Completed">✅ Completed</option>
                </select>

                {/* Delete Button */}
                <button
                  className="btn-delete-task"
                  onClick={() => handleDeleteTask(task._id)}
                  title="Delete task"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;