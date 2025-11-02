import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { userAPI, paymentAPI } from '../services/api';
import UserCard from '../components/UserCard';
import TransactionCard from '../components/TransactionCard';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usersRes, transactionsRes] = await Promise.all([
        userAPI.getAllUsers(),
        paymentAPI.getAllTransactions()
      ]);

      setUsers(usersRes.data.data);
      setTransactions(transactionsRes.data.data.slice(0, 10)); // Latest 10 transactions
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please make sure both services are running.');
      setLoading(false);
    }
  };

  const getTotalBalance = () => {
    return users.reduce((sum, user) => sum + parseFloat(user.balance), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading dashboard...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 px-4">
      <div className="mb-4">
        <h1 className="fw-bold mb-2" style={{ color: '#1e293b', fontSize: '2rem' }}>
          <i className="bi bi-speedometer2 me-3" style={{ color: '#2563eb' }}></i>
          Dashboard
        </h1>
        <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
          Overview of your digital payment system
        </p>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <div className="stats-card text-center">
            <div className="stats-icon primary mx-auto">
              <i className="bi bi-people"></i>
            </div>
            <h2 className="mb-1" style={{ color: '#1e293b', fontSize: '2rem', fontWeight: '700' }}>
              {users.length}
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.95rem', fontWeight: '500' }}>
              Total Users
            </p>
          </div>
        </Col>
        <Col md={4}>
          <div className="stats-card text-center">
            <div className="stats-icon success mx-auto">
              <i className="bi bi-wallet2"></i>
            </div>
            <h2 className="mb-1" style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: '700' }}>
              {formatCurrency(getTotalBalance())}
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.95rem', fontWeight: '500' }}>
              Total Balance
            </p>
          </div>
        </Col>
        <Col md={4}>
          <div className="stats-card text-center">
            <div className="stats-icon info mx-auto">
              <i className="bi bi-arrow-left-right"></i>
            </div>
            <h2 className="mb-1" style={{ color: '#1e293b', fontSize: '2rem', fontWeight: '700' }}>
              {transactions.length}
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.95rem', fontWeight: '500' }}>
              Recent Transactions
            </p>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Recent Users */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-people me-2"></i>
                Recent Users
              </h5>
              <Button 
                variant="light" 
                size="sm" 
                onClick={fetchData}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </Button>
            </Card.Header>
            <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {users.slice(0, 5).map(user => (
                <UserCard key={user.id} user={user} />
              ))}
              {users.length === 0 && (
                <p className="text-center text-muted">No users found</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Transactions */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Recent Transactions
              </h5>
              <Button 
                variant="light" 
                size="sm" 
                onClick={fetchData}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </Button>
            </Card.Header>
            <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {transactions.map(transaction => (
                <TransactionCard key={transaction.id} transaction={transaction} users={users} />
              ))}
              {transactions.length === 0 && (
                <p className="text-center text-muted">No transactions found</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-3 flex-wrap">
                <Button variant="primary" href="/users">
                  <i className="bi bi-person-plus me-2"></i>
                  Add User
                </Button>
                <Button variant="success" href="/transactions">
                  <i className="bi bi-plus-circle me-2"></i>
                  New Top-Up
                </Button>
                <Button variant="info" href="/transactions">
                  <i className="bi bi-arrow-left-right me-2"></i>
                  New Transfer
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

