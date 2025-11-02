import { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, 
  Modal, Form, Spinner, Alert, Badge, ButtonGroup
} from 'react-bootstrap';
import { userAPI, paymentAPI } from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Modal states
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [topupData, setTopupData] = useState({
    user_id: '',
    amount: ''
  });

  const [transferData, setTransferData] = useState({
    user_id: '',
    target_user_id: '',
    amount: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [transactionsRes, usersRes] = await Promise.all([
        paymentAPI.getAllTransactions(),
        userAPI.getAllUsers()
      ]);

      setTransactions(transactionsRes.data.data);
      setUsers(usersRes.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please make sure both services are running.');
      setLoading(false);
    }
  };

  const handleTopup = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      
      await paymentAPI.topup({
        user_id: parseInt(topupData.user_id),
        amount: parseFloat(topupData.amount)
      });
      
      setSuccess('Top-up successful!');
      setShowTopupModal(false);
      setTopupData({ user_id: '', amount: '' });
      fetchData();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error processing top-up:', err);
      setError(err.response?.data?.message || 'Failed to process top-up');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      
      await paymentAPI.transfer({
        user_id: parseInt(transferData.user_id),
        target_user_id: parseInt(transferData.target_user_id),
        amount: parseFloat(transferData.amount)
      });
      
      setSuccess('Transfer successful!');
      setShowTransferModal(false);
      setTransferData({ user_id: '', target_user_id: '', amount: '' });
      fetchData();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error processing transfer:', err);
      setError(err.response?.data?.message || 'Failed to process transfer');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : `User ${userId}`;
  };

  const getTypeBadge = (type) => {
    return type === 'topup' ? (
      <Badge bg="success">
        <i className="bi bi-plus-circle me-1"></i>
        Top-Up
      </Badge>
    ) : (
      <Badge bg="info">
        <i className="bi bi-arrow-left-right me-1"></i>
        Transfer
      </Badge>
    );
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading transactions...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 px-4">
      <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h1 className="fw-bold mb-2" style={{ color: '#1e293b', fontSize: '2rem' }}>
            <i className="bi bi-clock-history me-3" style={{ color: '#2563eb' }}></i>
            Transactions
          </h1>
          <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
            Manage top-ups and transfers
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant="success" 
            className="btn-action"
            onClick={() => setShowTopupModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Top-Up
          </Button>
          <Button 
            variant="info" 
            className="btn-action"
            onClick={() => setShowTransferModal(true)}
          >
            <i className="bi bi-arrow-left-right me-2"></i>
            Transfer
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Transaction History ({transactions.length})
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
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>
                        <Badge bg="secondary">{transaction.id}</Badge>
                      </td>
                      <td>{getTypeBadge(transaction.type)}</td>
                      <td>{getUserName(transaction.user_id)}</td>
                      <td>
                        {transaction.type === 'transfer' 
                          ? getUserName(transaction.target_user_id)
                          : '-'
                        }
                      </td>
                      <td className="transaction-amount">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td>
                        <Badge bg="success">
                          <i className="bi bi-check-circle me-1"></i>
                          {transaction.status}
                        </Badge>
                      </td>
                      <td className="text-muted small">
                        {formatDate(transaction.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {transactions.length === 0 && (
                <p className="text-center text-muted py-5">
                  No transactions found. Start by creating a top-up or transfer.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top-Up Modal */}
      <Modal show={showTopupModal} onHide={() => setShowTopupModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-plus-circle me-2"></i>
            Top-Up Balance
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTopup}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Select User *</Form.Label>
              <Form.Select
                value={topupData.user_id}
                onChange={(e) => setTopupData({ ...topupData, user_id: e.target.value })}
                required
              >
                <option value="">Choose user...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.email} (Balance: {formatCurrency(user.balance)})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount *</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter top-up amount"
                value={topupData.amount}
                onChange={(e) => setTopupData({ ...topupData, amount: e.target.value })}
                min="10000"
                step="1000"
                required
              />
              <Form.Text className="text-muted">
                Minimum top-up amount is IDR 10,000
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTopupModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Confirm Top-Up
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Transfer Modal */}
      <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-arrow-left-right me-2"></i>
            Transfer Balance
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTransfer}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>From (Sender) *</Form.Label>
              <Form.Select
                value={transferData.user_id}
                onChange={(e) => setTransferData({ ...transferData, user_id: e.target.value })}
                required
              >
                <option value="">Choose sender...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.email} (Balance: {formatCurrency(user.balance)})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>To (Receiver) *</Form.Label>
              <Form.Select
                value={transferData.target_user_id}
                onChange={(e) => setTransferData({ ...transferData, target_user_id: e.target.value })}
                required
              >
                <option value="">Choose receiver...</option>
                {users.filter(u => u.id.toString() !== transferData.user_id).map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount *</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter transfer amount"
                value={transferData.amount}
                onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                min="10000"
                step="1000"
                required
              />
              <Form.Text className="text-muted">
                Minimum transfer amount is IDR 10,000
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTransferModal(false)}>
              Cancel
            </Button>
            <Button variant="info" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Confirm Transfer
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Transactions;

