import { useState, useEffect } from 'react';
import { Users, FileText, Globe, TrendingUp } from 'lucide-react';

function DashboardStats({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading statistics...</div>;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: '#3498db',
      bgColor: '#ebf5fb'
    },
    {
      title: 'Content Entries',
      value: stats?.totalContent || 0,
      icon: FileText,
      color: '#27ae60',
      bgColor: '#eafaf1'
    },
    {
      title: 'Total Pages',
      value: stats?.totalPages || 0,
      icon: Globe,
      color: '#e74c3c',
      bgColor: '#fadbd8'
    },
    {
      title: 'System Status',
      value: 'Active',
      icon: TrendingUp,
      color: '#f39c12',
      bgColor: '#fef5e7'
    }
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="admin-card"
            style={{
              background: stat.bgColor,
              borderLeft: `4px solid ${stat.color}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 8px', color: '#7f8c8d', fontSize: '14px', fontWeight: '600' }}>
                  {stat.title}
                </p>
                <h2 style={{ margin: 0, color: stat.color, fontSize: '32px', fontWeight: '700' }}>
                  {stat.value}
                </h2>
              </div>
              <stat.icon size={48} style={{ color: stat.color, opacity: 0.3 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Quick Actions</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <button className="admin-btn admin-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNavigate('content')}>
            <FileText size={18} />
            Add New Content
          </button>
          <button className="admin-btn admin-btn-success" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNavigate('users')}>
            <Users size={18} />
            View All Users
          </button>
          <button className="admin-btn admin-btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNavigate('content')}>
            <Globe size={18} />
            Manage Pages
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>System Information</h3>
        </div>
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
            <span style={{ fontWeight: '600', color: '#2c3e50' }}>Server Status:</span>
            <span style={{ color: '#27ae60', fontWeight: '600' }}>● Online</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
            <span style={{ fontWeight: '600', color: '#2c3e50' }}>Database:</span>
            <span style={{ color: '#27ae60', fontWeight: '600' }}>● Connected</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
            <span style={{ fontWeight: '600', color: '#2c3e50' }}>API Version:</span>
            <span style={{ color: '#3498db', fontWeight: '600' }}>v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
