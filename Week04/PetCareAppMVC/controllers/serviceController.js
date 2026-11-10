const petModel = require('../models/petModel');
const serviceModel = require('../models/serviceModel');
const serviceBookingModel = require('../models/serviceBookingModel');

function getLocalTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidDateString(dateString) {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function listServices(req, res) {
  const ownerId = req.session.user.id;
  const requestedPetId = req.query.petId;

  petModel.getPetsByOwner(ownerId, (petErr, pets) => {
    if (petErr) {
      console.error('Error loading pets:', petErr);
      return res.status(500).send('Unable to load pets.');
    }

    serviceModel.getActiveServices((serviceErr, services) => {
      if (serviceErr) {
        console.error('Error loading services:', serviceErr);
        return res.status(500).send('Unable to load services.');
      }

      const selectedPetId = pets.some((pet) => String(pet.id) === String(requestedPetId))
        ? String(requestedPetId)
        : '';

      return res.render('services', {
        pets,
        services,
        selectedPetId,
        today: getLocalTodayString(),
        messages: req.flash('success'),
        errors: req.flash('error'),
        session: req.session
      });
    });
  });
}

function createBooking(req, res) {
  const ownerId = req.session.user.id;
  const petId = Number(req.body.petId);
  const serviceId = Number(req.body.serviceId);
  const bookingDate = req.body.bookingDate;

  if (
    !Number.isInteger(petId) || petId <= 0 ||
    !Number.isInteger(serviceId) || serviceId <= 0 ||
    !isValidDateString(bookingDate) ||
    bookingDate < getLocalTodayString()
  ) {
    req.flash('error', 'Choose a pet, service, and valid booking date.');
    return res.redirect('/services');
  }

  serviceBookingModel.createPendingBooking(ownerId, petId, serviceId, bookingDate, (dbErr, result) => {
    if (dbErr) {
      console.error('Failed to create booking:', dbErr);
      req.flash('error', 'Unable to create the booking. Please try again.');
      return res.redirect(`/services${petId ? `?petId=${petId}` : ''}`);
    }

    if (!result) {
      req.flash('error', 'That pet or service is unavailable for booking.');
      return res.redirect('/services');
    }

    req.flash('success', 'Booking created. Payment is pending; no payment has been processed.');
    return res.redirect('/bookings');
  });
}

function listBookings(req, res) {
  const ownerId = req.session.user.id;

  serviceBookingModel.getBookingsByOwner(ownerId, (err, bookings) => {
    if (err) {
      console.error('Error loading booking history:', err);
      return res.status(500).send('Unable to load booking history.');
    }

    return res.render('bookings', {
      bookings: bookings || [],
      messages: req.flash('success'),
      errors: req.flash('error'),
      session: req.session
    });
  });
}

module.exports = {
  listServices,
  createBooking,
  listBookings
};
