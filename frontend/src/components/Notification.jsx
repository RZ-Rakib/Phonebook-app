
const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const baseStyle = {
    fontSize: '18px',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '12px',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  }

  const types = {
    success: {
      ...baseStyle,
      color: '#155724',
      background: '#d4edda',
      border: '2px solid #99d7a7ff',
    },
    error: {
      ...baseStyle,
      color: '#721c24',
      background: '#f8d7da',
      border: '1px solid #f5c6cb'
    }
  }
  return (
    <div style={types[type]}>{message}</div>
  )
}

export default Notification