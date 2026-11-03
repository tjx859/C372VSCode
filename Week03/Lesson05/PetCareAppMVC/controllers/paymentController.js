const mockServices = require('../data/mockServices');

function preparePayment(req, res) {
  const serviceId = req.params.serviceId;

  if (!/^[1-9][0-9]*$/.test(serviceId)) {
    return res.status(400).json({ error: 'Invalid service ID' });
  }

  const service = mockServices.find((item) => String(item.id) === serviceId);

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  return res.status(200).json({
    serviceId: service.id,
    serviceName: service.serviceName,
    amount: service.price,
    currency: 'sgd',
    status: 'READY_FOR_PAYMENT'
  });
}

module.exports = { preparePayment };
