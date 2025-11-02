import { Card, Badge } from 'react-bootstrap';

const UserCard = ({ user }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="mb-1">{user.name}</h5>
            <p className="text-muted mb-2">
              <i className="bi bi-envelope me-1"></i>
              {user.email}
            </p>
            <div className="balance-amount">
              {formatCurrency(user.balance)}
            </div>
          </div>
          <Badge bg="primary" pill>
            ID: {user.id}
          </Badge>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserCard;


