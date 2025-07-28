import ActionCable from 'actioncable';

const createCable = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'localhost:3000';
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

  const cleanUrl = envUrl.replace(/^https?:\/\//, '').replace(/^wss?:\/\//, '');

  return ActionCable.createConsumer(`${protocol}://${cleanUrl}/cable`);
};

const cable = createCable();
export default cable;