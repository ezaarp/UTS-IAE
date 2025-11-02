import { Card, Badge } from 'react-bootstrap';

const TransactionCard = ({ transaction, users = [] }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeBadge = (type) => {
    return type === 'topup' ? (
      <Badge bg="success">Top-Up</Badge>
    ) : (
      <Badge bg="info">Transfer</Badge>
    );
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : `User ${userId}`;
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          {getTypeBadge(transaction.type)}
          <span className="text-muted small">
            {formatDate(transaction.created_at)}
          </span>
        </div>
        <div className="transaction-amount mb-2">
          {formatCurrency(transaction.amount)}
        </div>
        <div className="text-muted small">
          {transaction.type === 'transfer' ? (
            <>
              <i className="bi bi-arrow-right-circle me-1"></i>
              {getUserName(transaction.user_id)} → {getUserName(transaction.target_user_id)}
            </>
          ) : (
            <>
              <i className="bi bi-plus-circle me-1"></i>
              {getUserName(transaction.user_id)}
            </>
          )}
        </div>
        {transaction.description && (
          <p className="mb-0 mt-2 small text-muted">{transaction.description}</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default TransactionCard;


